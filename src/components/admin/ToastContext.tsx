"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center p-4 border shadow-xl min-w-[280px] max-w-md animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === "success"
                ? "bg-stone-900 border-emerald-500/50 text-emerald-300"
                : toast.type === "error"
                ? "bg-stone-900 border-rose-500/50 text-rose-300"
                : "bg-stone-900 border-amber-500/50 text-amber-300"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 mr-3 shrink-0 text-emerald-400" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-rose-400" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 mr-3 shrink-0 text-amber-400" />
            )}
            <span className="text-xs font-medium text-stone-200 flex-1 leading-snug">
              {toast.message}
            </span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-stone-500 hover:text-stone-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
