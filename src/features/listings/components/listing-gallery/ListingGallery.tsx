"use client";

import { useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useKeenSlider } from "keen-slider/react";

import type { ListingImage } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { ArrowRightIcon, IconButton, PhotoIcon } from "@/shared/ui";
import { getListingDetailCopy } from "../listing-detail/listing-detail.copy";

export function ListingGallery({
  images,
  title,
  locale,
}: {
  images: ListingImage[];
  title: string;
  locale: Locale;
}) {
  const [index, setIndex] = useState(0);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: images.length > 1,
    drag: images.length > 1,
    slides: { perView: 1, number: images.length },
    defaultAnimation: { duration: 280 },
    breakpoints: {
      "(prefers-reduced-motion: reduce)": {
        defaultAnimation: { duration: 0 },
      },
    },
    slideChanged(instance) {
      setIndex(instance.track.details.rel);
    },
  });
  const copy = getListingDetailCopy(locale);
  const image = images[index] ?? images[0];

  if (!image) {
    return (
      <div className="grid aspect-[4/3] place-content-center justify-items-center gap-3 rounded-surface border border-border bg-surface-muted text-muted sm:aspect-[7/5]">
        <PhotoIcon className="size-10" />

        <p className="text-body-sm">{copy.noPhotos}</p>
      </div>
    );
  }

  return (
    <section aria-label={copy.photos} className="grid min-w-0 gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-surface border border-border bg-surface-muted sm:aspect-[7/5]">
        <div ref={sliderRef} className="keen-slider h-full">
          {images.map((item, photoIndex) => (
            <div
              key={item.id}
              className="keen-slider__slide"
              aria-hidden={index !== photoIndex}
            >
              <Image
                src={item.url}
                alt={getLocalizedText(item.alt, locale) || title}
                fill
                sizes="(min-width: 1440px) 1008px, (min-width: 1024px) calc(100vw - 27rem), (min-width: 768px) calc(100vw - 3rem), calc(100vw - 2rem)"
                className="object-cover"
                draggable={false}
                loading={
                  photoIndex === 0 || photoIndex === index ? "eager" : "lazy"
                }
              />
            </div>
          ))}
        </div>

        {images.length > 1 ? (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between max-sm:hidden">
              <IconButton
                aria-label={copy.previous}
                variant="outline"
                className="pointer-events-auto"
                onClick={() => slider.current?.prev()}
              >
                <ArrowRightIcon className="size-5 rotate-180" />
              </IconButton>

              <IconButton
                aria-label={copy.next}
                variant="outline"
                className="pointer-events-auto"
                onClick={() => slider.current?.next()}
              >
                <ArrowRightIcon className="size-5" />
              </IconButton>
            </div>

            <span
              className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-compact bg-surface/95 px-3 py-1 text-caption font-semibold text-foreground"
              aria-live="polite"
            >
              {index + 1} / {images.length}
            </span>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div
          className="flex gap-2 overflow-x-auto py-1"
          role="group"
          aria-label={copy.photos}
        >
          {images.map((item, photoIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${copy.photo} ${photoIndex + 1}`}
              aria-pressed={index === photoIndex}
              onClick={() => slider.current?.moveToIdx(photoIndex)}
              className={classNames(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-control border-2 sm:h-20 sm:w-28",
                index === photoIndex
                  ? "border-foreground"
                  : "border-transparent hover:border-border",
              )}
            >
              <Image
                src={item.url}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
