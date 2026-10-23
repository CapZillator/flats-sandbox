"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ReactSortable } from "react-sortablejs";
import classNames from "classnames";

import { browserApi } from "@/shared/api/client";
import type { Locale } from "@/shared/i18n/config";
import type { Dictionary } from "@/shared/i18n/dictionaries";
import { useToast } from "@/shared/hooks/useToast";
import { PhotoIcon, UploadIcon } from "@/shared/ui";

import { ListingImageCard } from "./components/listing-image-card/ListingImageCard";
import { PendingImageCard } from "./components/pending-image-card/PendingImageCard";
import {
  acceptedImageTypes,
  MAX_IMAGE_SIZE_MB,
  MAX_LISTING_IMAGES,
  MAX_PARALLEL_UPLOADS,
} from "./listing-image-uploader.constants";
import type {
  ListingUpload,
  PendingListingImage,
} from "./listing-image-uploader.types";

type DirectUpload = { id: string; uploadUrl: string };
type ConfirmedUpload = { id: string; url: string | null };

function createPendingImage(file: File): PendingListingImage {
  return {
    file,
    id: crypto.randomUUID(),
    previewUrl: URL.createObjectURL(file),
    status: "queued",
  };
}

function fileNameWithoutExtension(file: File) {
  return file.name.replace(/\.[^.]+$/, "");
}

export function ListingImageUploader({
  copy,
  disabled = false,
  images,
  locale,
  onBusyChange,
  onImagesChange,
}: {
  copy: Dictionary["listingForm"]["photos"];
  disabled?: boolean;
  images: ListingUpload[];
  locale: Locale;
  onBusyChange?: (isBusy: boolean) => void;
  onImagesChange: (images: ListingUpload[]) => void;
}) {
  const { showToast } = useToast();
  const [pendingImages, setPendingImages] = useState<PendingListingImage[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const imagesRef = useRef(images);
  const pendingImagesRef = useRef(pendingImages);
  const isUploading = pendingImages.some((image) => image.status !== "failed");
  const isBusy = isUploading || deletingIds.length > 0;
  const isLimitReached =
    images.length + pendingImages.length >= MAX_LISTING_IMAGES;

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    pendingImagesRef.current = pendingImages;
  }, [pendingImages]);

  useEffect(() => {
    onBusyChange?.(isBusy);
  }, [isBusy, onBusyChange]);

  useEffect(
    () => () => {
      for (const image of pendingImagesRef.current) {
        URL.revokeObjectURL(image.previewUrl);
      }

      onBusyChange?.(false);
    },
    [onBusyChange],
  );

  const setPendingStatus = useCallback(
    (id: string, status: PendingListingImage["status"]) => {
      setPendingImages((current) =>
        current.map((image) =>
          image.id === id ? { ...image, status } : image,
        ),
      );
    },
    [],
  );

  const uploadImage = useCallback(
    async (pendingImage: PendingListingImage) => {
      setPendingStatus(pendingImage.id, "uploading");
      let draftId: string | undefined;

      try {
        const draft = await browserApi<DirectUpload>("/uploads/images", {
          method: "POST",
        });
        draftId = draft.id;
        const body = new FormData();
        body.append("file", pendingImage.file);
        const response = await fetch(draft.uploadUrl, {
          body,
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Direct image upload failed");
        }

        const confirmed = await browserApi<ConfirmedUpload>(
          `/uploads/images/${draft.id}/confirm`,
          { method: "POST" },
        );

        if (!confirmed.url) {
          throw new Error("Confirmed image does not have a delivery URL");
        }

        return {
          alt: { [locale]: fileNameWithoutExtension(pendingImage.file) },
          id: confirmed.id,
          isNew: true,
          url: confirmed.url,
        } satisfies ListingUpload;
      } catch {
        setPendingStatus(pendingImage.id, "failed");

        if (draftId) {
          void browserApi(`/uploads/images/${draftId}`, {
            method: "DELETE",
          }).catch(() => undefined);
        }

        return null;
      }
    },
    [locale, setPendingStatus],
  );

  const uploadImages = useCallback(
    async (nextImages: PendingListingImage[]) => {
      const results: Array<ListingUpload | null> = [];

      for (
        let index = 0;
        index < nextImages.length;
        index += MAX_PARALLEL_UPLOADS
      ) {
        const batch = nextImages.slice(index, index + MAX_PARALLEL_UPLOADS);
        results.push(...(await Promise.all(batch.map(uploadImage))));
      }

      const successfulUploads = results.filter(
        (result): result is ListingUpload => result !== null,
      );
      const successfulIds = new Set(
        nextImages
          .filter((_, index) => results[index] !== null)
          .map((image) => image.id),
      );

      if (successfulUploads.length > 0) {
        const nextUploads = [...imagesRef.current, ...successfulUploads];
        imagesRef.current = nextUploads;
        onImagesChange(nextUploads);

        for (const image of nextImages) {
          if (successfulIds.has(image.id)) {
            URL.revokeObjectURL(image.previewUrl);
          }
        }

        setPendingImages((current) =>
          current.filter((image) => !successfulIds.has(image.id)),
        );
      }

      if (results.some((result) => result === null)) {
        showToast(copy.uploadFailed, "error");
      }
    },
    [copy.uploadFailed, onImagesChange, showToast, uploadImage],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      if (rejectedFiles.length > 0) {
        showToast(copy.invalidFile, "warning");
      }

      const availableSlots = Math.max(
        0,
        MAX_LISTING_IMAGES - imagesRef.current.length - pendingImages.length,
      );
      const filesToUpload = acceptedFiles.slice(0, availableSlots);

      if (filesToUpload.length < acceptedFiles.length) {
        showToast(copy.tooMany, "warning");
      }

      if (filesToUpload.length === 0) {
        return;
      }

      const nextPendingImages = filesToUpload.map(createPendingImage);
      setPendingImages((current) => [...current, ...nextPendingImages]);
      void uploadImages(nextPendingImages);
    },
    [
      copy.invalidFile,
      copy.tooMany,
      pendingImages.length,
      showToast,
      uploadImages,
    ],
  );

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: acceptedImageTypes,
    disabled: disabled || isUploading || isLimitReached,
    maxSize: MAX_IMAGE_SIZE_MB * 1024 * 1024,
    multiple: true,
    onDrop,
  });

  const removePendingImage = (image: PendingListingImage) => {
    URL.revokeObjectURL(image.previewUrl);
    setPendingImages((current) =>
      current.filter((candidate) => candidate.id !== image.id),
    );
  };

  const removeImage = async (image: ListingUpload) => {
    setDeletingIds((current) => [...current, image.id]);

    try {
      if (image.isNew) {
        await browserApi(`/uploads/images/${image.id}`, { method: "DELETE" });
      }

      const nextImages = imagesRef.current.filter(
        (candidate) => candidate.id !== image.id,
      );
      imagesRef.current = nextImages;
      onImagesChange(nextImages);
    } catch {
      showToast(copy.deleteFailed, "error");
    } finally {
      setDeletingIds((current) =>
        current.filter((imageId) => imageId !== image.id),
      );
    }
  };

  const moveImage = (index: number, offset: -1 | 1) => {
    const targetIndex = index + offset;

    if (targetIndex < 0 || targetIndex >= imagesRef.current.length) {
      return;
    }

    const nextImages = [...imagesRef.current];
    [nextImages[index], nextImages[targetIndex]] = [
      nextImages[targetIndex],
      nextImages[index],
    ];
    imagesRef.current = nextImages;
    onImagesChange(nextImages);
  };

  const updateOrder = (nextImages: ListingUpload[]) => {
    if (
      nextImages.every(
        (image, index) => image.id === imagesRef.current[index]?.id,
      )
    ) {
      return;
    }

    imagesRef.current = nextImages;
    onImagesChange(nextImages);
  };

  const hasImages = images.length > 0 || pendingImages.length > 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(15rem,0.8fr)_minmax(0,2fr)]">
      <div>
        <div
          {...getRootProps()}
          className={classNames(
            "flex items-center justify-center rounded-surface border-2 border-dashed p-5 text-center transition-colors",
            hasImages ? "min-h-40" : "h-48",
            isDragActive
              ? "border-foreground bg-accent/20"
              : "border-border bg-surface-muted",
            disabled || isUploading || isLimitReached
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:border-foreground hover:bg-surface",
          )}
        >
          <input {...getInputProps({ "aria-label": copy.add })} />

          <div className="grid justify-items-center gap-3">
            <UploadIcon className="size-10 text-foreground" />

            <div className="grid gap-1">
              <p className="text-body-sm font-semibold text-foreground">
                {copy.dragToAdd}
              </p>

              <p className="text-caption text-muted">{copy.restriction}</p>
            </div>
          </div>
        </div>

        <p className="mt-2 text-caption font-semibold text-muted">
          {images.length + pendingImages.length} / {MAX_LISTING_IMAGES}
        </p>
      </div>

      {hasImages ? (
        <div className="grid gap-3">
          {images.length > 0 ? (
            <ReactSortable
              animation={160}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
              disabled={disabled || isBusy}
              filter=".image-action"
              ghostClass="opacity-35"
              list={images}
              preventOnFilter={false}
              setList={updateOrder}
            >
              {images.map((image, index) => (
                <ListingImageCard
                  key={image.id}
                  deleting={deletingIds.includes(image.id)}
                  disabled={disabled || isBusy}
                  image={image}
                  index={index}
                  isLast={index === images.length - 1}
                  labels={copy}
                  onMove={(offset) => moveImage(index, offset)}
                  onRemove={() => void removeImage(image)}
                />
              ))}
            </ReactSortable>
          ) : null}

          {pendingImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {pendingImages.map((image) => (
                <PendingImageCard
                  key={image.id}
                  disabled={disabled}
                  image={image}
                  labels={copy}
                  onRemove={() => removePendingImage(image)}
                  onRetry={() => void uploadImages([image])}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="grid h-48 place-items-center self-start rounded-surface border border-border-light bg-surface p-6 text-center">
          <div className="grid justify-items-center gap-2 text-muted">
            <PhotoIcon className="size-9" />

            <p className="text-body-sm">{copy.empty}</p>
          </div>
        </div>
      )}
    </div>
  );
}
