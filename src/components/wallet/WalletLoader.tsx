import { motion } from "motion/react";
import { Wallet, Loader2, Shield } from "lucide-react";
import { cn } from "@/utils";

interface WalletLoaderProps {
  /** Full viewport overlay (recommended for route-level auth hydration) */
  fullscreen?: boolean;
  /** Optional custom message */
  message?: string;
  /** Additional class names */
  className?: string;
  /** Compact / minimal spinner only */
  compact?: boolean;
  /** Show subtle skeleton rows (balance + activity preview) — great for partial loads */
  showSkeleton?: boolean;
  /** "Partial" mode: renders as an elegant inset card instead of full screen. Use for sections. */
  partial?: boolean;
  /**
   * Drive visibility from a query loading value (or any boolean).
   * When false, the loader unmounts itself.
   * Example: <WalletLoader isLoading={userQuery.isLoading || !user} partial />
   */
  isLoading?: boolean;
}

/**
 * WalletLoader
 *
 * Fullscreen (default):
 *   <WalletLoader fullscreen message="Loading your wallet" />
 *
 * Partial / inside a card or section:
 *   <WalletLoader partial showSkeleton={false} message="Refreshing balance" />
 *
 * With TanStack Query loading:
 *   const q = useFirebaseQueryDocument('users', uid);
 *   <WalletLoader isLoading={q.isLoading} partial />
 */

export function WalletLoader({
  fullscreen = true,
  message = "Syncing your wallet",
  className,
  compact = false,
  showSkeleton = true,
  partial = false,
  isLoading = true,
}: WalletLoaderProps) {
  // Allow parent to hide the loader when data is ready
  if (!isLoading) return null;

  const isPartial = partial && !fullscreen;

  const containerClasses = cn(
    // Only add wallet-theme when we are the one providing the surface (fullscreen or partial card)
    (fullscreen || isPartial) && "wallet-theme",
    fullscreen && !isPartial
      ? "fixed inset-0 z-[200] flex items-center justify-center bg-[var(--w-bg)]"
      : isPartial
        ? "flex w-full items-center justify-center"
        : "flex w-full items-center justify-center py-12",
    className,
  );

  const cardClasses = isPartial
    ? "w-full max-w-md rounded-3xl border border-[var(--w-border)] bg-[var(--w-surface)] p-8 shadow-2xl wallet-ring"
    : "";

  const inner = (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        compact ? "gap-3" : "gap-8",
        !isPartial && "max-w-xs px-6",
      )}
    >
      {/* Brand icon with elegant pulsing ring */}
      <div className="relative flex items-center justify-center">
        {/* Outer soft glow ring */}
        <motion.div
          className="absolute size-20 rounded-full"
          style={{ background: "var(--w-brand)", opacity: 0.08 }}
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.08, 0.03, 0.08],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary ring */}
        <motion.div
          className="absolute size-14 rounded-full border"
          style={{ borderColor: "var(--w-brand)", opacity: 0.25 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.1, 0.25] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Core icon container */}
        <div
          className={cn(
            "relative grid place-items-center rounded-2xl shadow-xl",
            compact ? "size-12" : "size-16",
          )}
          style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
        >
          <Wallet className={cn(compact ? "size-6" : "size-8")} strokeWidth={2.5} />
        </div>

        {/* Spinning security indicator */}
        <motion.div
          className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] p-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        >
          <Shield className="size-3 text-[var(--w-brand)]" strokeWidth={3} />
        </motion.div>
      </div>

      {/* Text block */}
      <div className={cn(compact ? "space-y-0.5" : "space-y-1.5")}>
        <p
          className={cn(
            "font-semibold tracking-tight text-[var(--w-fg)]",
            compact ? "text-base" : "text-2xl",
          )}
        >
          {message}
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--w-muted)]">
          Securing session • EmberPay
        </p>
      </div>

      {/* Elegant loading bar */}
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-[var(--w-surface)]",
          compact ? "h-0.5 w-36" : "h-px w-48",
        )}
      >
        <motion.div
          className="absolute inset-y-0 left-0 bg-[var(--w-brand)]"
          animate={{ x: ["-100%", "300%"] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ width: "28%" }}
        />
      </div>

      {/* Optional skeleton preview — gives the feeling of "wallet content loading" */}
      {!compact && showSkeleton && (
        <div className="mt-1 w-full max-w-[280px] space-y-2.5 pt-2">
          {/* Fake balance skeleton */}
          <div className="flex items-center justify-between rounded-2xl border border-[var(--w-border)] bg-[var(--w-surface)] px-4 py-3.5">
            <div className="space-y-2">
              <div className="h-2.5 w-14 rounded-full bg-[var(--w-border)]/70" />
              <div className="h-7 w-32 rounded bg-[var(--w-border)]/60" />
            </div>
            <div className="size-9 rounded-xl bg-[var(--w-border)]/60" />
          </div>

          {/* Mini activity rows */}
          <div className="space-y-1.5 rounded-2xl border border-[var(--w-border)] bg-[var(--w-surface)] p-3.5">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-[var(--w-border)]/60" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-3/4 rounded-full bg-[var(--w-border)]/60" />
                  <div className="h-2 w-1/3 rounded-full bg-[var(--w-border)]/50" />
                </div>
                <div className="h-3 w-14 rounded-full bg-[var(--w-border)]/60" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtle status */}
      <div className="flex items-center gap-2 pt-2 text-[10px] text-[var(--w-muted)]">
        <Loader2 className="size-3 animate-spin" />
        <span>Verifying credentials</span>
      </div>
    </div>
  );

  const body = isPartial ? (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cardClasses}
    >
      {inner}
    </motion.div>
  ) : (
    inner
  );

  return <div className={containerClasses}>{body}</div>;
}

/** Tiny inline version for buttons / small areas */
export function WalletSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 text-[var(--w-muted)]", className)}>
      <Loader2 className="size-4 animate-spin" />
      <span className="text-xs tracking-widest">LOADING</span>
    </div>
  );
}
