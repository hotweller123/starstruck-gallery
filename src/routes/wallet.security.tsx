import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Copy, Check, RefreshCw, ShieldCheck } from "lucide-react";
import { WalletShell } from "@/components/wallet/WalletShell";
import { useWallet } from "@/lib/wallet";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wallet/security")({
  component: SecurityPage,
  head: () => ({ meta: [{ title: "Security — Aethelred Wallet" }] }),
});

function SecurityPage() {
  return <Inner />;
}

function Inner() {
  const { currentAccount, regenerateToken } = useWallet();
  const { connectedWalletId, disconnectWallet } = useStore();
  const [copied, setCopied] = useState(false);
  if (!currentAccount) return null;

  const copy = () => {
    navigator.clipboard.writeText(currentAccount.token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const regen = () => {
    if (
      !confirm(
        "Generating a new token will disconnect the wallet from the site. Continue?",
      )
    )
      return;
    if (connectedWalletId === currentAccount.id) disconnectWallet();
    regenerateToken();
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex items-start gap-3 rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-brand-soft)] p-5 text-sm">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--w-brand)]" strokeWidth={2} />
        <div>
          <p className="font-bold text-[var(--w-fg)]">Demo wallet</p>
          <p className="mt-1 text-[var(--w-muted)]">
            Simulated for exhibition purposes. All data lives in your browser
            and password storage is not production-grade.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl md:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--w-fg)]">
          Wallet token
        </h1>
        <p className="mt-1 text-sm text-[var(--w-muted)]">
          Paste this token on the site's Connect page to log in to Aethelred.
        </p>

        <div className="mt-5 rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-input)] p-4">
          <code className="block break-all font-mono text-base font-semibold tracking-widest text-[var(--w-fg)]">
            {currentAccount.token}
          </code>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] px-4 py-2 text-xs font-semibold text-[var(--w-fg)] transition hover:bg-[var(--w-bg-2)]"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy token"}
            </button>
            <button
              onClick={regen}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] px-4 py-2 text-xs font-semibold text-[var(--w-fg)] transition hover:bg-[var(--w-bg-2)]"
            >
              <RefreshCw className="size-3.5" />
              Regenerate
            </button>
          </div>
        </div>

        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)]">
          Connected to site:{" "}
          <span className="text-[var(--w-fg)]">
            {connectedWalletId === currentAccount.id ? "Yes" : "No"}
          </span>
        </p>
      </div>

      <div className="rounded-[2rem] border border-[var(--w-danger)]/30 bg-[var(--w-danger)]/5 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 text-[var(--w-danger)]" strokeWidth={2} />
          <h2 className="text-xl font-bold tracking-tight text-[var(--w-fg)]">
            Danger zone
          </h2>
        </div>
        <p className="mt-2 text-sm text-[var(--w-muted)]">
          Disconnect this wallet from the exhibition site. Your balance and
          activity stay intact.
        </p>
        <button
          onClick={() => disconnectWallet()}
          disabled={connectedWalletId !== currentAccount.id}
          className="mt-5 rounded-full border border-[var(--w-danger)]/60 bg-[var(--w-danger)]/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--w-danger)] hover:bg-[var(--w-danger)]/25 disabled:opacity-40"
        >
          Disconnect from site
        </button>
      </div>
    </div>
  );
}
