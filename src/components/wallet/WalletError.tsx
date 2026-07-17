import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, RefreshCw, Home, LogOut, Wallet } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import useAuth from "@/hooks/useAuth";

interface WalletErrorProps {
  error?: Error;
  reset?: () => void;
  /** Optional custom title */
  title?: string;
  /** Optional custom message */
  message?: string;
}

export function WalletError({
  error,
  reset,
  title = "Wallet sync failed",
  message,
}: WalletErrorProps) {
  const [retrying, setRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { logOut } = useAuth();

  const handleRetry = async () => {
    if (!reset) return;

    setRetrying(true);

    // Visible action: brief delay + animation so user sees something happening
    await new Promise((r) => setTimeout(r, 650));

    try {
      reset();
    } finally {
      // If reset doesn't navigate away, we still want to stop the loading state
      setTimeout(() => setRetrying(false), 300);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut?.();
    } catch {
      // fallback: just reload
      window.location.href = "/wallet";
    }
  };

  const friendlyMessage =
    message ||
    "We couldn't load your wallet data. This can happen after a network blip or when the session needs refreshing.";

  return (
    <div className="wallet-theme flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Main card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-8 shadow-2xl wallet-ring">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 wallet-dotgrid opacity-20" aria-hidden />

          <div className="relative flex flex-col items-center text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.6, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="mb-6 grid size-20 place-items-center rounded-2xl border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)]"
            >
              <div className="relative">
                <Wallet className="size-9 text-[var(--w-brand)]" strokeWidth={2.2} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 rounded-full bg-[var(--w-bg)] p-1"
                >
                  <AlertTriangle className="size-4 text-[var(--w-brand)]" strokeWidth={3} />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--w-fg)]">{title}</h1>

            {/* Message */}
            <p className="mt-3 max-w-[28ch] text-[15px] leading-relaxed text-[var(--w-muted)]">
              {friendlyMessage}
            </p>

            {/* Error details (collapsible) */}
            {error && (
              <button
                onClick={() => setShowDetails((v) => !v)}
                className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--w-muted)] hover:text-[var(--w-fg)] transition"
              >
                {showDetails ? "Hide" : "Show"} technical details
              </button>
            )}

            <AnimatePresence>
              {showDetails && error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 w-full overflow-hidden"
                >
                  <div className="rounded-xl border border-[var(--w-border)] bg-[var(--w-bg-2)] p-3 text-left">
                    <p className="font-mono text-[10px] text-[var(--w-muted)] break-words">
                      {error.message || String(error)}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary action — visible feedback on click */}
            {reset && (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
                onClick={handleRetry}
                disabled={retrying}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-[1.4rem] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.16em] shadow-xl transition disabled:opacity-70"
                style={{
                  background: "var(--w-brand)",
                  color: "var(--w-brand-contrast)",
                }}
              >
                <AnimatePresence mode="wait">
                  {retrying ? (
                    <motion.span
                      key="retrying"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-2"
                    >
                      <RefreshCw className="size-4 animate-spin" />
                      RETRYING...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-2"
                    >
                      <RefreshCw className="size-4" />
                      TRY AGAIN
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {/* Secondary actions */}
            <div className="mt-4 flex w-full flex-col gap-2.5 sm:flex-row">
              <Link
                to="/wallet"
                className="flex flex-1 items-center justify-center gap-2 rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] px-4 py-3 text-sm font-semibold text-[var(--w-fg)] transition hover:border-[var(--w-brand)]/40"
              >
                <Home className="size-4" />
                Back to wallet
              </Link>

              <button
                onClick={handleSignOut}
                className="flex flex-1 items-center justify-center gap-2 rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-surface)] px-4 py-3 text-sm font-semibold text-[var(--w-muted)] transition hover:bg-[var(--w-bg-2)] hover:text-[var(--w-fg)]"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>

            {/* Subtle footer note */}
            <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--w-muted)]/70">
              EmberPay • Secure by default
            </p>
          </div>
        </div>

        {/* Tiny hint below the card */}
        <p className="mt-4 text-center text-[11px] text-[var(--w-muted)]">
          If this keeps happening, try refreshing the page or contact support.
        </p>
      </motion.div>
    </div>
  );
}

/**
 * Even more minimal version for embedding inside sections (rarely needed)
 */
export function WalletErrorInline({ error, reset }: { error?: Error; reset?: () => void }) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (!reset) return;
    setRetrying(true);
    await new Promise((r) => setTimeout(r, 500));
    reset();
    setRetrying(false);
  };

  return (
    <div className="rounded-2xl border border-[var(--w-border)] bg-[var(--w-surface)] p-6">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 rounded-xl bg-[var(--w-brand-soft)] p-2 text-[var(--w-brand)]">
          <AlertTriangle className="size-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[var(--w-fg)]">Something went wrong</p>
          <p className="mt-1 text-sm text-[var(--w-muted)]">
            {error?.message || "Failed to load wallet data."}
          </p>

          {reset && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--w-border)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--w-fg)] hover:bg-[var(--w-bg-2)] disabled:opacity-60"
            >
              {retrying ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" /> Retrying
                </>
              ) : (
                <>
                  <RefreshCw className="size-3.5" /> Try again
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
