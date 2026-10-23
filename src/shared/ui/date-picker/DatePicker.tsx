"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ButtonHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { enUS, ru, vi, type Locale as DateFnsLocale } from "date-fns/locale";
import { DayPicker, type Matcher } from "react-day-picker";
import classNames from "classnames";

import type { Locale } from "@/shared/i18n/config";
import { Button } from "@/shared/ui/button";
import {
  controlHeightClasses,
  type ControlSize,
} from "@/shared/ui/control-size/control-size";
import { CalendarIcon, CloseIcon } from "@/shared/ui/icon";

export type DatePickerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "defaultValue" | "name" | "onChange" | "value"
> & {
  clearLabel?: string;
  closeLabel?: string;
  containerClassName?: string;
  defaultValue?: string;
  dialogLabel?: string;
  invalid?: boolean;
  locale: Locale;
  max?: string;
  min?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  popoverAlign?: "left" | "right";
  required?: boolean;
  size?: ControlSize;
  todayLabel?: string;
  value?: string;
};

const mobileQuery = "(max-width: 719px)";
const dateLocales: Record<Locale, DateFnsLocale> = { en: enUS, ru, vi };

function subscribeToMobileQuery(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => undefined;
  }

  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

function getMobileSnapshot() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.(mobileQuery).matches)
  );
}

function getServerMobileSnapshot() {
  return false;
}

function parseDateOnly(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isBeforeDay(date: Date, boundary?: Date) {
  if (!boundary) {
    return false;
  }

  return formatDateOnly(date) < formatDateOnly(boundary);
}

function isAfterDay(date: Date, boundary?: Date) {
  if (!boundary) {
    return false;
  }

  return formatDateOnly(date) > formatDateOnly(boundary);
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(
    {
      "aria-describedby": describedBy,
      "aria-label": ariaLabel,
      className,
      clearLabel = "Clear",
      closeLabel = "Close",
      containerClassName,
      defaultValue = "",
      dialogLabel = "Choose date",
      disabled = false,
      id,
      invalid = false,
      locale,
      max,
      min,
      name,
      onBlur,
      onValueChange,
      placeholder = "dd/mm/yyyy",
      popoverAlign = "left",
      required,
      size = "md",
      todayLabel = "Today",
      value,
      ...buttonProps
    },
    forwardedRef,
  ) {
    const reactId = useId().replaceAll(":", "");
    const triggerId = id ?? `date-picker-${reactId}`;
    const dialogId = `${triggerId}-dialog`;
    const titleId = `${triggerId}-title`;
    const isMobile = useSyncExternalStore(
      subscribeToMobileQuery,
      getMobileSnapshot,
      getServerMobileSnapshot,
    );
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const selectedValue = value ?? internalValue;
    const selectedDate = useMemo(
      () => parseDateOnly(selectedValue),
      [selectedValue],
    );
    const minDate = useMemo(() => parseDateOnly(min), [min]);
    const maxDate = useMemo(() => parseDateOnly(max), [max]);
    const today = useMemo(() => new Date(), []);
    const todayIsDisabled =
      isBeforeDay(today, minDate) || isAfterDay(today, maxDate);
    const disabledDays = useMemo<Matcher[]>(
      () => [
        ...(minDate ? [{ before: minDate }] : []),
        ...(maxDate ? [{ after: maxDate }] : []),
      ],
      [maxDate, minDate],
    );
    const displayValue = selectedDate
      ? new Intl.DateTimeFormat(locale, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(selectedDate)
      : "";

    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const closePicker = useCallback((restoreFocus = true) => {
      setIsOpen(false);

      if (restoreFocus) {
        queueMicrotask(() => triggerRef.current?.focus());
      }
    }, []);

    const updateValue = useCallback(
      (nextValue: string) => {
        if (value === undefined) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
      [onValueChange, value],
    );

    const selectDate = (date: Date | undefined) => {
      if (!date) {
        return;
      }

      updateValue(formatDateOnly(date));
      closePicker();
    };

    useEffect(() => {
      if (!isOpen || !isMobile) {
        return;
      }

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }, [isMobile, isOpen]);

    useEffect(() => {
      if (!isOpen || isMobile) {
        return;
      }

      const handlePointerDown = (event: PointerEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) {
          closePicker(false);
        }
      };

      document.addEventListener("pointerdown", handlePointerDown, true);

      return () =>
        document.removeEventListener("pointerdown", handlePointerDown, true);
    }, [closePicker, isMobile, isOpen]);

    useEffect(() => {
      const form = triggerRef.current?.form;

      if (!form || value !== undefined) {
        return;
      }

      const handleReset = () => setInternalValue(defaultValue);
      form.addEventListener("reset", handleReset);

      return () => form.removeEventListener("reset", handleReset);
    }, [defaultValue, value]);

    const calendar = (
      <div className="mx-auto w-full max-w-[30rem]">
        <DayPicker
          animate
          autoFocus
          className="nestly-calendar"
          defaultMonth={selectedDate ?? minDate ?? today}
          disabled={disabledDays}
          endMonth={maxDate}
          fixedWeeks
          locale={dateLocales[locale]}
          mode="single"
          navLayout="around"
          onSelect={selectDate}
          required={required}
          selected={selectedDate}
          showOutsideDays
          startMonth={minDate}
        />

        <div className="mt-2 flex items-center justify-between border-t border-border-light pt-2">
          <Button
            disabled={!selectedValue || required}
            onClick={() => {
              updateValue("");
              closePicker();
            }}
            size="sm"
            type="button"
            variant="ghost"
          >
            {clearLabel}
          </Button>

          <Button
            disabled={todayIsDisabled}
            onClick={() => selectDate(today)}
            size="sm"
            type="button"
            variant="ghost"
          >
            {todayLabel}
          </Button>
        </div>
      </div>
    );

    const mobileSheet =
      isOpen && isMobile
        ? createPortal(
            <div className="fixed inset-0 z-[120]" role="presentation">
              <div
                aria-hidden="true"
                className="absolute inset-0 cursor-default bg-foreground/45 backdrop-blur-[1px]"
                onClick={() => closePicker()}
              />

              <section
                id={dialogId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={classNames(
                  "absolute inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-overlay border-t border-border bg-surface px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3",
                  "animate-[dropdown-sheet-in_180ms_ease-out] shadow-[0_-4px_0_rgb(24_28_28_/_0.12)]",
                  "motion-reduce:animate-none",
                )}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    closePicker();
                  }
                }}
              >
                <div className="mb-2 flex min-h-11 items-center gap-3 border-b border-border-light pb-2">
                  <CalendarIcon className="size-5 shrink-0" />

                  <h2 id={titleId} className="min-w-0 flex-1 truncate text-h3">
                    {dialogLabel}
                  </h2>

                  <button
                    type="button"
                    aria-label={closeLabel}
                    className="grid size-10 shrink-0 place-items-center rounded-control hover:bg-surface-muted"
                    onClick={() => closePicker()}
                  >
                    <CloseIcon className="size-5" />
                  </button>
                </div>

                {calendar}
              </section>
            </div>,
            document.body,
          )
        : null;

    return (
      <div
        ref={rootRef}
        className={classNames("relative min-w-0", containerClassName)}
      >
        {name ? (
          <input
            type="hidden"
            name={name}
            value={selectedValue}
            disabled={disabled}
          />
        ) : null}

        <button
          {...buttonProps}
          ref={setTriggerRef}
          id={triggerId}
          type="button"
          disabled={disabled}
          aria-controls={isOpen ? dialogId : undefined}
          aria-describedby={describedBy}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={ariaLabel}
          className={classNames(
            "flex w-full max-w-full items-center gap-3 rounded-control border bg-surface px-3 text-left text-foreground",
            "transition-colors duration-150 hover:border-foreground-soft focus:border-foreground",
            "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-muted",
            controlHeightClasses[size],
            invalid ? "border-danger focus:border-danger" : "border-border",
            isOpen && !invalid && "border-foreground",
            className,
          )}
          onBlur={onBlur}
          onClick={() => setIsOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && isOpen) {
              event.preventDefault();
              closePicker();
            }
          }}
        >
          <span
            className={classNames(
              "min-w-0 flex-1 truncate",
              !displayValue && "text-muted",
            )}
          >
            {displayValue || placeholder}
          </span>

          <CalendarIcon className="size-5 shrink-0" />
        </button>

        {isOpen && !isMobile ? (
          <div
            id={dialogId}
            role="dialog"
            aria-label={dialogLabel}
            className={classNames(
              "absolute top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-surface border border-border bg-surface p-3",
              "animate-[dropdown-popover-in_140ms_ease-out] shadow-[4px_4px_0_rgb(24_28_28_/_0.14)]",
              "motion-reduce:animate-none",
              popoverAlign === "right" ? "right-0" : "left-0",
            )}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closePicker();
              }
            }}
          >
            {calendar}
          </div>
        ) : null}

        {mobileSheet}
      </div>
    );
  },
);
