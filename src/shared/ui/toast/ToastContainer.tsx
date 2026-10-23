"use client";

import classNames from "classnames";
import type { ComponentType, SVGProps } from "react";

import {
  type ToastVariant,
  useToastContext,
} from "@/shared/model/toast/ToastContext";
import {
  CloseIcon,
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "@/shared/ui/icon";

const variantClasses: Record<ToastVariant, string> = {
  success: "border-l-success",
  error: "border-l-danger",
  warning: "border-l-warning",
  info: "border-l-foreground",
};

const iconClasses: Record<ToastVariant, string> = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
  info: "text-foreground",
};

const icons: Record<ToastVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

export function ToastContainer({ dismissLabel }: { dismissLabel: string }) {
  const { removeToast, toasts } = useToastContext();

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:right-6 sm:left-auto sm:w-full sm:max-w-sm">
      {toasts.map(({ id, message, variant }) => {
        const StateIcon = icons[variant];

        return (
          <div
            className={classNames(
              "pointer-events-auto grid w-full animate-[toast-in_180ms_ease-out] grid-cols-[auto_1fr_auto] items-start gap-3 rounded-surface border border-l-4 border-border bg-surface px-4 py-3 text-body-sm text-foreground shadow-[4px_4px_0_rgb(24_28_28_/_15%)] motion-reduce:animate-none",
              variantClasses[variant],
            )}
            key={id}
            role={
              variant === "error" || variant === "warning" ? "alert" : "status"
            }
            aria-atomic="true"
          >
            <StateIcon
              className={classNames(
                "mt-0.5 size-5 shrink-0",
                iconClasses[variant],
              )}
            />

            <p className="min-w-0 break-words">{message}</p>

            <button
              aria-label={dismissLabel}
              className="-m-1 flex size-7 items-center justify-center rounded-compact text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              onClick={() => removeToast(id)}
              type="button"
            >
              <CloseIcon className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
