import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  ArrowLeft, Mail, Calendar, MapPin, ShieldCheck, KeyRound, Smartphone,
  Wallet as WalletIcon, Gavel, Heart, Package, FileText, Ban, RefreshCw,
  Download, MoreHorizontal, ExternalLink, CheckCircle2,
} from "lucide-react";
import {
  BentoCard, DataTable, SectionHeader, StatusChip,
} from "@/components/admin/primitives";
import { getUserActivity, fmtMoney, fmtDateTime } from "@/data/admin-mock";

export const Route = createFileRoute("/admin/users/$id")({
  component: UserDetail,
});

function UserDetail() {
  const { id } = useParams({ from: "/admin/users/$id" });
  const data = getUserActivity(id);

  if (!data) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--a-muted)] hover:text-[var(--a-fg)]">
          <ArrowLeft className="size-3.5" /> Back to users
        </Link>
        <p className="mt-6 text-sm text-[var(--a-muted)]">User not found.</p>
      </div>
    );
  }

  const { user, bids, orders, favourites, txs, wallet, series, notes } = data;
  const initials = user.name.split(" ").map((p) => p[0]).join("").slice(0, 2);

  return (
    <div className="mx-auto max-w-[1440px]">
      <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--a-muted)] hover:text-[var(--a-fg)]">
        <ArrowLeft className="size-3.5" /> Back to users
      </Link>

      {/* Identity card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="a-card-elev mt-4 flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6"
      >
        <div className="flex items-center gap-4">
          <span
            className="grid size-16 place-items-center rounded-xl text-lg font-extrabold text-[var(--a-accent-ink)] shadow-lg"
            style={{ background: user.avatar }}
          >
            {initials}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-[var(--a-fg)]">{user.name}</h1>
              <StatusChip value={user.status} />
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--a-border-hi)] bg-[var(--a-accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)]">
                <ShieldCheck className="size-3" /> {user.role}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--a-muted)]">
              <span className="inline-flex items-center gap-1.5"><Mail className="size-3" /> {user.email}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="size-3" /> Joined {fmtDateTime(user.joined)}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="size-3" /> Lisbon, PT</span>
              <span className="a-mono">{wallet.accountNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
            <Mail className="size-3.5" /> Message
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
            <KeyRound className="size-3.5" /> Reset password
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-neg)] hover:bg-[var(--a-neg)]/10">
            <Ban className="size-3.5" /> Suspend
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]">
            <CheckCircle2 className="size-3.5" /> Approve
          </button>
        </div>
      </motion.div>

      {/* Wallet KPIs */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <WalletStat label="Available" value={fmtMoney(wallet.available)} accent />
        <WalletStat label="Pending" value={fmtMoney(wallet.pending)} />
        <WalletStat label="In escrow" value={fmtMoney(wallet.inEscrow)} />
        <WalletStat label="Lifetime fees" value={fmtMoney(wallet.feesPaid)} />
      </div>

      {/* Main bento grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Balance chart */}
        <BentoCard
          className="lg:col-span-8"
          eyebrow="Last 14 days"
          title="Wallet balance trend"
          delay={0.1}
          action={
            <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-muted)] hover:text-[var(--a-fg)]">
              <Download className="size-3" /> Export
            </button>
          }
        >
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="u-bal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--a-accent)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--a-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--a-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--a-faint)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--a-faint)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={48} />
                <Tooltip
                  contentStyle={{ background: "var(--a-bg-2)", border: "1px solid var(--a-border-hi)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "var(--a-muted)" }}
                />
                <Area type="monotone" dataKey="balance" stroke="var(--a-accent)" strokeWidth={2} fill="url(#u-bal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* Security & account */}
        <BentoCard className="lg:col-span-4" eyebrow="Security" title="Account integrity" delay={0.14}>
          <ul className="space-y-3 text-xs">
            <SecRow icon={ShieldCheck} label="KYC" value={wallet.kycLevel} good />
            <SecRow icon={KeyRound} label="2FA" value={wallet.twoFactor ? "Enabled" : "Disabled"} good={wallet.twoFactor} />
            <SecRow icon={Smartphone} label="Active devices" value={`${wallet.devices} trusted`} />
            <SecRow icon={WalletIcon} label="Lifetime inflow" value={fmtMoney(wallet.lifetimeIn)} />
            <SecRow icon={RefreshCw} label="Lifetime outflow" value={fmtMoney(wallet.lifetimeOut)} />
          </ul>
        </BentoCard>

        {/* Bids */}
        <BentoCard
          className="lg:col-span-7"
          eyebrow="Exhibition · Bidding"
          title="Active & past bids"
          delay={0.18}
          action={<span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent)]"><Gavel className="size-3" /> {bids.length} total</span>}
        >
          <DataTable
            rows={bids}
            columns={[
              { key: "lot", header: "Lot", render: (r) => (
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded bg-[var(--a-surface-2)] text-[var(--a-accent)]"><Gavel className="size-3" /></span>
                  <span className="text-xs font-semibold text-[var(--a-fg)]">{r.lotTitle}</span>
                </div>
              ) },
              { key: "amount", header: "Bid", render: (r) => <span className="a-mono text-xs font-bold text-[var(--a-fg)]">{fmtMoney(r.amount)}</span> },
              { key: "status", header: "Status", render: (r) => <StatusChip value={r.status} /> },
              { key: "at", header: "When", render: (r) => <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.at)}</span> },
            ]}
          />
        </BentoCard>

        {/* Orders */}
        <BentoCard
          className="lg:col-span-5"
          eyebrow="Exhibition · Purchases"
          title="Orders"
          delay={0.22}
          action={<span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent-2)]"><Package className="size-3" /> {orders.length} total</span>}
        >
          <ul className="space-y-2.5">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5">
                <img src={o.image} alt={o.artworkTitle} className="size-12 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[var(--a-fg)]">{o.artworkTitle}</p>
                  <p className="a-mono text-[10px] text-[var(--a-muted)]">{o.id} · {fmtDateTime(o.at)}</p>
                </div>
                <div className="text-right">
                  <p className="a-mono text-xs font-bold text-[var(--a-fg)]">{fmtMoney(o.amount)}</p>
                  <div className="mt-1"><StatusChip value={o.status} /></div>
                </div>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Wallet transactions */}
        <BentoCard
          className="lg:col-span-8"
          eyebrow="Wallet · Ledger"
          title="Recent transactions"
          delay={0.26}
          action={
            <Link to="/admin/wallet" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)] hover:underline">
              Open ledger <ExternalLink className="size-3" />
            </Link>
          }
        >
          <DataTable
            rows={txs}
            columns={[
              { key: "id", header: "Tx ID", render: (r) => <span className="a-mono text-xs text-[var(--a-muted)]">{r.id}</span> },
              { key: "type", header: "Type", render: (r) => <span className="inline-flex rounded bg-[var(--a-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]">{r.type}</span> },
              { key: "method", header: "Method", render: (r) => <span className="text-xs text-[var(--a-fg-2)]">{r.method}</span> },
              { key: "amount", header: "Amount", render: (r) => <span className="a-mono text-xs font-bold text-[var(--a-fg)]">{fmtMoney(r.amount)}</span> },
              { key: "status", header: "Status", render: (r) => <StatusChip value={r.status} /> },
              { key: "at", header: "When", render: (r) => <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.createdAt)}</span> },
            ]}
          />
        </BentoCard>

        {/* Favourites */}
        <BentoCard
          className="lg:col-span-4"
          eyebrow="Exhibition · Watchlist"
          title="Favourited works"
          delay={0.3}
          action={<span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent-2)]"><Heart className="size-3" /> {favourites.length}</span>}
        >
          <ul className="grid grid-cols-2 gap-2">
            {favourites.slice(0, 6).map((f) => (
              <li key={f.slug} className="overflow-hidden rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)]">
                <img src={f.image} alt={f.title} className="aspect-square w-full object-cover" />
                <div className="p-2">
                  <p className="truncate text-[10px] font-semibold text-[var(--a-fg)]">{f.title}</p>
                  <p className="a-mono text-[10px] text-[var(--a-accent)]">{fmtMoney(f.price)}</p>
                </div>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Admin notes */}
        <BentoCard
          className="lg:col-span-12"
          eyebrow="Internal"
          title="Admin notes"
          delay={0.34}
          action={
            <button className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]">
              <FileText className="size-3" /> Add note
            </button>
          }
        >
          <ul className="space-y-2.5">
            {notes.map((n) => (
              <li key={n.id} className="flex items-start gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-3">
                <span className="grid size-8 place-items-center rounded bg-[var(--a-accent-2-soft)] text-[10px] font-bold text-[var(--a-accent-2)]">
                  {n.author.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[var(--a-fg)]">{n.author}</p>
                    <p className="text-[10px] text-[var(--a-faint)]">{fmtDateTime(n.at)}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--a-fg-2)]">{n.body}</p>
                </div>
                <button className="grid size-7 place-items-center rounded text-[var(--a-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-fg)]"><MoreHorizontal className="size-3.5" /></button>
              </li>
            ))}
          </ul>
        </BentoCard>
      </div>
    </div>
  );
}

function WalletStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`a-card-elev p-4 ${accent ? "ring-1 ring-[var(--a-accent)]/40" : ""}`}>
      <p className="a-eyebrow">{label}</p>
      <p className={`font-display mt-1.5 text-2xl font-extrabold tracking-tight ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-fg)]"}`}>{value}</p>
    </div>
  );
}

function SecRow({ icon: Icon, label, value, good }: { icon: typeof ShieldCheck; label: string; value: string; good?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5">
      <span className="inline-flex items-center gap-2 text-[var(--a-muted)]">
        <Icon className="size-3.5" />
        <span className="font-semibold text-[var(--a-fg-2)]">{label}</span>
      </span>
      <span className={`a-mono text-xs font-bold ${good ? "text-[var(--a-pos)]" : "text-[var(--a-fg)]"}`}>{value}</span>
    </li>
  );
}

export default UserDetail;
