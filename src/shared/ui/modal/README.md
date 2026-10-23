# Modal dialogs

Import `Modal` and `ConfirmationDialog` from `@/shared/ui` in client components.

`Modal` is a controlled native `<dialog>` with a title, optional description,
content, footer and close button (`closeLabel`). The browser places it in the
top layer and makes the rest of the page inert; a portal is unnecessary.
Escape and backdrop clicks call `onClose`. Set `dismissible={false}` to block
these paths and the close button during an operation.

The footer has a divider by default. Set `footerDivider={false}` to hide it
while preserving the spacing; `ConfirmationDialog` uses this option.

Below 720px, the modal is a full-width bottom sheet with rounded top corners,
an 85dvh height limit and bottom safe-area padding. At 720px and above it is
centered with a constrained width, matching the regional settings breakpoint.

Opening locks body scrolling and closing restores focus to the previously
focused element if it still exists. Use a stable `initialFocusRef` to choose
the initial focused control. Multiple open modals share the scroll lock.

For action confirmations, use `ConfirmationDialog`:

```tsx
<ConfirmationDialog
  open={confirming}
  title={copy.action}
  description={copy.description}
  confirmLabel={copy.confirm}
  cancelLabel={copy.cancel}
  confirmVariant="danger"
  pending={mutation.isPending}
  error={mutation.error ? copy.error : undefined}
  onConfirm={() => mutation.mutate()}
  onCancel={() => setConfirming(false)}
/>
```

The cancel button receives initial focus. While `pending`, both buttons and
dismissal are disabled. `confirmDisabled` blocks confirmation without blocking
cancellation. Errors stay in the dialog for retry; the owning feature closes
it after success and resets stale errors before opening it again.
