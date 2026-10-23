"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { CloseIcon, MenuIcon } from "@/shared/ui";

export function NavigationDrawer({
  children,
  label,
  closeLabel,
}: {
  children: ReactNode;
  label: string;
  closeLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktopQuery.matches) {
        setIsOpen(false);
      }
    };

    dialog?.showModal();
    document.body.style.overflow = "hidden";
    desktopQuery.addEventListener("change", closeOnDesktop);
    closeOnDesktop();

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      desktopQuery.removeEventListener("change", closeOnDesktop);
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? dialogId : undefined}
        className="flex size-9 items-center justify-center rounded-control bg-transparent text-foreground transition-colors hover:bg-surface-muted lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon className="size-6" />
      </button>

      {isOpen
        ? createPortal(
            <dialog
              ref={dialogRef}
              id={dialogId}
              aria-modal="true"
              aria-labelledby={titleId}
              className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-[min(20rem,85vw)] max-w-none overflow-y-auto overscroll-contain border-l border-border-light bg-surface p-0 text-foreground shadow-xl backdrop:bg-foreground/45 backdrop:backdrop-blur-[1px] motion-safe:animate-[navigation-drawer-in_240ms_ease-out]"
              onKeyDown={(event) => {
                if (event.key !== "Tab") {
                  return;
                }

                const controls = Array.from(
                  event.currentTarget.querySelectorAll<HTMLElement>("*"),
                ).filter((element) =>
                  element.matches("a[href], button:not(:disabled)"),
                );
                const first = controls[0];
                const last = controls[controls.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();

                  return;
                }

                if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }}
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
              <div className="flex min-h-16 items-center justify-between gap-4 border-b border-border-light px-5 py-3">
                <h2 id={titleId} className="text-h3">
                  {label}
                </h2>

                <button
                  type="button"
                  aria-label={closeLabel}
                  className="flex size-9 shrink-0 items-center justify-center rounded-control transition-colors hover:bg-surface-muted"
                  onClick={() => setIsOpen(false)}
                >
                  <CloseIcon className="size-6" />
                </button>
              </div>

              <nav
                aria-label={label}
                className="grid gap-4 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
                onClick={(event) => {
                  if ((event.target as Element).closest("a[href]")) {
                    setIsOpen(false);
                  }
                }}
              >
                {children}
              </nav>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
