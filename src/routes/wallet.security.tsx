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
  return (
    <WalletShell>
      <Inner />
    </WalletShell>
  );
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
    if (!confirm("Generating a new token will disconnect the wallet from the site. Continue?"))
      return;
    if (connectedWalletId === currentAccount.id) disconnectWallet();
    regenerateToken();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-2xl border border-[var(--w-accent)]/30 bg-[var(--w-accent)]/5 p-5 text-sm text-[var(--w-fg)]/90">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--w-accent)]" strokeWidth={1.4} />
        <div>
          <p className="font-medium">Demo wallet</p>
          <p className="mt-1 text-[var(--w-muted)]">
            This is a simulated wallet for exhibition purposes. All data lives in
            your browser and password storage is not production-grade. Do not use
            real credentials.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[var(--w-surface)] p-6 md:p-8">
        <h1 className="font-display text-3xl italic">Wallet token</h1>
        <p className="mt-1 text-sm text-[var(--w-muted)]">
          Paste this token on the site's Connect page to log in to Aethelred.
        </p>

        <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/40 px-4 py-4">
          <code className="truncate font-mono text-base tracking-widest text-[var(--w-accent)]">
            {currentAccount.token}
          </code>
          <div className="flex gap-2">
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] hover:border-[var(--w-accent)]/50 hover:text-[var(--w-accent)]"
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={regen}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] hover:border-[var(--w-accent)]/50 hover:text-[var(--w-accent)]"
            >
              <RefreshCw className="size-3" />
              Regenerate
            </button>
          </div>
        </div>

        <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)]">
          Connected to site:{" "}
          <span className="text-[var(--w-fg)]">
            {connectedWalletId === currentAccount.id ? "Yes" : "No"}
          </span>
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--w-danger)]/30 bg-[var(--w-danger)]/5 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 text-[var(--w-danger)]" strokeWidth={1.4} />
          <h2 className="font-display text-2xl italic">Danger zone</h2>
        </div>
        <p className="mt-2 text-sm text-[var(--w-muted)]">
          Disconnect this wallet from the exhibition site. Your balance and
          activity stay intact — you can reconnect any time with your token.
        </p>
        <button
          onClick={() => disconnectWallet()}
          disabled={connectedWalletId !== currentAccount.id}
          className="mt-5 rounded-lg border border-[var(--w-danger)]/60 bg-[var(--w-danger)]/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--w-danger)] hover:bg-[var(--w-danger)]/25 disabled:opacity-40"
        >
          Disconnect from site
        </button>
      </div>
    </div>
  );
}
