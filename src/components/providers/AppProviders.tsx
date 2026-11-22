"use client";

import * as React from "react";
import { CheckCircle2, Info, TriangleAlert, WifiOff, X } from "lucide-react";
import { hydrate, useAppData } from "@/lib/storage/store";

type ToastTone = "success" | "info" | "warning" | "offline";
interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface AppContextValue {
  online: boolean;
  toast: (message: string, tone?: ToastTone) => void;
}

const AppContext = React.createContext<AppContextValue>({ online: true, toast: () => undefined });

export function useAppContext() {
  return React.useContext(AppContext);
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const { settings } = useAppData();
  const [browserOnline, setBrowserOnline] = React.useState(true);
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const toastId = React.useRef(0);

  React.useEffect(() => {
    void hydrate();
    setBrowserOnline(navigator.onLine);
    const goOnline = () => setBrowserOnline(true);
    const goOffline = () => setBrowserOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = settings.theme === "dark" || (settings.theme === "system" && media.matches);
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [settings.theme]);

  const online = browserOnline && !settings.forceOffline && settings.privacy.allowOnlineProcessing;

  const toast = React.useCallback((message: string, tone: ToastTone = "info") => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3600);
  }, []);

  const value = React.useMemo(() => ({ online, toast }), [online, toast]);

  return (
    <AppContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-24 right-4 z-[80] flex w-[min(22rem,calc(100%-2rem))] flex-col gap-2 md:bottom-6"
        role="status"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto flex items-start gap-2.5 rounded-2xl border border-border bg-surface-raised p-3.5 text-sm shadow-xl"
          >
            {item.tone === "success" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            ) : item.tone === "warning" ? (
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
            ) : item.tone === "offline" ? (
              <WifiOff className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
            ) : (
              <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            )}
            <span className="flex-1">{item.message}</span>
            <button
              type="button"
              onClick={() => setToasts((current) => current.filter((entry) => entry.id !== item.id))}
              className="rounded-md p-0.5 text-muted hover:text-foreground"
              aria-label="Dismiss notification"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}
