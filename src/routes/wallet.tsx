import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import { useMemo, useState } from "react";
import { WalletShell } from "@/components/wallet/WalletShell";
import { TxRow } from "@/components/wallet/TxRow";
import { useWallet, formatMoney, txSign } from "@/lib/wallet";

export const Route = createFileRoute("/wallet")({
  component: WalletDashboard,
  head: () => ({ meta: [{ title: "Aethelred Wallet" }] }),
});

function WalletDashboard() {
  return (
    <WalletShell>
      <Dashboard />
    </WalletShell>
  );
}

function Dashboard() {
  const { currentAccount, txsFor } = useWallet();
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!currentAccount) return null;

  const txs = txsFor(currentAccount.id);

  const stats = useMemo(() => {
    let deposited = 0,
      withdrawn = 0,
      spent = 0;
    for (const t of txs) {
      if (t.type === "deposit") deposited += t.amount;
      else if (t.type === "withdraw") withdrawn += t.amount;
      else if (txSign(t.type) < 0) spent += t.amount;
    }
    return { deposited, withdrawn, spent };
  }, [txs]);

  const copy = () => {
    navigator.clipboard.writeText(currentAccount.token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Balance card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/5 p-7 md:p-10"
        style={{ background: "var(--w-grad-balance)" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--w-muted)]">
              Total balance
            </p>
            <p className="mt-3 font-display text-6xl italic text-[var(--w-fg)] md:text-7xl">
              {formatMoney(currentAccount.balance)}
            </p>
            <p className="mt-2 text-xs text-[var(--w-muted)]">
              {currentAccount.email}
            </p>
          </div>
          <span className="rounded-full border border-[var(--w-accent)]/40 bg-[var(--w-accent)]/15 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--w-accent)]">
            Aethelred · USD
          </span>
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-4">
          <QuickAction to="/wallet/deposit" icon={ArrowDownToLine} label="Deposit" />
          <QuickAction to="/wallet/withdraw" icon={ArrowUpFromLine} label="Withdraw" />
          <QuickAction to="/wallet/send" icon={Send} label="Send" />
          <button
            onClick={() => setShowToken((v) => !v)}
            className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--w-fg)] hover:border-[var(--w-accent)]/50 hover:text-[var(--w-accent)]"
          >
            {showToken ? (
              <EyeOff className="size-3.5" strokeWidth={1.5} />
            ) : (
              <Eye className="size-3.5" strokeWidth={1.5} />
            )}
            Token
          </button>
        </div>

        {showToken && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/40 px-4 py-3">
            <code className="truncate font-mono text-sm tracking-wider text-[var(--w-accent)]">
              {currentAccount.token}
            </code>
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--w-fg)]/80 hover:text-[var(--w-accent)]"
            >
              {copied ? (
                <Check className="size-3" strokeWidth={2} />
              ) : (
                <Copy className="size-3" strokeWidth={1.5} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* Stat tiles */}
      <div className="grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-3">
        <Stat label="Total deposited" value={stats.deposited} positive />
        <Stat label="Total withdrawn" value={stats.withdrawn} />
        <Stat label="Spent on site" value={stats.spent} />
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-white/5 bg-[var(--w-surface)] p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl italic">Recent activity</h2>
          <Link
            to="/wallet/activity"
            className="text-[11px] uppercase tracking-[0.22em] text-[var(--w-muted)] hover:text-[var(--w-accent)]"
          >
            See all →
          </Link>
        </div>
        <div className="mt-4">
          {txs.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--w-muted)]">
              No activity yet. Make your first deposit to get started.
            </p>
          ) : (
            txs.slice(0, 8).map((t) => <TxRow key={t.id} tx={t} />)
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: typeof Send;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--w-fg)] hover:border-[var(--w-accent)]/50 hover:text-[var(--w-accent)]"
    >
      <Icon className="size-3.5" strokeWidth={1.5} />
      {label}
    </Link>
  );
}

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: number;
  positive?: boolean;
}) {
  return (
    <div className="bg-[var(--w-surface)] p-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)]">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-3xl italic ${
          positive ? "text-[var(--w-accent)]" : "text-[var(--w-fg)]"
        }`}
      >
        {formatMoney(value)}
      </p>
    </div>
  );
}
