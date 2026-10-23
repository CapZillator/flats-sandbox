"use client";

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import classNames from "classnames";

import { CloseIcon } from "../icon";
import { lockModalScroll } from "./modal-scroll-lock";

export type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  footerDivider?: boolean;
  closeLabel?: string;
  dismissible?: boolean;
  busy?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
};

export function Modal({
  open,
  title,
  description,
  children,
  footer,
  footerDivider = true,
  closeLabel,
  dismissible = true,
  busy = false,
  initialFocusRef,
  onClose,
}: ModalProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropPointerDown = useRef(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const previousFocus = document.activeElement;
    const unlockScroll = lockModalScroll();
    dialog.showModal();
    initialFocusRef?.current?.focus();

    return () => {
      dialog.close();
      unlockScroll();

      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [open, initialFocusRef]);

  function isBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) {
      return false;
    }

    const bounds = event.currentTarget.getBoundingClientRect();

    return (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    );
  }

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      aria-busy={busy || undefined}
      className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-overlay border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-foreground/45 backdrop:backdrop-blur-[1px] min-[720px]:inset-0 min-[720px]:m-auto min-[720px]:max-h-[calc(100dvh_-_2rem)] min-[720px]:w-[calc(100%_-_2rem)] min-[720px]:max-w-lg min-[720px]:rounded-overlay"
      onCancel={(event) => {
        event.preventDefault();

        if (dismissible) {
          onClose();
        }
      }}
      onClose={() => {
        if (open && !dialogRef.current?.open && dismissible) {
          onClose();
        }
      }}
      onPointerDown={(event) => {
        backdropPointerDown.current = isBackdrop(event);
      }}
      onClick={(event) => {
        if (dismissible && backdropPointerDown.current && isBackdrop(event)) {
          onClose();
        }

        backdropPointerDown.current = false;
      }}
    >
      <div className="grid gap-5 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] min-[720px]:p-6">
        <header className="flex items-start justify-between gap-4">
          <h2 id={`${id}-title`} className="min-w-0 break-words text-h3">
            {title}
          </h2>

          {closeLabel ? (
            <button
              type="button"
              aria-label={closeLabel}
              disabled={!dismissible}
              className="-mr-2 -mt-2 grid size-9 shrink-0 place-items-center rounded-control hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onClose}
            >
              <CloseIcon className="size-5" />
            </button>
          ) : null}
        </header>

        {description ? (
          <p id={`${id}-description`} className="text-body-sm text-muted">
            {description}
          </p>
        ) : null}

        {children}

        {footer ? (
          <footer
            className={classNames(
              "flex flex-wrap justify-end gap-2 pt-4",
              footerDivider && "border-t border-border-light",
            )}
          >
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
