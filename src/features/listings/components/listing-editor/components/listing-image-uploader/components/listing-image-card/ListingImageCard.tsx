import Image from "next/image";

import { ArrowRightIcon, DeleteIcon, IconButton } from "@/shared/ui";

import type { ListingUpload } from "../../listing-image-uploader.types";

export function ListingImageCard({
  deleting,
  disabled,
  image,
  index,
  isLast,
  labels,
  onMove,
  onRemove,
}: {
  deleting: boolean;
  disabled: boolean;
  image: ListingUpload;
  index: number;
  isLast: boolean;
  labels: {
    cover: string;
    moveEarlier: string;
    moveLater: string;
    remove: string;
    removing: string;
  };
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
}) {
  const alt = Object.values(image.alt).find((value) => value.trim()) ?? "";

  return (
    <article
      className="image-drag-handle relative aspect-square self-start overflow-hidden rounded-surface border border-border bg-surface-muted shadow-[2px_2px_0_rgb(24_28_28_/_10%)]"
      data-id={image.id}
    >
      <div className="relative h-full cursor-grab bg-disabled active:cursor-grabbing">
        <Image
          src={image.url}
          alt={alt}
          fill
          sizes="(max-width: 639px) 50vw, (max-width: 1279px) 33vw, 220px"
          className="object-cover"
        />

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col p-2">
          <div className="flex items-start justify-between gap-2">
            {index === 0 ? (
              <span className="inline-flex h-7 items-center rounded-compact bg-accent px-2 text-caption font-bold text-accent-content">
                {labels.cover}
              </span>
            ) : null}

            <IconButton
              aria-label={labels.remove}
              className="image-action pointer-events-auto ml-auto bg-surface/95"
              disabled={disabled || deleting}
              onClick={onRemove}
              size="xs"
              variant="outline"
            >
              <DeleteIcon className="size-3.5" />
            </IconButton>
          </div>

          <div className="mt-auto flex justify-end gap-1">
            <IconButton
              aria-label={labels.moveEarlier}
              className="image-action pointer-events-auto bg-surface/95"
              disabled={disabled || deleting || index === 0}
              onClick={() => onMove(-1)}
              size="xs"
              variant="outline"
            >
              <ArrowRightIcon className="size-3.5 rotate-180" />
            </IconButton>

            <IconButton
              aria-label={labels.moveLater}
              className="image-action pointer-events-auto bg-surface/95"
              disabled={disabled || deleting || isLast}
              onClick={() => onMove(1)}
              size="xs"
              variant="outline"
            >
              <ArrowRightIcon className="size-3.5" />
            </IconButton>
          </div>
        </div>

        {deleting ? (
          <div className="absolute inset-0 z-20 grid place-items-center bg-foreground/55 p-3 text-center text-surface">
            <div className="grid justify-items-center gap-2">
              <span
                aria-hidden="true"
                className="size-7 animate-spin rounded-full border-2 border-surface/35 border-t-surface motion-reduce:animate-none"
              />

              <span className="text-caption font-semibold">
                {labels.removing}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
