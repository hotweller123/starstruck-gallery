import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
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
  Sparkles,
  Gavel,
  Palette,
  ArrowUpRight,
  Repeat2,
  PiggyBank,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { WalletShell } from "@/components/wallet/WalletShell";
import { TxRow } from "@/components/wallet/TxRow";
import { useWallet, formatMoney, txSign } from "@/lib/wallet";
import { useAuthStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";

export const Route = createFileRoute("/wallet")({
  component: WalletDashboard,
  head: () => ({ meta: [{ title: "EmberPay — Aethelred Wallet" }] }),
});

function WalletDashboard() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isExact = pathname === "/wallet";
  return <WalletShell>{isExact ? <Dashboard /> : <Outlet />}</WalletShell>;
}

function Dashboard() {
  const { currentAccount } = useAuthStore(
    useShallow((state) => ({
      currentAccount: state.user,
    })),
  );
  const [showBal, setShowBal] = useState(true);
  const [copied, setCopied] = useState(false);

  console.log(currentAccount);
  if (!currentAccount) return null;

  const stats = useMemo(() => {
    const deposited = 0;
    const withdrawn = 0;
    const spent = 0;
    // for (const t of txs) {
    //   if (t.type === "deposit") deposited += t.amount;
    //   else if (t.type === "withdraw") withdrawn += t.amount;
    //   else if (txSign(t.type) < 0) spent += t.amount;
    // }
    return { deposited, withdrawn, spent };
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(currentAccount.token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Hero balance card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-7 shadow-2xl wallet-ring md:p-9"
      >
        <div className="absolute inset-0 wallet-dotgrid opacity-30" aria-hidden />
        {/* orange corner accent */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--w-brand)" }}
          aria-hidden
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--w-muted)]">
              <span className="size-1.5 rounded-full wallet-live-dot" /> Total balance
            </p>
            <motion.button
              onClick={() => setShowBal((v) => !v)}
              whileTap={{ scale: 0.98 }}
              className="mt-3 flex items-center gap-3 text-left"
            >
              <span className="text-5xl font-extrabold tracking-tight text-[var(--w-fg)] md:text-7xl">
                {showBal ? formatMoney(currentAccount.wallet.balance) : "••••••"}
              </span>
              <span className="grid size-9 place-items-center rounded-full border border-[var(--w-border)] bg-[var(--w-bg-2)] text-[var(--w-muted)]">
                {showBal ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </span>
            </motion.button>
            <p className="mt-2 flex items-center gap-2 text-xs text-[var(--w-muted)]">
              <span className="inline-block size-1.5 rounded-full bg-[var(--w-brand)]" />
              {currentAccount.fullName} · {currentAccount.email}
            </p>
          </div>

          <div className="hidden shrink-0 rounded-[1.25rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] px-4 py-3 text-right md:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
              24h
            </p>
            <p className="mt-1 text-sm font-extrabold text-[var(--w-brand)]">
              ▲ {formatMoney(Math.max(stats.deposited - stats.spent, 0))}
            </p>
          </div>
        </div>

        {/* Token chip */}
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
          onClick={copy}
          className="relative mt-6 flex w-full items-center justify-between gap-3 rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] px-4 py-3 text-left transition hover:border-[var(--w-brand)]/40"
        >
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
              Your wallet token
            </p>
            <code className="truncate font-mono text-sm font-semibold tracking-wider text-[var(--w-fg)]">
              {currentAccount.token}
            </code>
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider"
            style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? "Copied" : "Copy"}
          </span>
        </motion.button>

        {/* Action row */}
        <div className="relative mt-5 grid grid-cols-4 gap-2">
          <Action to="/wallet/deposit" icon={ArrowDownToLine} label="Deposit" />
          <Action to="/wallet/withdraw" icon={ArrowUpFromLine} label="Withdraw" />
          <Action to="/wallet/send" icon={Send} label="Send" />
          <Action to="/wallet/activity" icon={Repeat2} label="History" />
        </div>
      </motion.div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        <Stat
          label="Deposited"
          value={stats.deposited}
          icon={TrendingUp}
          tint="var(--w-brand)"
          delay={0.05}
        />
        <Stat
          label="Withdrawn"
          value={stats.withdrawn}
          icon={TrendingDown}
          tint="var(--w-fg)"
          delay={0.1}
        />
        <Stat
          label="Spent"
          value={stats.spent}
          icon={ShoppingBag}
          tint="var(--w-neg)"
          delay={0.15}
        />
      </div>

      {/* Discover row */}
      <div className="grid gap-3 sm:grid-cols-3">
        <DiscoverCard
          icon={Gavel}
          title="Live auctions"
          desc="3 lots closing tonight"
          href="/auctions"
        />
        <DiscoverCard
          icon={Palette}
          title="New artworks"
          desc="42 fresh on the wall"
          href="/gallery"
        />
        <DiscoverCard
          icon={PiggyBank}
          title="Top up wallet"
          desc="Fund in seconds"
          href="/wallet/deposit"
          accent
        />
      </div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-5 md:p-7"
      >
        <div className="flex items-baseline justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--w-fg)]">
            <Sparkles className="size-4 text-[var(--w-brand)]" />
            Recent activity
          </h2>
          <Link
            to="/wallet/activity"
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--w-brand)] hover:underline"
          >
            See all <ArrowUpRight className="size-3" />
          </Link>
        </div>
        <div className="mt-3">
          {/* {txs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--w-muted)]">
                No activity yet. Tap Deposit to get started.
              </p>
            </div>
          ) : (
            txs.slice(0, 6).map((t) => <TxRow key={t.id} tx={t} />)
          )} */}
        </div>
      </motion.div>
    </div>
  );
}

function Action({ to, icon: Icon, label }: { to: string; icon: typeof Send; label: string }) {
  return (
    <Link to={to} className="group">
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="flex flex-col items-center gap-2 rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] px-3 py-4 transition hover:border-[var(--w-brand)]/40"
      >
        <span
          className="grid size-11 place-items-center rounded-[1.1rem] text-[var(--w-brand-contrast)] shadow-md"
          style={{ background: "var(--w-brand)" }}
        >
          <Icon className="size-5" strokeWidth={2.2} />
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--w-fg)]">
          {label}
        </span>
      </motion.div>
    </Link>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tint,
  delay = 0,
}: {
  label: string;
  value: number;
  icon: typeof TrendingUp;
  tint: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--w-muted)]">
          {label}
        </p>
        <span
          className="grid size-7 place-items-center rounded-lg text-[var(--w-brand-contrast)]"
          style={{ backgroundColor: tint }}
        >
          <Icon className="size-3.5" strokeWidth={2.2} />
        </span>
      </div>
      <p className="mt-2 text-xl font-extrabold tracking-tight text-[var(--w-fg)]">
        {formatMoney(value)}
      </p>
    </motion.div>
  );
}

function DiscoverCard({
  icon: Icon,
  title,
  desc,
  href,
  accent,
}: {
  icon: typeof Gavel;
  title: string;
  desc: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link to={href}>
      <motion.div
        whileHover={{ y: -3 }}
        className={`relative h-full overflow-hidden rounded-[1.5rem] border p-4 transition ${
          accent
            ? "border-[var(--w-brand)]/40 bg-[var(--w-brand-soft)]"
            : "border-[var(--w-border)] bg-[var(--w-surface)] hover:border-[var(--w-brand)]/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className="grid size-9 place-items-center rounded-[1rem]"
            style={
              accent
                ? { background: "var(--w-brand)", color: "var(--w-brand-contrast)" }
                : { background: "var(--w-bg-2)", color: "var(--w-brand)" }
            }
          >
            <Icon className="size-4" strokeWidth={2.2} />
          </span>
          <ArrowUpRight className="size-4 text-[var(--w-muted)]" />
        </div>
        <p className="mt-3 text-sm font-extrabold tracking-tight text-[var(--w-fg)]">{title}</p>
        <p className="text-xs text-[var(--w-muted)]">{desc}</p>
      </motion.div>
    </Link>
  );
}
