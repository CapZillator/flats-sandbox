import Image from "next/image";

import { Button, CloseIcon, IconButton } from "@/shared/ui";

import type { PendingListingImage } from "../../listing-image-uploader.types";

export function PendingImageCard({
  disabled,
  image,
  labels,
  onRemove,
  onRetry,
}: {
  disabled: boolean;
  image: PendingListingImage;
  labels: {
    remove: string;
    retry: string;
    uploadFailed: string;
    uploading: string;
  };
  onRemove: () => void;
  onRetry: () => void;
}) {
  const isUploading = image.status !== "failed";

  return (
    <article className="pending-image relative aspect-square overflow-hidden rounded-surface border border-border bg-disabled">
      <Image
        src={image.previewUrl}
        alt={image.file.name}
        fill
        unoptimized
        className="object-cover"
      />

      <div className="absolute inset-0 grid place-items-center bg-foreground/55 p-3 text-center text-surface">
        {isUploading ? (
          <div className="grid justify-items-center gap-2">
            <span
              aria-hidden="true"
              className="size-7 animate-spin rounded-full border-2 border-surface/35 border-t-surface motion-reduce:animate-none"
            />

            <span className="text-caption font-semibold">
              {labels.uploading}
            </span>
          </div>
        ) : (
          <div className="grid justify-items-center gap-2">
            <span className="text-caption font-semibold">
              {labels.uploadFailed}
            </span>

            <Button
              disabled={disabled}
              onClick={onRetry}
              size="sm"
              variant="outline"
            >
              {labels.retry}
            </Button>
          </div>
        )}
      </div>

      {!isUploading ? (
        <IconButton
          aria-label={labels.remove}
          className="image-action absolute top-2 right-2 bg-surface/95"
          disabled={disabled}
          onClick={onRemove}
          size="xs"
          variant="outline"
        >
          <CloseIcon className="size-3.5" />
        </IconButton>
      ) : null}
    </article>
  );
}
