"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import {
  controlHeightClasses,
  type ControlSize,
} from "@/shared/ui/control-size/control-size";
import { CheckIcon, ChevronDownIcon, CloseIcon } from "@/shared/ui/icon";

export type AdaptiveDropdownOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type AdaptiveDropdownProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "defaultValue" | "name" | "onChange" | "value"
> & {
  closeLabel?: string;
  containerClassName?: string;
  defaultValue?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  invalid?: boolean;
  name?: string;
  onValueChange?: (value: string) => void;
  options: AdaptiveDropdownOption[];
  popoverAlign?: "left" | "right";
  popoverClassName?: string;
  sheetIcon?: ReactNode;
  sheetTitle?: string;
  size?: ControlSize;
  required?: boolean;
  value?: string;
  variant?: "outline" | "ghost";
};

const mobileQuery = "(max-width: 719px)";

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

function nextEnabledIndex(
  options: AdaptiveDropdownOption[],
  currentIndex: number,
  direction: 1 | -1,
) {
  if (options.length === 0) {
    return -1;
  }

  for (let step = 1; step <= options.length; step += 1) {
    const index =
      (currentIndex + direction * step + options.length) % options.length;

    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function boundaryEnabledIndex(
  options: AdaptiveDropdownOption[],
  edge: "first" | "last",
) {
  const indexes = options.map((_, index) => index);

  if (edge === "last") {
    indexes.reverse();
  }

  return indexes.find((index) => !options[index]?.disabled) ?? -1;
}

export const AdaptiveDropdown = forwardRef<
  HTMLButtonElement,
  AdaptiveDropdownProps
>(function AdaptiveDropdown(
  {
    "aria-describedby": describedBy,
    "aria-label": ariaLabel,
    className,
    closeLabel = "Close",
    containerClassName,
    defaultValue = "",
    disabled = false,
    fullWidth = true,
    icon,
    id,
    invalid = false,
    name,
    onBlur,
    onValueChange,
    options,
    popoverAlign = "left",
    popoverClassName,
    required,
    sheetIcon,
    sheetTitle,
    size = "md",
    value,
    variant = "outline",
    ...buttonProps
  },
  forwardedRef,
) {
  const reactId = useId().replaceAll(":", "");
  const triggerId = id ?? `adaptive-dropdown-${reactId}`;
  const listboxId = `${triggerId}-listbox`;
  const titleId = `${triggerId}-title`;
  const isMobile = useSyncExternalStore(
    subscribeToMobileQuery,
    getMobileSnapshot,
    getServerMobileSnapshot,
  );
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedValue = value ?? internalValue;
  const selectedIndex = options.findIndex(
    (option) => option.value === selectedValue,
  );
  const selectedOption =
    options[selectedIndex] ?? options.find((option) => !option.disabled);

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

  const closeDropdown = useCallback((restoreFocus = true) => {
    setIsOpen(false);

    if (restoreFocus) {
      queueMicrotask(() => triggerRef.current?.focus());
    }
  }, []);

  const openDropdown = useCallback(() => {
    if (disabled || options.length === 0) {
      return;
    }

    setActiveIndex(
      selectedIndex >= 0 && !options[selectedIndex]?.disabled
        ? selectedIndex
        : boundaryEnabledIndex(options, "first"),
    );
    setIsOpen(true);
  }, [disabled, options, selectedIndex]);

  const selectOption = useCallback(
    (index: number) => {
      const option = options[index];

      if (!option || option.disabled) {
        return;
      }

      if (value === undefined) {
        setInternalValue(option.value);
      }

      onValueChange?.(option.value);
      closeDropdown();
    },
    [closeDropdown, onValueChange, options, value],
  );

  const handleListNavigation = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDropdown();

        return;
      }

      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        setActiveIndex(
          boundaryEnabledIndex(
            options,
            event.key === "Home" ? "first" : "last",
          ),
        );

        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) =>
          nextEnabledIndex(
            options,
            current,
            event.key === "ArrowDown" ? 1 : -1,
          ),
        );

        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectOption(activeIndex);
      }
    },
    [activeIndex, closeDropdown, options, selectOption],
  );

  useEffect(() => {
    if (!isOpen || !isMobile) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => listboxRef.current?.focus());

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
        closeDropdown(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [closeDropdown, isMobile, isOpen]);

  useEffect(() => {
    const form = triggerRef.current?.form;

    if (!form || value !== undefined) {
      return;
    }

    const handleReset = () => setInternalValue(defaultValue);
    form.addEventListener("reset", handleReset);

    return () => form.removeEventListener("reset", handleReset);
  }, [defaultValue, value]);

  const optionsList = (
    <div
      ref={listboxRef}
      id={listboxId}
      role="listbox"
      tabIndex={isMobile ? 0 : -1}
      aria-activedescendant={
        activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
      }
      aria-labelledby={isMobile ? titleId : triggerId}
      className="max-h-[min(20rem,60dvh)] overflow-y-auto overscroll-contain p-1"
      onKeyDown={handleListNavigation}
    >
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;
        const isActive = index === activeIndex;

        return (
          <div
            key={option.value}
            id={`${listboxId}-option-${index}`}
            role="option"
            aria-disabled={option.disabled || undefined}
            aria-selected={isSelected}
            className={classNames(
              "flex min-h-11 items-center gap-3 rounded-compact px-3 py-2 text-body-sm font-medium",
              "transition-colors duration-150 motion-reduce:transition-none",
              option.disabled
                ? "cursor-not-allowed text-muted opacity-50"
                : "cursor-pointer text-foreground",
              !option.disabled &&
                (isSelected
                  ? "bg-accent"
                  : isActive
                    ? "bg-surface-muted"
                    : undefined),
            )}
            onClick={() => selectOption(index)}
            onPointerMove={() => !option.disabled && setActiveIndex(index)}
          >
            <span className="min-w-0 flex-1 truncate">{option.label}</span>

            <CheckIcon
              className={classNames(
                "size-4 shrink-0 text-foreground transition-opacity",
                isSelected ? "opacity-100" : "opacity-0",
              )}
            />
          </div>
        );
      })}
    </div>
  );

  const mobileSheet =
    isOpen && isMobile
      ? createPortal(
          <div className="fixed inset-0 z-[120]" role="presentation">
            <div
              aria-hidden="true"
              className="absolute inset-0 cursor-default bg-foreground/45 backdrop-blur-[1px]"
              onClick={() => closeDropdown()}
            />

            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={classNames(
                "absolute inset-x-0 bottom-0 max-h-[85dvh] rounded-t-overlay border-t border-border bg-surface",
                "animate-[dropdown-sheet-in_180ms_ease-out] shadow-[0_-4px_0_rgb(24_28_28_/_0.12)]",
                "motion-reduce:animate-none",
              )}
              onKeyDown={(event) => {
                if (event.key !== "Tab") {
                  return;
                }

                event.preventDefault();
                const focusList =
                  (event.shiftKey &&
                    document.activeElement === closeButtonRef.current) ||
                  (!event.shiftKey &&
                    document.activeElement !== listboxRef.current);

                if (focusList) {
                  listboxRef.current?.focus();
                } else {
                  closeButtonRef.current?.focus();
                }
              }}
            >
              <div className="flex min-h-14 items-center gap-3 border-b border-border-light px-4 py-3">
                {sheetIcon ? (
                  <span className="shrink-0 text-foreground" aria-hidden="true">
                    {sheetIcon}
                  </span>
                ) : null}

                <h2 id={titleId} className="min-w-0 flex-1 truncate text-h3">
                  {sheetTitle ?? ariaLabel ?? selectedOption?.label}
                </h2>

                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label={closeLabel}
                  className="-mr-3 grid size-10 shrink-0 place-items-center rounded-control text-foreground hover:bg-surface-muted"
                  onClick={() => closeDropdown()}
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>

              {optionsList}

              <div
                className="h-[max(1rem,env(safe-area-inset-bottom))]"
                aria-hidden="true"
              />
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
        role="combobox"
        disabled={disabled}
        aria-controls={listboxId}
        aria-describedby={describedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        aria-required={required || undefined}
        aria-activedescendant={
          isOpen && !isMobile && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        className={classNames(
          "flex max-w-full items-center rounded-control border px-3 text-left text-foreground",
          controlHeightClasses[size],
          size === "sm" ? "py-1.5 text-body-sm" : "py-2 text-body",
          "transition-colors duration-150 motion-reduce:transition-none",
          "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted",
          fullWidth ? "w-full gap-3" : "w-fit gap-2",
          variant === "outline" &&
            "border-border bg-surface hover:border-foreground-soft focus:border-foreground disabled:border-disabled",
          variant === "ghost" &&
            "border-transparent bg-transparent hover:bg-surface-muted focus:bg-surface-muted disabled:border-transparent",
          invalid && "border-danger focus:border-danger",
          className,
        )}
        onBlur={onBlur}
        onClick={() => (isOpen ? closeDropdown(false) : openDropdown())}
        onKeyDown={(event) => {
          if (
            !isOpen &&
            ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)
          ) {
            event.preventDefault();
            openDropdown();

            return;
          }

          if (isOpen) {
            handleListNavigation(event);
          }
        }}
      >
        {icon ? (
          <span className="shrink-0 text-foreground" aria-hidden="true">
            {icon}
          </span>
        ) : null}

        <span className={classNames("min-w-0 truncate", fullWidth && "flex-1")}>
          {selectedOption?.label}
        </span>

        <ChevronDownIcon
          className={classNames(
            "size-4 shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && !isMobile ? (
        <div
          className={classNames(
            "absolute top-full z-50 mt-2 w-full rounded-surface border border-border bg-surface",
            "animate-[dropdown-popover-in_140ms_ease-out] shadow-[4px_4px_0_rgb(24_28_28_/_0.14)]",
            "motion-reduce:animate-none",
            popoverAlign === "right" ? "right-0" : "left-0",
            popoverClassName,
          )}
        >
          {optionsList}
        </div>
      ) : null}

      {mobileSheet}
    </div>
  );
});
