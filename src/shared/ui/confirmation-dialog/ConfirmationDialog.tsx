"use client";

import { useRef } from "react";

import { Button, type ButtonVariant } from "../button";
import { Modal } from "../modal";

export type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmVariant?: ButtonVariant;
  pending?: boolean;
  confirmDisabled?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = "primary",
  pending = false,
  confirmDisabled = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      open={open}
      title={title}
      description={description}
      dismissible={!pending}
      busy={pending}
      initialFocusRef={cancelRef}
      footerDivider={false}
      onClose={onCancel}
      footer={
        <>
          <Button
            ref={cancelRef}
            variant="outline"
            disabled={pending}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>

          <Button
            variant={confirmVariant}
            loading={pending}
            disabled={confirmDisabled}
            onClick={() => {
              if (!pending && !confirmDisabled) {
                onConfirm();
              }
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {error ? (
        <p role="alert" className="text-body-sm text-danger">
          {error}
        </p>
      ) : null}
    </Modal>
  );
}
