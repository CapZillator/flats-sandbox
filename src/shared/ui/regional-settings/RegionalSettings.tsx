"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";

import {
  currencies,
  currencySymbols,
  defaultCurrency,
  isCurrency,
} from "@/shared/currency/currency";
import { useCurrency } from "@/shared/currency/components/currency-provider/CurrencyProvider";
import { isLocale, type Locale } from "@/shared/i18n/config";
import { localePathname } from "@/shared/i18n/routing";
import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  GlobeIcon,
} from "@/shared/ui/icon";

const copy = {
  en: {
    title: "Language and currency",
    heading: "Settings",
    language: "Language",
    currency: "Currency",
  },
  ru: {
    title: "Язык и валюта",
    heading: "Настройки",
    language: "Язык",
    currency: "Валюта",
  },
  vi: {
    title: "Ngôn ngữ và tiền tệ",
    heading: "Cài đặt",
    language: "Ngôn ngữ",
    currency: "Tiền tệ",
  },
};

export function RegionalSettings({
  locale,
  closeLabel,
}: {
  locale: Locale;
  closeLabel: string;
}) {
  const context = useCurrency();
  const currency = context?.currency ?? defaultCurrency(locale);
  const pathname = usePathname();
  const router = useRouter();
  const id = useId();
  const titleId = `${id}-title`;
  const dialogId = `${id}-dialog`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>();
  const labels = copy[locale];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isOpen]);

  const groups = [
    {
      key: "language",
      label: labels.language,
      value: locale,
      options: [
        { value: "en", label: "English" },
        { value: "ru", label: "Русский" },
        { value: "vi", label: "Tiếng Việt" },
      ],
      onChange: (value: string) => {
        if (!isLocale(value)) {
          return;
        }

        setIsOpen(false);
        router.push(
          `${localePathname(pathname, value)}${window.location.search}${window.location.hash}`,
        );
      },
    },
    {
      key: "currency",
      label: labels.currency,
      value: currency,
      options: currencies.map((value) => ({
        value,
        label: `${currencySymbols[value]} ${value}`,
      })),
      onChange: (value: string) => {
        if (!isCurrency(value)) {
          return;
        }

        context?.setCurrency(value);
        setIsOpen(false);
      },
    },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={labels.title}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogId : undefined}
        className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-control px-2 text-body-sm font-semibold text-foreground transition-colors hover:bg-surface-muted focus:bg-surface-muted sm:gap-2 sm:px-3"
        onClick={() => {
          const bounds = triggerRef.current?.getBoundingClientRect();

          if (bounds) {
            setPosition({
              "--panel-top": `${bounds.bottom + 8}px`,
              "--panel-right": `${Math.max(16, window.innerWidth - bounds.right)}px`,
            } as CSSProperties);
          }

          setIsOpen(true);
        }}
      >
        <GlobeIcon className="size-4 shrink-0" />

        <span>
          {locale.toUpperCase()} · {currencySymbols[currency]}
          <span className="hidden min-[360px]:inline"> {currency}</span>
        </span>

        <ChevronDownIcon
          className={classNames(
            "size-4 shrink-0 text-muted transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen
        ? createPortal(
            <dialog
              ref={dialogRef}
              id={dialogId}
              aria-labelledby={titleId}
              style={position}
              className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-overlay border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-foreground/45 backdrop:backdrop-blur-[1px] min-[720px]:left-auto min-[720px]:right-[var(--panel-right)] min-[720px]:top-[var(--panel-top)] min-[720px]:bottom-auto min-[720px]:w-80 min-[720px]:rounded-surface min-[720px]:backdrop:bg-transparent min-[720px]:backdrop:backdrop-blur-none"
              onCancel={(event) => {
                event.preventDefault();
                setIsOpen(false);
              }}
              onClose={() => setIsOpen(false)}
              onClick={(event) => {
                if (event.target !== event.currentTarget) {
                  return;
                }

                const bounds = event.currentTarget.getBoundingClientRect();

                if (
                  event.clientX < bounds.left ||
                  event.clientX > bounds.right ||
                  event.clientY < bounds.top ||
                  event.clientY > bounds.bottom
                ) {
                  setIsOpen(false);
                }
              }}
            >
              <div className="flex min-h-14 items-center gap-3 border-b border-border-light px-4 py-3">
                <GlobeIcon className="size-5 shrink-0" />

                <h2 id={titleId} className="min-w-0 flex-1 truncate text-h3">
                  {labels.heading}
                </h2>

                <button
                  type="button"
                  aria-label={closeLabel}
                  className="-mr-2 grid size-9 shrink-0 place-items-center rounded-control hover:bg-surface-muted"
                  onClick={() => setIsOpen(false)}
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>

              <div className="grid gap-5 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {groups.map((group) => (
                  <fieldset key={group.key} className="grid gap-1">
                    <legend className="mb-2 text-caption font-semibold text-muted">
                      {group.label}
                    </legend>

                    {group.options.map((option) => (
                      <label
                        key={option.value}
                        className={classNames(
                          "flex min-h-11 cursor-pointer items-center gap-3 rounded-control px-3 py-2 text-body-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground",
                          group.value === option.value
                            ? "bg-accent"
                            : "hover:bg-surface-muted",
                        )}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          name={`${id}-${group.key}`}
                          value={option.value}
                          checked={group.value === option.value}
                          onChange={() => group.onChange(option.value)}
                        />

                        <span className="flex-1">{option.label}</span>

                        <CheckIcon
                          className={classNames(
                            "size-4 shrink-0",
                            group.value === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </label>
                    ))}
                  </fieldset>
                ))}
              </div>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
