import { motion, AnimatePresence } from "motion/react";
import { Shield, Loader2, Activity, Database } from "lucide-react";
import { cn } from "@/utils";

interface AdminLoaderProps {
  /** Full viewport overlay — use for initial dashboard hydration or blocking actions */
  fullscreen?: boolean;
  /** Renders as a contained elegant card (for sections) */
  partial?: boolean;
  /** Message to display */
  message?: string;
  /** Subtext */
  subMessage?: string;
  /** Drive visibility. When false, component unmounts. */
  isLoading?: boolean;
  /** Visual style variant */
  variant?: "page" | "action" | "subtle";
  /** Additional class names */
  className?: string;
  /** Show skeleton content preview (for page loads) */
  showSkeleton?: boolean;
}

/**
 * AdminLoader
 *
 * Two primary uses:
 * 1. Route / dashboard readiness:
 *    <AdminLoader fullscreen isLoading={isHydrating} message="Preparing admin console" />
 *
 * 2. Blocking action (on button click until async completes):
 *    <AdminLoader fullscreen variant="action" isLoading={loading} message="Processing..." />
 *
 * Partial for inline sections:
 *    <AdminLoader partial isLoading={query.isLoading} />
 */
export function AdminLoader({
  fullscreen = true,
  partial = false,
  message = "Preparing console",
  subMessage,
  isLoading = true,
  variant = "page",
  className,
  showSkeleton = true,
}: AdminLoaderProps) {
  if (!isLoading) return null;

  const isAction = variant === "action";
  const isPage = variant === "page" || (!isAction && fullscreen);

  const containerClasses = cn(
    "admin-theme",
    fullscreen && !partial
      ? "fixed inset-0 z-[300] flex items-center justify-center !bg-[var(--a-bg)]/5 backdrop-blur-md"
      : partial
        ? "flex w-full items-center justify-center py-8"
        : "flex w-full items-center justify-center",
    className,
  );

  const cardClasses = partial
    ? "w-full max-w-md rounded-2xl border border-[var(--a-border)] bg-[var(--a-surface)] p-8 shadow-xl"
    : "";

  const inner = (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        isAction ? "gap-6" : "gap-7",
        !partial && "max-w-sm px-6",
      )}
    >
      {/* Icon cluster */}
      <div className="relative flex items-center justify-center">
        {/* Soft pulsing halo */}
        <motion.div
          className="absolute size-20 rounded-full"
          style={{ background: "var(--a-accent)", opacity: 0.06 }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.06, 0.02, 0.06],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Secondary ring */}
        <motion.div
          className="absolute size-[66px] rounded-full border"
          style={{ borderColor: "var(--a-accent)", opacity: 0.15 }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.15, 0.05, 0.15] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />

        {/* Core badge */}
        <div
          className={cn(
            "relative grid place-items-center rounded-2xl shadow-2xl ring-1 ring-[var(--a-border-hi)]",
            isAction ? "size-14" : "size-16",
          )}
          style={{ background: "var(--a-accent)", color: "var(--a-accent-ink)" }}
        >
          {isAction ? (
            <Activity className={cn("size-7")} strokeWidth={2.5} />
          ) : (
            <Shield className={cn("size-8")} strokeWidth={2.25} />
          )}
        </div>

        {/* Spinning micro indicator */}
        <motion.div
          className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border border-[var(--a-border)] bg-[var(--a-surface)] p-1.5"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="size-3 text-[var(--a-accent)]" strokeWidth={3} />
        </motion.div>
      </div>

      {/* Messaging */}
      <div className="space-y-1.5">
        <p
          className={cn(
            "font-display font-semibold tracking-[-0.01em] text-[var(--a-fg)]",
            isAction ? "text-lg" : "text-2xl",
          )}
        >
          {message}
        </p>
        {(subMessage || isPage) && (
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--a-muted)]">
            {subMessage || "Aethelred Admin • Securing session"}
          </p>
        )}
      </div>

      {/* Elegant progress line */}
      <div
        className={cn(
          "relative h-px w-48 overflow-hidden rounded-full",
          isAction ? "w-40" : "w-52",
        )}
        style={{ background: "var(--a-border)" }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 bg-[var(--a-accent)]"
          animate={{ x: ["-120%", "280%"] }}
          transition={{
            duration: isAction ? 1.1 : 1.65,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ width: "22%" }}
        />
      </div>

      {/* Skeleton preview for page-level readiness */}
      {!isAction && showSkeleton && !partial && (
        <div className="mt-2 w-full max-w-[320px] space-y-2.5 pt-1">
          <div className="flex items-center justify-between rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] px-4 py-3">
            <div className="space-y-2">
              <div className="h-2 w-12 rounded bg-[var(--a-border)]/70" />
              <div className="h-6 w-28 rounded bg-[var(--a-border)]/50" />
            </div>
            <div className="size-8 rounded-lg bg-[var(--a-border)]/50" />
          </div>

          <div className="space-y-1.5 rounded-xl border border-[var(--a-border)] bg-[var(--a-surface)] p-3.5">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-7 rounded-md bg-[var(--a-border)]/50" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 w-2/3 rounded bg-[var(--a-border)]/50" />
                  <div className="h-1.5 w-1/3 rounded bg-[var(--a-border)]/40" />
                </div>
                <div className="h-2.5 w-12 rounded bg-[var(--a-border)]/50" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status line */}
      <div className="flex items-center gap-2 pt-1 text-[10px] text-[var(--a-muted)]">
        <Database className="size-3" />
        <span className="tracking-widest">SYNCHRONIZING</span>
      </div>
    </div>
  );

  const body = partial ? (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cardClasses}
    >
      {inner}
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {inner}
    </motion.div>
  );

  return <div className={containerClasses}>{body}</div>;
}

/** Tiny inline spinner for buttons or tight spaces */
export function AdminSpinner({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[var(--a-muted)]", className)}>
      <Loader2 className="size-3.5 animate-spin" />
      <span className="text-[10px] tracking-[1.5px] font-medium">WORKING</span>
    </span>
  );
}
