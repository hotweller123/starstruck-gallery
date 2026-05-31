import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  CircleDot,
  Coins,
  Gavel,
  UserPlus,
  Palette as PaletteIcon,
  ShoppingBag,
  CircleDollarSign,
} from "lucide-react";
import {
  BentoCard,
  KpiTile,
  SectionHeader,
  StatusChip,
} from "@/components/admin/primitives";
import {
  adminActivity,
  fmtMoney,
  overviewKpis,
  pendingKyc,
  pendingWithdrawals,
  revenueSeries,
} from "@/data/admin-mock";
import { artworks } from "@/data/artworks";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const topArtworks = [...artworks]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-[1440px]">
      <SectionHeader
        title="Overview"
        description="Live snapshot of the exhibition and wallet operations. All numbers are mock data."
        action={
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
              Last 30 days
            </button>
            <button className="rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]">
              Export report
            </button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiTile label="Platform revenue" value={overviewKpis.revenue.value} delta={overviewKpis.revenue.delta} delay={0.0} />
        <KpiTile label="Wallet volume · 24h" value={overviewKpis.volume24h.value} delta={overviewKpis.volume24h.delta} delay={0.05} />
        <KpiTile label="Active auctions" value={overviewKpis.activeAuctions.value} delta={overviewKpis.activeAuctions.delta} format="number" delay={0.1} />
        <KpiTile label="New users" value={overviewKpis.newUsers.value} delta={overviewKpis.newUsers.delta} format="number" delay={0.15} />
      </div>

      {/* Bento grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Revenue chart */}
        <BentoCard
          className="lg:col-span-8"
          eyebrow="Last 30 days"
          title="Revenue & wallet volume"
          delay={0.18}
          action={
            <div className="flex items-center gap-3 text-[10px] font-semibold text-[var(--a-muted)]">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[var(--a-accent)]" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[var(--a-info)]" /> Volume</span>
            </div>
          }
        >
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--a-accent)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--a-accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-vol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--a-info)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--a-info)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--a-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--a-faint)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--a-faint)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={48} />
                <Tooltip
                  contentStyle={{ background: "var(--a-bg-2)", border: "1px solid var(--a-border-hi)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "var(--a-muted)" }}
                />
                <Area type="monotone" dataKey="volume" stroke="var(--a-info)" strokeWidth={1.6} fill="url(#g-vol)" />
                <Area type="monotone" dataKey="revenue" stroke="var(--a-accent)" strokeWidth={2} fill="url(#g-rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* Live activity */}
        <BentoCard
          className="lg:col-span-4"
          eyebrow="Live"
          title="Activity feed"
          delay={0.2}
          action={<span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-pos)]"><span className="size-1.5 rounded-full bg-[var(--a-pos)] a-live" /> LIVE</span>}
        >
          <ul className="space-y-3">
            {adminActivity.map((e) => {
              const Icon = ACTIVITY_ICON[e.kind];
              return (
                <li key={e.id} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[var(--a-surface-2)] text-[var(--a-accent)]">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-[var(--a-fg-2)]">
                      <span className="font-semibold text-[var(--a-fg)]">{e.who}</span>{" "}
                      <span className="text-[var(--a-muted)]">{e.detail}</span>
                    </p>
                    <p className="text-[10px] text-[var(--a-faint)]">{e.at} ago</p>
                  </div>
                  {e.amount !== undefined && (
                    <span className="a-mono text-xs font-bold text-[var(--a-fg)]">
                      {fmtMoney(e.amount)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </BentoCard>

        {/* Top artworks */}
        <BentoCard
          className="lg:col-span-5"
          eyebrow="Trending"
          title="Top performing artworks"
          delay={0.22}
          action={<Link to="/admin/exhibition" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)] hover:underline">View all <ArrowUpRight className="size-3" /></Link>}
        >
          <ul className="divide-y divide-[var(--a-border)]">
            {topArtworks.map((a, i) => (
              <li key={a.slug} className="flex items-center gap-3 py-2.5">
                <span className="a-mono w-6 text-center text-[11px] font-bold text-[var(--a-muted)]">{String(i + 1).padStart(2, "0")}</span>
                <img src={a.image} alt={a.title} className="size-10 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[var(--a-fg)]">{a.title}</p>
                  <p className="truncate text-[10px] text-[var(--a-muted)]">{a.artist} · {a.categoryLabel}</p>
                </div>
                <p className="a-mono text-xs font-bold text-[var(--a-accent)]">{fmtMoney(a.price)}</p>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Pending withdrawals */}
        <BentoCard
          className="lg:col-span-4"
          eyebrow="Queue"
          title="Pending withdrawals"
          delay={0.24}
          action={<Link to="/admin/wallet" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)] hover:underline">Open <ArrowUpRight className="size-3" /></Link>}
        >
          <ul className="space-y-2.5">
            {pendingWithdrawals.length === 0 ? (
              <li className="py-8 text-center text-xs text-[var(--a-muted)]">All clear.</li>
            ) : (
              pendingWithdrawals.slice(0, 5).map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[var(--a-fg)]">{tx.user}</p>
                    <p className="a-mono truncate text-[10px] text-[var(--a-muted)]">{tx.id} · {tx.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="a-mono text-xs font-bold text-[var(--a-fg)]">{fmtMoney(tx.amount)}</p>
                    <div className="mt-1 flex gap-1">
                      <button className="rounded bg-[var(--a-pos)]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-pos)] hover:bg-[var(--a-pos)]/25">OK</button>
                      <button className="rounded bg-[var(--a-neg)]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-neg)] hover:bg-[var(--a-neg)]/25">Reject</button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </BentoCard>

        {/* Pending KYC */}
        <BentoCard
          className="lg:col-span-3"
          eyebrow="Review"
          title="Pending KYC"
          delay={0.26}
        >
          <ul className="space-y-2.5">
            {pendingKyc.length === 0 ? (
              <li className="py-8 text-center text-xs text-[var(--a-muted)]">No submissions.</li>
            ) : (
              pendingKyc.map((u) => (
                <li key={u.id} className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-md bg-[var(--a-surface-2)] text-[11px] font-bold text-[var(--a-accent)]">
                    {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[var(--a-fg)]">{u.name}</p>
                    <p className="text-[10px] text-[var(--a-muted)]">Submitted {u.submitted}</p>
                  </div>
                  <button className="rounded border border-[var(--a-border-hi)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">Open</button>
                </li>
              ))
            )}
          </ul>
        </BentoCard>
      </div>
    </div>
  );
}

const ACTIVITY_ICON = {
  deposit: Coins,
  withdraw: CircleDollarSign,
  signup: UserPlus,
  bid: Gavel,
  sale: ShoppingBag,
  listing: PaletteIcon,
} as const;

void CircleDot;
