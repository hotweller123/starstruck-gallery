import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ArrowLeft,
  Mail,
  Calendar,
  MapPin,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Wallet as WalletIcon,
  Gavel,
  Heart,
  Package,
  FileText,
  Ban,
  RefreshCw,
  Download,
  MoreHorizontal,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Crown,
  XCircle,
  Truck,
  RotateCcw,
  NotebookIcon,
  Hammer,
  Check,
  X,
} from "lucide-react";
import { BentoCard, DataTable, StatusChip } from "@/components/admin/primitives";
import { RecordSheet, type FieldDef } from "@/components/admin/RecordSheet";
import {
  getUserActivity,
  fmtMoney,
  fmtDateTime,
  type UserBid,
  type UserOrder,
  type UserFavourite,
  type UserNote,
  type AdminTx,
} from "@/data/admin-mock";
import { useDataStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import { Bid, WalletAccount, WalletTx } from "@/types";
import { AuctionLot, inHours } from "@/data/auctions";
import { AuctionImageSwiper } from "@/components/site/AuctionImageSwiper";
import { useToast } from "@/lib/useToast";
import useDoc from "@/hooks/useDoc";
import { ToastPosition } from "@/components/ui/toast";

export const Route = createFileRoute("/admin/users/$id")({
  component: UserDetail,
});

type SheetTarget =
  | { kind: "bid"; row: Bid }
  // | { kind: "order"; row: UserOrder }
  | { kind: "tx"; row: WalletTx }
  | { kind: "auction"; row: AuctionLot }
  // | { kind: "fav"; row: UserFavourite & { id: string } }
  // | { kind: "note"; row: UserNote }
  | null;

function UserDetail() {
  const { users, userAuctions, transactions, userBids } = useDataStore(
    useShallow((s) => ({
      users: s.users,
      userAuctions: s.auctions,
      transactions: s.transactions,
      userBids: s.bids,
    })),
  );
  const { id } = useParams({ from: "/admin/users/$id" });
  const currentUser = users.find((u) => u.id == id);

  // Local mutable copies so edits from the sheet reflect immediately.
  const [bids, setBids] = useState<Bid[]>(userBids ?? []);
  // const [orders, setOrders] = useState<UserOrder[]>(currentUser?.orders ?? []);
  const [txs, setTxs] = useState<WalletTx[]>(transactions ?? []);
  const [auctions, setAuctions] = useState<AuctionLot[]>(userAuctions ?? []);
  // const [favourites, setFavourites] = useState<UserFavourite[]>(currentUser?.favourites ?? []);
  // const [notes, setNotes] = useState<UserNote[]>(currentUser?.notes ?? []);
  const [target, setTarget] = useState<SheetTarget>(null);

  // const favRows = useMemo(() => favourites.map((f) => ({ ...f, id: f.slug })), [favourites]);

  const [open, setOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--a-muted)] hover:text-[var(--a-fg)]"
        >
          <ArrowLeft className="size-3.5" /> Back to users
        </Link>
        <p className="mt-6 text-sm text-[var(--a-muted)]">User not found.</p>
      </div>
    );
  }

  // const { user, wallet, series } = currentUser;
  const initials = currentUser.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  const close = () => setTarget(null);

  const accFields: FieldDef<WalletAccount>[] = [
    { key: "fullName", label: "Name", span: 2, editable: false },
    { key: "email", label: "Email", editable: false },
    {
      key: "token",
      label: "Token",
      editable: false,
    },
    { key: "userName", label: "User Name/Seller Slug" },

    {
      key: "status",
      label: "Status",
      kind: "select",
      options: ["active", "pending", "suspended"].map((v) => ({ value: v, label: v })),
    },
    { key: "wallet.balance", label: "Wallet balance", kind: "money" },
    { key: "wallet.bidBalance", label: "Wallet Bid Balance", kind: "money" },
    {
      key: "joinedDate",
      label: "Joined",
      editable: false,
      render: (v) => fmtDateTime(v as string),
    },
  ];

  const { toast } = useToast();
  const { updateDocument } = useDoc();

  const errorToast = (error: any, position?: ToastPosition, description?: string, action?: any) => {
    toast({
      title: "Error",
      description: description || error.message,
      action: action ?? undefined,
      variant: "error",
      position,
    });
  };

  const modToast = () => {
    toast({
      title: "Success",
      description: "Changes Made",
      variant: "info",
      duration: 40000,
    });
  };

  const warnToast = () => {
    toast({
      title: "Error",
      description: "Error In Selection",
      variant: "warning",
      duration: 40000,
    });
  };

  return (
    <div className="mx-auto max-w-[1440px]">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--a-muted)] hover:text-[var(--a-fg)]"
      >
        <ArrowLeft className="size-3.5" /> Back to users
      </Link>

      {/* Identity card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="a-card-elev mt-4 flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6"
      >
        <div className="flex items-center gap-4">
          <span
            className="grid size-16 place-items-center rounded-xl text-lg font-extrabold text-[var(--a-accent-ink)] shadow-lg"
            style={{ background: "orange" }}
          >
            {initials}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-[var(--a-fg)]">
                {currentUser.fullName}
              </h1>
              <StatusChip value={currentUser.status} />
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--a-border-hi)] bg-[var(--a-accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)]">
                <ShieldCheck className="size-3" /> {currentUser.role}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--a-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3" /> {currentUser.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" /> Joined {fmtDateTime(currentUser.joinedDate)}
              </span>
              {/* <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3" /> Lisbon, PT
              </span> */}
              <span className="a-mono">{currentUser.token}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* todo: add href link for mail */}
          <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
            <Mail className="size-3.5" /> Message
          </button>
          {/* <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
            <KeyRound className="size-3.5" /> Reset password
          </button> */}

          <button
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
            onClick={() => setOpen(true)}
          >
            <CheckCircle2 className="size-3.5" /> View Details
          </button>
        </div>
      </motion.div>

      <RecordSheet<WalletAccount>
        open={open}
        onOpenChange={setOpen}
        fields={accFields}
        record={currentUser}
        title={currentUser.fullName + " Information"}
        subtitle={""}
        eyebrow={fmtMoney(currentUser.wallet.balance)}
        onSave={async (p) => {
          if (!currentUser) {
            warnToast();
            return;
          }

          try {
            await updateDocument({
              collections: "users",
              document: {
                ...currentUser,
                ...p,
              },
            });

            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            close();
          }
        }}
        operations={[
          {
            id: "activate",
            label: "Activate User",
            icon: Check,
            tone: "success",
            onRun: async () => {
              if (!currentUser) {
                warnToast();
                return;
              }

              try {
                await updateDocument({
                  collections: "users",
                  document: {
                    ...currentUser,
                    status: "active",
                  },
                });
              } catch (error) {
                errorToast(error);
              } finally {
                close();
              }
            },
          },
          {
            id: "suspend",
            label: "Suspend User",
            icon: X,
            tone: "danger",
            onRun: async () => {
              if (!currentUser) {
                warnToast();
                return;
              }

              try {
                await updateDocument({
                  collections: "users",
                  document: {
                    ...currentUser,
                    status: "suspended",
                  },
                });
              } catch (error) {
                errorToast(error);
              } finally {
                close();
              }
            },
          },
        ]}
      />

      {/* Wallet KPIs */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <WalletStat label="Balance" value={fmtMoney(currentUser.wallet.balance)} accent />
        <WalletStat label="Bid Balance" value={fmtMoney(currentUser.wallet.bidBalance)} />
        {/* <WalletStat label="In escrow" value={fmtMoney(wallet.inEscrow)} />
        <WalletStat label="Lifetime fees" value={fmtMoney(wallet.feesPaid)} /> */}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Balance chart */}
        {/* <BentoCard
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
                <XAxis
                  dataKey="day"
                  stroke="var(--a-faint)"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--a-faint)"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--a-bg-2)",
                    border: "1px solid var(--a-border-hi)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "var(--a-muted)" }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--a-accent)"
                  strokeWidth={2}
                  fill="url(#u-bal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BentoCard> */}

        {/* Security & account */}
        {/* <BentoCard
          className="lg:col-span-4"
          eyebrow="Security"
          title="Account integrity"
          delay={0.14}
        >
          <ul className="space-y-3 text-xs">
            <SecRow icon={ShieldCheck} label="KYC" value={wallet.kycLevel} good />
            <SecRow
              icon={KeyRound}
              label="2FA"
              value={wallet.twoFactor ? "Enabled" : "Disabled"}
              good={wallet.twoFactor}
            />
            <SecRow icon={Smartphone} label="Active devices" value={`${wallet.devices} trusted`} />
            <SecRow icon={WalletIcon} label="Lifetime inflow" value={fmtMoney(wallet.lifetimeIn)} />
            <SecRow
              icon={RefreshCw}
              label="Lifetime outflow"
              value={fmtMoney(wallet.lifetimeOut)}
            />
          </ul>
        </BentoCard> */}

        {/* Bids */}
        <BentoCard
          className="lg:col-span-7"
          eyebrow="Exhibition · Auctions"
          title={`Listed Auctions From ${currentUser.fullName}`}
          delay={0.12}
          action={
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent)]">
              <Gavel className="size-3" /> {auctions.length} total
            </span>
          }
        >
          <DataTable
            rows={auctions}
            onRowClick={(r) => setTarget({ kind: "auction", row: r })}
            columns={[
              {
                key: "title",
                header: "Title",
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded bg-[var(--a-surface-2)] text-[var(--a-accent)]">
                      <Gavel className="size-3" />
                    </span>
                    <span className="text-xs font-semibold text-[var(--a-fg)]">{r.title}</span>
                  </div>
                ),
              },
              {
                key: "startBid",
                header: "Start Bid",
                render: (r) => (
                  <span className="a-mono text-xs font-bold text-[var(--a-fg)]">
                    {fmtMoney(r.startBid)}
                  </span>
                ),
              },
              {
                key: "currentBid",
                header: "Current Bid",
                render: (r) => (
                  <span className="a-mono text-xs font-bold text-[var(--a-fg)]">
                    {fmtMoney(r.currentBid)}
                  </span>
                ),
              },
              { key: "status", header: "Status", render: (r) => <StatusChip value={r.status} /> },
              {
                key: "at",
                header: "Time Of Upload",
                render: (r) => (
                  <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.endsAt)}</span>
                ),
              },
            ]}
          />
        </BentoCard>
        <BentoCard
          className="lg:col-span-5"
          eyebrow="Exhibition · Bidding"
          title="Active & past bids"
          delay={0.18}
          action={
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent)]">
              <Hammer className="size-3" /> {bids.length} total
            </span>
          }
        >
          <DataTable
            rows={bids}
            onRowClick={(r) => setTarget({ kind: "bid", row: r })}
            columns={[
              {
                key: "lot",
                header: "Lot",
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded bg-[var(--a-surface-2)] text-[var(--a-accent)]">
                      <Hammer className="size-3" />
                    </span>
                    <span className="text-xs font-semibold text-[var(--a-fg)]">{r.lotTitle}</span>
                  </div>
                ),
              },
              {
                key: "amount",
                header: "Bid",
                render: (r) => (
                  <span className="a-mono text-xs font-bold text-[var(--a-fg)]">
                    {fmtMoney(r.bidAmount)}
                  </span>
                ),
              },
              { key: "status", header: "Status", render: (r) => <StatusChip value={"Leading"} /> },
              {
                key: "at",
                header: "When",
                render: (r) => (
                  <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.placedAt)}</span>
                ),
              },
            ]}
          />
        </BentoCard>

        {/* Orders */}
        {/* <BentoCard
          className="lg:col-span-5"
          eyebrow="Exhibition · Purchases"
          title="Orders"
          delay={0.22}
          action={
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent-2)]">
              <Package className="size-3" /> {orders.length} total
            </span>
          }
        >
          <ul className="space-y-2.5">
            {orders.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => setTarget({ kind: "order", row: o })}
                  className="flex w-full items-center gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5 text-left transition hover:border-[var(--a-border-hi)] hover:bg-[var(--a-surface)]"
                >
                  <img
                    src={o.image}
                    alt={o.artworkTitle}
                    className="size-12 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[var(--a-fg)]">
                      {o.artworkTitle}
                    </p>
                    <p className="a-mono text-[10px] text-[var(--a-muted)]">
                      {o.id} · {fmtDateTime(o.at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="a-mono text-xs font-bold text-[var(--a-fg)]">
                      {fmtMoney(o.amount)}
                    </p>
                    <div className="mt-1">
                      <StatusChip value={o.status} />
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </BentoCard> */}

        {/* Wallet transactions */}
        <BentoCard
          className="lg:col-span-8"
          eyebrow="Wallet · Ledger"
          title="Recent transactions"
          delay={0.26}
          action={
            <Link
              to="/admin/wallet"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)] hover:underline"
            >
              Open ledger <ExternalLink className="size-3" />
            </Link>
          }
        >
          <DataTable
            rows={txs}
            onRowClick={(r) => setTarget({ kind: "tx", row: r })}
            columns={[
              {
                key: "fullName",
                header: "Full Name",
                render: (r) => (
                  <span className="a-mono text-xs text-[var(--a-muted)]">{r.fullName}</span>
                ),
              },
              {
                key: "type",
                header: "Type",
                render: (r) => (
                  <span className="inline-flex rounded bg-[var(--a-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]">
                    {r.type}
                  </span>
                ),
              },
              {
                key: "method",
                header: "Method",
                render: (r) => <span className="text-xs text-[var(--a-fg-2)]">{r.channel}</span>,
              },
              {
                key: "amount",
                header: "Amount",
                render: (r) => (
                  <span className="a-mono text-xs font-bold text-[var(--a-fg)]">
                    {fmtMoney(r.amount)}
                  </span>
                ),
              },
              { key: "status", header: "Status", render: (r) => <StatusChip value={r.status} /> },
              {
                key: "at",
                header: "When",
                render: (r) => (
                  <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.createdAt)}</span>
                ),
              },
            ]}
          />
        </BentoCard>

        {/* Favourites */}
        {/* <BentoCard
          className="lg:col-span-4"
          eyebrow="Exhibition · Watchlist"
          title="Favourited works"
          delay={0.3}
          action={
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--a-accent-2)]">
              <Heart className="size-3" /> {favourites.length}
            </span>
          }
        >
          <ul className="grid grid-cols-2 gap-2">
            {favRows.slice(0, 6).map((f) => (
              <li key={f.slug}>
                <button
                  onClick={() => setTarget({ kind: "fav", row: f })}
                  className="block w-full overflow-hidden rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] text-left transition hover:border-[var(--a-border-hi)]"
                >
                  <img src={f.image} alt={f.title} className="aspect-square w-full object-cover" />
                  <div className="p-2">
                    <p className="truncate text-[10px] font-semibold text-[var(--a-fg)]">
                      {f.title}
                    </p>
                    <p className="a-mono text-[10px] text-[var(--a-accent)]">{fmtMoney(f.price)}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </BentoCard> */}

        {/* Admin notes */}
        {/* <BentoCard
          className="lg:col-span-12"
          eyebrow="Internal"
          title="Admin notes"
          delay={0.34}
          action={
            <button
              onClick={() => {
                const id = `n_${Date.now().toString(36)}`;

                const userNotes: UserNote = {
                  id,
                  at: new Date().toISOString(),
                  author: "",
                  body: "",
                };

                setTarget({ kind: "note", row: userNotes });
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
            >
              <FileText className="size-3" /> Add note
            </button>
          }
        >
          <ul className="space-y-2.5">
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => setTarget({ kind: "note", row: n })}
                  className="flex w-full items-start gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-3 text-left transition hover:border-[var(--a-border-hi)]"
                >
                  <span className="grid size-8 place-items-center rounded bg-[var(--a-accent-2-soft)] text-[10px] font-bold text-[var(--a-accent-2)]">
                    {n.author
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--a-fg)]">{n.author}</p>
                      <p className="text-[10px] text-[var(--a-faint)]">{fmtDateTime(n.at)}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--a-fg-2)]">
                      {n.body || "(empty — click to edit)"}
                    </p>
                  </div>
                  <span className="grid size-7 place-items-center rounded text-[var(--a-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-fg)]">
                    <MoreHorizontal className="size-3.5" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </BentoCard> */}
      </div>

      {/* -------- Record sheets -------- */}

      {target?.kind === "bid" && (
        <RecordSheet<Bid>
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Bid"
          title={target.row.lotTitle!}
          subtitle={`Lot ${target.row.lotTitle}`}
          record={target.row}
          fields={bidFields}
          onSave={async (patch) => {
            return;

            close();
          }}
          operations={[
            // {
            //   id: "mark-leading",
            //   label: "Mark leading",
            //   icon: Crown,
            //   tone: "primary",
            //   onRun: () => {
            //     return;
            //     setBids((prev) =>
            //       prev.map((b) => (b.id === target.row.id ? { ...b, status: "leading" } : b)),
            //     );
            //     close();
            //   },
            // },
            {
              id: "mark-won",
              label: "Mark won",
              icon: CheckCircle2,
              tone: "success",
              onRun: () => {
                return;
                setBids((prev) =>
                  prev.map((b) => (b.id === target.row.id ? { ...b, status: "won" } : b)),
                );
                close();
              },
            },
            // {
            //   id: "withdraw",
            //   label: "Withdraw bid",
            //   icon: XCircle,
            //   tone: "danger",
            //   confirm: "Withdraw this bid?",
            //   onRun: () => {
            //     return;
            //     setBids((prev) => prev.filter((b) => b.id !== target.row.id));
            //     close();
            //   },
            // },
          ]}
        />
      )}

      {/* {target?.kind === "order" && (
        <RecordSheet<UserOrder>
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Order"
          title={target.row.artworkTitle}
          subtitle={`Order ${target.row.id}`}
          record={target.row}
          fields={orderFields}
          extra={
            <div>
              <p className="a-eyebrow mb-2">Artwork</p>
              <img
                src={target.row.image}
                alt={target.row.artworkTitle}
                className="w-full rounded-md border border-[var(--a-border)] object-cover"
              />
            </div>
          }
          onSave={(patch) => {
            setOrders((prev) => prev.map((o) => (o.id === target.row.id ? { ...o, ...patch } : o)));
            close();
          }}
          operations={[
            {
              id: "ship",
              label: "Mark shipped",
              icon: Truck,
              tone: "primary",
              onRun: () => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === target.row.id ? { ...o, status: "shipped" } : o)),
                );
                close();
              },
            },
            {
              id: "deliver",
              label: "Mark delivered",
              icon: CheckCircle2,
              tone: "success",
              onRun: () => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === target.row.id ? { ...o, status: "delivered" } : o)),
                );
                close();
              },
            },
            {
              id: "refund",
              label: "Refund",
              icon: RotateCcw,
              tone: "danger",
              confirm: "Refund this order?",
              onRun: () => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === target.row.id ? { ...o, status: "refunded" } : o)),
                );
                close();
              },
            },
          ]}
        />
      )} */}

      {target?.kind === "tx" && (
        <RecordSheet<WalletTx>
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Wallet ledger"
          title={`${target.row.type.toUpperCase()} · ${fmtMoney(target.row.amount)}`}
          subtitle={`Tx ${target.row.id}`}
          record={target.row}
          fields={txFields}
          onSave={(patch) => {
            return;
            setTxs((prev) => prev.map((t) => (t.id === target.row.id ? { ...t, ...patch } : t)));
            close();
          }}
          operations={[
            {
              id: "approve",
              label: "Approve",
              icon: CheckCircle2,
              tone: "success",
              onRun: () => {
                return;
                setTxs((prev) =>
                  prev.map((t) => (t.id === target.row.id ? { ...t, status: "completed" } : t)),
                );
                close();
              },
            },
            {
              id: "review",
              label: "Put On Hold",
              icon: RefreshCw,
              onRun: () => {
                return;
                setTxs((prev) =>
                  prev.map((t) => (t.id === target.row.id ? { ...t, status: "review" } : t)),
                );
                close();
              },
            },
            {
              id: "fail",
              label: "Decline",
              icon: XCircle,
              tone: "danger",
              confirm: "Mark this transaction as failed?",
              onRun: () => {
                return;
                setTxs((prev) =>
                  prev.map((t) => (t.id === target.row.id ? { ...t, status: "failed" } : t)),
                );
                close();
              },
            },
          ]}
        />
      )}
      {target?.kind === "auction" && (
        <RecordSheet<AuctionLot>
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Auctioned ArtWork Details"
          title={`${target.row.title.toUpperCase()} · ${target.row.sellerSlug}`}
          subtitle={` ${target.row.category}`}
          record={target.row}
          fields={auctionFields}
          onSave={(patch) => {
            return;
            setTxs((prev) => prev.map((t) => (t.id === target.row.id ? { ...t, ...patch } : t)));
            close();
          }}
          extra={
            target.row.images.length && (
              <AuctionImageSwiper images={target.row.images} alt={currentUser.fullName} />
            )
          }
          operations={[
            {
              id: "active",
              label: "Approve",
              icon: CheckCircle2,
              tone: "success",
              onRun: () => {
                return;
                setTxs((prev) =>
                  prev.map((t) => (t.id === target.row.id ? { ...t, status: "completed" } : t)),
                );
                close();
              },
            },
            {
              id: "suspend",
              label: "Suspend",
              tone: "danger",
              icon: RefreshCw,
              onRun: () => {
                return;
                setTxs((prev) =>
                  prev.map((t) => (t.id === target.row.id ? { ...t, status: "review" } : t)),
                );
                close();
              },
            },
            // {
            //   id: "fail",
            //   label: "Decline",
            //   icon: XCircle,
            //   tone: "danger",
            //   confirm: "Mark this transaction as failed?",
            //   onRun: () => {
            //     return;
            //     setTxs((prev) =>
            //       prev.map((t) => (t.id === target.row.id ? { ...t, status: "failed" } : t)),
            //     );
            //     close();
            //   },
            // },
          ]}
        />
      )}

      {/* {target?.kind === "fav" && (
        <RecordSheet
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Watchlist"
          title={target.row.title}
          subtitle={target.row.artist}
          record={target.row}
          fields={favFields}
          extra={
            <div>
              <p className="a-eyebrow mb-2">Preview</p>
              <img
                src={target.row.image}
                alt={target.row.title}
                className="w-full rounded-md border border-[var(--a-border)] object-cover"
              />
            </div>
          }
          onSave={(patch) => {
            setFavourites((prev) =>
              prev.map((f) => (f.slug === target.row.slug ? { ...f, ...patch } : f)),
            );
            close();
          }}
          operations={[
            {
              id: "remove",
              label: "Remove from watchlist",
              icon: Trash2,
              tone: "danger",
              confirm: "Remove this artwork from the user's watchlist?",
              onRun: () => {
                setFavourites((prev) => prev.filter((f) => f.slug !== target.row.slug));
                close();
              },
            },
          ]}
        />
      )} */}

      {/* {target?.kind === "note" && (
        <RecordSheet<UserNote>
          open
          onOpenChange={(o) => !o && close()}
          eyebrow="Admin note"
          title={target.row.author}
          subtitle={fmtDateTime(target.row.at)}
          record={target.row}
          fields={noteFields}
          onSave={(patch) => {
            setNotes((prev) => prev.map((n) => (n.id === target.row.id ? { ...n, ...patch } : n)));
            close();
          }}
          operations={[
            {
              id: "delete",
              label: "Delete note",
              icon: Trash2,
              tone: "danger",
              confirm: "Delete this note?",
              onRun: () => {
                setNotes((prev) => prev.filter((n) => n.id !== target.row.id));
                close();
              },
            },
          ]}
        />
      )} */}
    </div>
  );
}

/* ------------- Field definitions ------------- */

const bidFields: FieldDef<Bid>[] = [
  { key: "id", label: "Bid ID", kind: "readonly" },
  { key: "lotTitle", label: "Lot title", editable: true },
  { key: "bidAmount", label: "Bid amount", kind: "money", editable: true },
  // {
  //   key: "status",
  //   label: "Status",
  //   kind: "select",
  //   editable: true,
  //   options: [
  //     { value: "leading", label: "Leading" },
  //     { value: "outbid", label: "Outbid" },
  //     { value: "won", label: "Won" },
  //     { value: "lost", label: "Lost" },
  //   ],
  // },
  { key: "placedAt", label: "Placed at", kind: "readonly", render: (v) => fmtDateTime(String(v)) },
];

const orderFields: FieldDef<UserOrder>[] = [
  { key: "id", label: "Order ID", kind: "readonly" },
  { key: "artworkTitle", label: "Artwork", editable: true },
  { key: "artworkSlug", label: "Slug", kind: "readonly" },
  { key: "amount", label: "Amount", kind: "money", editable: true },
  {
    key: "status",
    label: "Status",
    kind: "select",
    editable: true,
    options: [
      { value: "processing", label: "Processing" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "refunded", label: "Refunded" },
    ],
  },
  { key: "at", label: "Placed at", kind: "readonly", render: (v) => fmtDateTime(String(v)) },
];

const txFields: FieldDef<WalletTx>[] = [
  // { key: "id", label: "Tx ID", kind: "readonly" },
  { key: "fullName", label: "FullName", kind: "readonly" },
  { key: "email", label: "Email", kind: "readonly" },
  {
    key: "type",
    label: "Type",
    kind: "select",
    editable: false,
    options: [
      { value: "deposit", label: "Deposit" },
      { value: "withdraw", label: "Withdraw" },
      { value: "transfer", label: "Transfer" },
      { value: "purchase", label: "Purchase" },
      { value: "sale", label: "Sale" },
    ],
  },
  { key: "channel", label: "Method", editable: false },
  { key: "amount", label: "Amount", kind: "money", editable: true },
  {
    key: "status",
    label: "Status",
    kind: "select",
    editable: true,
    options: [
      { value: "Approved", label: "Approved" },
      { value: "Pending", label: "Pending" },
      { value: "Failed", label: "Failed" },
      { value: "On Hold", label: "On Hold" },
    ],
  },
  { key: "createdAt", label: "Created", kind: "readonly", render: (v) => fmtDateTime(String(v)) },
];
const auctionFields: FieldDef<AuctionLot>[] = [
  { key: "title", label: "Lot title", span: 2 },
  // { key: "lotNumber", label: "Lot #" },
  { key: "categoryLabel", label: "Category" },
  { key: "medium", label: "Medium" },
  { key: "dimensions", label: "Dimensions" },
  { key: "year", label: "Year", kind: "number" },
  { key: "estimateLow", label: "Estimate low", kind: "money" },
  { key: "estimateHigh", label: "Estimate high", kind: "money" },
  { key: "currentBid", label: "Current bid", kind: "money" },
  { key: "startBid", label: "Start bid", kind: "money" },
  { key: "condition", label: "Condition" },
  { key: "provenance", label: "Provenance", kind: "textarea" },
  { key: "description", label: "Description", kind: "textarea", span: 2 },
  // {
  //   key: "status",
  //   label: "Status",
  //   kind: "select",
  //   render(value, row) {
  //     return (
  //       <>
  //         <span className="capitalize">{value as string}</span>
  //       </>
  //     );
  //   },
  //   options: [
  //     {
  //       label: "Active",
  //       value: "active",
  //     },
  //     {
  //       label: "Pending",
  //       value: "pending",
  //     },
  //     {
  //       label: "Suspended",
  //       value: "suspended",
  //     },
  //   ],
  // },
];

const favFields: FieldDef<UserFavourite & { id: string }>[] = [
  { key: "slug", label: "Slug", kind: "readonly" },
  { key: "title", label: "Title", editable: true },
  { key: "artist", label: "Artist", editable: true },
  { key: "price", label: "Listed price", kind: "money", editable: true },
];

const noteFields: FieldDef<UserNote>[] = [
  { key: "id", label: "Note ID", kind: "readonly" },
  { key: "author", label: "Author", editable: true },
  { key: "at", label: "Created", kind: "readonly", render: (v) => fmtDateTime(String(v)) },
  { key: "body", label: "Body", kind: "textarea", editable: true, span: 2 },
];

function WalletStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`a-card-elev p-4 ${accent ? "ring-1 ring-[var(--a-accent)]/40" : ""}`}>
      <p className="a-eyebrow">{label}</p>
      <p
        className={`font-display mt-1.5 text-2xl font-extrabold tracking-tight ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-fg)]"}`}
      >
        {value}
      </p>
    </div>
  );
}

function SecRow({
  icon: Icon,
  label,
  value,
  good,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  good?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5">
      <span className="inline-flex items-center gap-2 text-[var(--a-muted)]">
        <Icon className="size-3.5" />
        <span className="font-semibold text-[var(--a-fg-2)]">{label}</span>
      </span>
      <span
        className={`a-mono text-xs font-bold ${good ? "text-[var(--a-pos)]" : "text-[var(--a-fg)]"}`}
      >
        {value}
      </span>
    </li>
  );
}

export default UserDetail;
