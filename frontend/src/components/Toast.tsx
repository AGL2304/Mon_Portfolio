import { useEffect, useState } from "react";

export interface ToastMessage {
  id: number;
  message: string;
  type: "ok" | "err";
}

interface ToastProps {
  toast: ToastMessage | null;
  duration?: number;
}

export function Toast({ toast, duration = 2400 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [toast, duration]);

  if (!toast) return null;

  return <div className={`toast ${visible ? "show" : ""} ${toast.type}`}>{toast.message}</div>;
}

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  function show(message: string, type: "ok" | "err" = "ok") {
    setToast({ id: Date.now(), message, type });
  }

  return { toast, show };
}
