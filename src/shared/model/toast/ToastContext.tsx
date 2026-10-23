"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  removeToast: (id: number) => void;
  showToast: (message: string, variant?: ToastVariant) => void;
  toasts: Toast[];
};

const TOAST_DURATION_MS = 4500;
const MAX_VISIBLE_TOASTS = 4;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = useRef(0);
  const timeoutRefs = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const removeToast = useCallback((id: number) => {
    const timeout = timeoutRefs.current.get(id);

    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = nextIdRef.current + 1;
      nextIdRef.current = id;

      setToasts((currentToasts) => [
        ...currentToasts.slice(-(MAX_VISIBLE_TOASTS - 1)),
        { id, message, variant },
      ]);

      const timeout = setTimeout(() => removeToast(id), TOAST_DURATION_MS);
      timeoutRefs.current.set(id, timeout);
    },
    [removeToast],
  );

  useEffect(
    () => () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current.clear();
    },
    [],
  );

  const value = useMemo(
    () => ({ removeToast, showToast, toasts }),
    [removeToast, showToast, toasts],
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
