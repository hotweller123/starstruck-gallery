"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Info, AlertTriangle, Heart, Bookmark, Share2, ShieldClose } from "lucide-react";
import { cn } from "@/utils/gen";

export type ToastVariant =
  | "default"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "collection"
  | "reserved"
  | "shared";

export type ToastPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

let globalDefaultPosition: ToastPosition = "bottom-right";

export function setToastPosition(position: ToastPosition) {
  globalDefaultPosition = position;
}

const POSITION_STYLES: Record<ToastPosition, string> = {
  top: "top-6 left-1/2 -translate-x-1/2 items-center",
  bottom: "bottom-6 left-1/2 -translate-x-1/2 items-center",
  left: "left-6 top-1/2 -translate-y-1/2 items-start",
  right: "right-6 top-1/2 -translate-y-1/2 items-start",
  "top-left": "top-6 left-6 items-start",
  "top-right": "top-6 right-6 items-start",
  "bottom-left": "bottom-6 left-6 items-start",
  "bottom-right": "bottom-6 right-6 items-start",
};

const getDirection = (pos: ToastPosition): "up" | "down" | "left" | "right" =>
  pos.includes("top") ? "up" : pos.includes("bottom") ? "down" : pos === "left" ? "left" : "right";

const getInitial = (dir: string) =>
  dir === "up"
    ? { opacity: 0, y: -18, scale: 0.96 }
    : dir === "left"
      ? { opacity: 0, x: -18, scale: 0.96 }
      : dir === "right"
        ? { opacity: 0, x: 18, scale: 0.96 }
        : { opacity: 0, y: 18, scale: 0.96 };

const getExit = (dir: string) =>
  dir === "up"
    ? { opacity: 0, y: -10, scale: 0.98 }
    : dir === "left"
      ? { opacity: 0, x: -10, scale: 0.98 }
      : dir === "right"
        ? { opacity: 0, x: 10, scale: 0.98 }
        : { opacity: 0, y: 8, scale: 0.98 };

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Refined, gallery-appropriate aesthetic
const VARIANT_STYLES: Record<
  ToastVariant,
  {
    container: string;
    iconBg: string;
    iconColor: string;
    progress: string;
  }
> = {
  default: {
    container: "border-ink/[0.08] bg-[oklch(0.99_0.002_75)]",
    iconBg: "bg-ink/[0.045]",
    iconColor: "text-ink/60",
    progress: "bg-ink/35",
  },
  success: {
    container: "border-emerald-900/[0.12] bg-[oklch(0.975_0.015_145)]",
    iconBg: "bg-emerald-900/[0.07]",
    iconColor: "text-emerald-900/75",
    progress: "bg-emerald-900/45",
  },
  info: {
    container: "border-sky-900/[0.1] bg-[oklch(0.973_0.01_225)]",
    iconBg: "bg-sky-900/[0.06]",
    iconColor: "text-sky-900/65",
    progress: "bg-sky-900/40",
  },
  warning: {
    container: "border-amber-900/[0.13] bg-[oklch(0.978_0.018_72)]",
    iconBg: "bg-amber-900/[0.07]",
    iconColor: "text-amber-900/75",
    progress: "bg-amber-900/45",
  },
  error: {
    container: "border-rose-900/[0.13] bg-[oklch(0.975_0.02_18)]",
    iconBg: "bg-rose-900/[0.07]",
    iconColor: "text-rose-900/75",
    progress: "bg-rose-900/45",
  },
  collection: {
    container: "border-clay/25 bg-[oklch(0.982_0.018_36)]",
    iconBg: "bg-clay/[0.09]",
    iconColor: "text-clay",
    progress: "bg-clay/75",
  },
  reserved: {
    container: "border-ink/[0.09] bg-[oklch(0.978_0.006_70)]",
    iconBg: "bg-ink/[0.055]",
    iconColor: "text-ink/65",
    progress: "bg-ink/40",
  },
  shared: {
    container: "border-ink/[0.08] bg-[oklch(0.99_0.002_75)]",
    iconBg: "bg-ink/[0.045]",
    iconColor: "text-ink/60",
    progress: "bg-ink/35",
  },
};

const VARIANT_ICONS: Record<ToastVariant, React.ReactNode> = {
  default: <Info className="h-[14px] w-[14px]" />,
  success: <Check className="h-[14px] w-[14px]" />,
  info: <Info className="h-[14px] w-[14px]" />,
  warning: <AlertTriangle className="h-[14px] w-[14px]" />,
  error: <ShieldClose className="h-[14px] w-[14px]" />,
  collection: <Heart className="h-[14px] w-[14px]" />,
  reserved: <Bookmark className="h-[14px] w-[14px]" />,
  shared: <Share2 className="h-[14px] w-[14px]" />,
};

function ToastItem({
  toast,
  onDismiss,
  position,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
  position: ToastPosition;
}) {
  const variant = toast.variant || "default";
  const styles = VARIANT_STYLES[variant];
  const icon = VARIANT_ICONS[variant];
  const duration = toast.duration ?? 4400;
  const dir = getDirection(position);

  React.useEffect(() => {
    if (duration) setTimeout(() => onDismiss(toast.id), duration);
  }, [duration, onDismiss, toast?.id]);

  return (
    <motion.div
      layout
      initial={getInitial(dir)}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={getExit(dir)}
      transition={{
        type: "spring",
        stiffness: 340,
        damping: 32,
        mass: 0.9,
      }}
      whileHover={{ y: dir === "up" ? 1 : -1.5 }}
      className={cn(
        "group relative flex w-full max-w-[340px] overflow-hidden rounded-2xl border bg-white/95",
        "shadow-[0_10px_32px_-16px_rgb(0,0,0,0.12),0_1px_0_0_rgb(255,255,255,0.9)_inset]",
        styles.container,
      )}
    >
      {/* Vertical accent bar (left side) */}
      <div className="relative w-[3px] shrink-0 bg-ink/[0.035] overflow-hidden">
        <motion.div
          className={cn("absolute inset-x-0 top-0 origin-top", styles.progress)}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      </div>

      <div className="flex flex-1 items-start gap-3.5 pl-3.5 pr-4 py-[11px]">
        {/* Icon */}
        <div
          className={cn(
            "mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-lg border border-ink/[0.04]",
            styles.iconBg,
          )}
        >
          <span className={cn("[&>svg]:h-3 [&>svg]:w-3", styles.iconColor)}>{icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 pt-[1px] pr-1">
          <div className="font-medium text-[12.5px] leading-[1.2] tracking-[-0.18px] text-ink">
            {toast.title}
          </div>
          {toast.description && (
            <div className="mt-1 text-[11px] leading-[1.35] text-detail/90">
              {toast.description}
            </div>
          )}

          {toast.action && (
            <button
              onClick={() => {
                toast.action!.onClick();
                onDismiss(toast.id);
              }}
              className="mt-1.5 text-[9.5px] font-medium uppercase tracking-[1.6px] text-ink/50 hover:text-ink border-b border-ink/20 hover:border-ink/60 transition-colors"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="mt-0.5 h-5 w-5 rounded-md opacity-[0.22] hover:opacity-60 hover:bg-ink/5 flex items-center justify-center transition-all active:scale-90"
          aria-label="Dismiss"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      </div>
    </motion.div>
  );
}

export function Toaster() {
  const toasts = useToasts();

  const grouped = toasts.reduce(
    (acc, t) => {
      const pos = t.position ?? globalDefaultPosition;
      (acc[pos] ||= []).push(t);
      return acc;
    },
    {} as Record<ToastPosition, Toast[]>,
  );

  return (
    <>
      {(Object.keys(grouped) as ToastPosition[]).map((pos) => {
        const list = grouped[pos];
        if (!list?.length) return null;
        return (
          <div
            key={pos}
            className={cn(
              "fixed z-[100] flex flex-col gap-2.5 pointer-events-none",
              POSITION_STYLES[pos],
            )}
          >
            <AnimatePresence>
              {list.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                  <ToastItem toast={toast} onDismiss={removeToast} position={pos} />
                </div>
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}

// Internal store
let toastStore: {
  toasts: Toast[];
  listeners: Set<() => void>;
} = {
  toasts: [],
  listeners: new Set(),
};

function notify() {
  toastStore.listeners.forEach((l) => l());
}

function addToast(props: Omit<Toast, "id">): string {
  const id = Math.random().toString(36).slice(2, 9);
  const newToast: Toast = {
    id,
    position: props.position ?? globalDefaultPosition,
    ...props,
  };

  toastStore.toasts = [...toastStore.toasts, newToast].slice(-5);
  notify();

  return id;
}

function removeToast(id: string) {
  toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id);
  notify();
}

function useToasts() {
  const [toasts, setToasts] = React.useState<Toast[]>(toastStore.toasts);

  React.useEffect(() => {
    const listener = () => setToasts([...toastStore.toasts]);
    toastStore.listeners.add(listener);
    return () => toastStore.listeners.delete(listener);
  }, []);

  return toasts;
}

// Public API
export function useToast() {
  return {
    toast: (props: Omit<Toast, "id">) => addToast(props),
    dismiss: removeToast,
    dismissAll: () => {
      toastStore.toasts = [];
      notify();
    },
  };
}

// Internal factory to avoid repetitive addToast wrappers
const makeToast =
  (variant: ToastVariant) =>
  ({
    title,
    description,
    position,
  }: {
    title: string;
    description?: string;
    position?: ToastPosition;
  }) =>
    addToast({ title, description, variant, position });

// Gallery-flavored convenience methods
export const toast = {
  default: makeToast("default"),
  success: makeToast("success"),
  info: makeToast("info"),
  warning: makeToast("warning"),
  error: makeToast("error"),

  // Project specific
  added: makeToast("collection"),
  reserved: makeToast("reserved"),
  shared: makeToast("shared"),

  dismiss: removeToast,
  setPosition: setToastPosition,
};

// Provider (renders the Toaster; toasts are managed globally)
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
