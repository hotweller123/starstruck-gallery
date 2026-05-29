import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Eye,
  EyeOff,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
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
  const [showBal, setShowBal] = useState(true);
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
    <div className="flex flex-col gap-5">
      {/* Balance card */}
      <div
        className="relative overflow-hidden rounded-3xl p-7 text-white shadow-2xl md:p-9"
        style={{ background: "var(--w-grad-balance)" }}
      >
        <div className="absolute -right-12 -top-12 size-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 size-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">
              Total balance
            </p>
            <button
              onClick={() => setShowBal((v) => !v)}
              className="mt-3 flex items-center gap-3 text-left"
            >
              <span className="text-5xl font-extrabold tracking-tight md:text-6xl">
                {showBal ? formatMoney(currentAccount.balance) : "••••••"}
              </span>
              <span className="grid size-7 place-items-center rounded-full bg-white/15 text-white/90">
                {showBal ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </span>
            </button>
            <p className="mt-2 text-xs text-white/70">{currentAccount.email}</p>
          </div>
        </div>

        {/* Token chip */}
        <button
          onClick={copy}
          className="relative mt-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left backdrop-blur transition hover:bg-white/15"
        >
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70">
              Your token
            </p>
            <code className="truncate font-mono text-sm font-semibold tracking-wider text-white">
              {currentAccount.token}
            </code>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>

        {/* Action row */}
        <div className="relative mt-5 grid grid-cols-3 gap-2">
          <Action to="/wallet/deposit" icon={ArrowDownToLine} label="Deposit" />
          <Action to="/wallet/withdraw" icon={ArrowUpFromLine} label="Withdraw" />
          <Action to="/wallet/send" icon={Send} label="Send" />
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        <Stat
          label="Deposited"
          value={stats.deposited}
          icon={TrendingUp}
          tint="var(--w-pos)"
        />
        <Stat
          label="Withdrawn"
          value={stats.withdrawn}
          icon={TrendingDown}
          tint="var(--w-brand)"
        />
        <Stat
          label="Spent"
          value={stats.spent}
          icon={ShoppingBag}
          tint="var(--w-neg)"
        />
      </div>

      {/* Recent activity */}
      <div className="rounded-3xl border border-[var(--w-border)] bg-[var(--w-surface)] p-5 md:p-7">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[var(--w-fg)]">
            Recent activity
          </h2>
          <Link
            to="/wallet/activity"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--w-brand)] hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="mt-3">
          {txs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--w-muted)]">
                No activity yet. Tap Deposit to get started.
              </p>
            </div>
          ) : (
            txs.slice(0, 6).map((t) => <TxRow key={t.id} tx={t} />)
          )}
        </div>
      </div>
    </div>
  );
}

function Action({
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
      className="group flex flex-col items-center gap-2 rounded-2xl bg-white/10 px-3 py-4 backdrop-blur transition hover:bg-white/20"
    >
      <span className="grid size-11 place-items-center rounded-2xl bg-white text-[var(--w-brand)] shadow-lg transition group-hover:scale-110">
        <Icon className="size-5" strokeWidth={2.2} />
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-white">
        {label}
      </span>
    </Link>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string;
  value: number;
  icon: typeof TrendingUp;
  tint: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--w-border)] bg-[var(--w-surface)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--w-muted)]">
          {label}
        </p>
        <span
          className="grid size-7 place-items-center rounded-lg text-white"
          style={{ backgroundColor: tint }}
        >
          <Icon className="size-3.5" strokeWidth={2.2} />
        </span>
      </div>
      <p className="mt-2 text-xl font-bold tracking-tight text-[var(--w-fg)]">
        {formatMoney(value)}
      </p>
    </div>
  );
}
