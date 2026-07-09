import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Flag,
  RotateCcw,
  Ban,
  ShieldCheck,
  Mail,
  KeyRound,
  Wallet as WalletIcon,
  ArrowUpRight,
} from "lucide-react";
import {
  DataTable,
  SectionHeader,
  StatusChip,
  TabBar,
  BentoCard,
} from "@/components/admin/primitives";
import { RecordSheet, type FieldDef } from "@/components/admin/RecordSheet";
import {
  adminTxs as seedTxs,
  adminUsers as seedAccounts,
  fmtDateTime,
  fmtMoney,
  type AdminTx,
  type AdminUser,
} from "@/data/admin-mock";

export const Route = createFileRoute("/admin/wallet")({
  component: WalletOps,
});

type Tab = "transactions" | "accounts" | "deposits" | "withdrawals";

function WalletOps() {
  const [tab, setTab] = useState<Tab>("transactions");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const [txs, setTxs] = useState<AdminTx[]>(seedTxs);
  const [accounts, setAccounts] = useState<AdminUser[]>(seedAccounts);

  const [selectedTx, setSelectedTx] = useState<AdminTx | null>(null);
  const [selectedAcc, setSelectedAcc] = useState<AdminUser | null>(null);

  const totals = useMemo(() => {
    const dep = txs.filter((t) => t.type === "deposit").reduce((s, t) => s + t.amount, 0);
    const wd = txs.filter((t) => t.type === "withdraw").reduce((s, t) => s + t.amount, 0);
    const vol = txs.reduce((s, t) => s + t.amount, 0);
    const pending = txs.filter((t) => t.status === "pending").length;
    return { dep, wd, vol, pending };
  }, [txs]);

  const txRows = useMemo(() => {
    const ql = q.toLowerCase();
    return txs
      .filter((t) =>
        tab === "deposits"
          ? t.type === "deposit"
          : tab === "withdrawals"
            ? t.type === "withdraw"
            : true,
      )
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter(
        (t) => !q || t.user.toLowerCase().includes(ql) || t.id.includes(ql) || t.email.includes(ql),
      );
  }, [tab, q, status, txs]);

  const accRows = useMemo(
    () =>
      accounts.filter(
        (u) =>
          !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q.toLowerCase()),
      ),
    [accounts, q],
  );

  function patchTx(id: string, p: Partial<AdminTx>) {
    setTxs((prev) => prev.map((t) => (t.id === id ? { ...t, ...p } : t)));
    setSelectedTx((cur) => (cur && cur.id === id ? { ...cur, ...p } : cur));
  }
  function patchAcc(id: string, p: Partial<AdminUser>) {
    setAccounts((prev) => prev.map((u) => (u.id === id ? { ...u, ...p } : u)));
    setSelectedAcc((cur) => (cur && cur.id === id ? { ...cur, ...p } : cur));
  }

  const txFields: FieldDef<AdminTx>[] = [
    { key: "id", label: "Transaction ID", editable: false },
    { key: "user", label: "User", editable: false },
    { key: "email", label: "Email", editable: false },
    {
      key: "type",
      label: "Type",
      kind: "select",
      options: ["deposit", "withdraw", "transfer", "purchase", "sale"].map((v) => ({
        value: v,
        label: v,
      })),
    },
    { key: "amount", label: "Amount", kind: "money" },
    { key: "method", label: "Method" },
    {
      key: "status",
      label: "Status",
      kind: "select",
      options: ["completed", "pending", "failed", "review"].map((v) => ({ value: v, label: v })),
    },
    {
      key: "createdAt",
      label: "Created",
      editable: false,
      render: (v) => fmtDateTime(v as string),
    },
  ];

  const accFields: FieldDef<AdminUser>[] = [
    { key: "name", label: "Name", span: 2 },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      kind: "select",
      options: ["user", "moderator", "admin"].map((v) => ({ value: v, label: v })),
    },
    {
      key: "status",
      label: "Status",
      kind: "select",
      options: ["active", "pending", "suspended"].map((v) => ({ value: v, label: v })),
    },
    { key: "balance", label: "Wallet balance", kind: "money" },
    { key: "id", label: "Account ID", editable: false },
    { key: "joined", label: "Joined", editable: false, render: (v) => fmtDateTime(v as string) },
    {
      key: "lastSeen",
      label: "Last seen",
      editable: false,
      render: (v) => fmtDateTime(v as string),
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px]">
      <SectionHeader
        title="Wallet ops"
        description="Inspect transactions, manage accounts, approve pending payouts. Click any row to view, edit and run operations."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
            <Download className="size-3.5" /> Export CSV
          </button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <BentoCard eyebrow="Inflow · 30d" title={fmtMoney(totals.dep)} delay={0}>
          <p className="text-xs text-[var(--a-muted)]">Total deposits.</p>
        </BentoCard>
        <BentoCard eyebrow="Outflow · 30d" title={fmtMoney(totals.wd)} delay={0.05}>
          <p className="text-xs text-[var(--a-muted)]">Withdrawals processed.</p>
        </BentoCard>
        <BentoCard eyebrow="Volume · 30d" title={fmtMoney(totals.vol)} delay={0.1}>
          <p className="text-xs text-[var(--a-muted)]">All transactions combined.</p>
        </BentoCard>
        <BentoCard eyebrow="Queue" title={`${totals.pending}`} delay={0.15}>
          <p className="text-xs text-[var(--a-muted)]">Pending review.</p>
        </BentoCard>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabBar
          tabs={[
            { id: "transactions", label: "Transactions", count: txs.length },
            { id: "accounts", label: "Accounts", count: accounts.length },
            { id: "deposits", label: "Deposits" },
            { id: "withdrawals", label: "Withdrawals" },
          ]}
          active={tab}
          onChange={(id) => setTab(id as Tab)}
        />
        <div className="flex items-center gap-2 flex-wrap">
          {tab !== "accounts" && (
            <div className="flex rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-0.5">
              {["all", "completed", "pending", "review", "failed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                    status === s
                      ? "bg-[var(--a-accent-2)] text-[var(--a-fg)]"
                      : "text-[var(--a-muted)] hover:text-[var(--a-fg)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--a-faint)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="h-9 md:w-56 my-1 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]"
            />
          </div>
        </div>
      </div>

      {tab === "accounts" ? (
        <DataTable
          rows={accRows}
          onRowClick={(r) => setSelectedAcc(r)}
          columns={[
            {
              key: "name",
              header: "Account",
              render: (r) => (
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid size-8 place-items-center rounded-md text-[11px] font-bold text-[var(--a-accent-ink)]"
                    style={{ background: r.avatar }}
                  >
                    {r.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--a-fg)]">{r.name}</p>
                    <p className="text-[10px] text-[var(--a-muted)]">{r.email}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "balance",
              header: "Balance",
              render: (r) => (
                <span className="a-mono text-xs font-bold text-[var(--a-fg)]">
                  {fmtMoney(r.balance)}
                </span>
              ),
            },
            {
              key: "role",
              header: "Role",
              render: (r) => (
                <span className="text-xs text-[var(--a-fg-2)] capitalize">{r.role}</span>
              ),
            },
            { key: "status", header: "Status", render: (r) => <StatusChip value={r.status} /> },
            {
              key: "joined",
              header: "Joined",
              render: (r) => (
                <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.joined)}</span>
              ),
            },
          ]}
        />
      ) : (
        <DataTable
          rows={txRows}
          onRowClick={(r) => setSelectedTx(r)}
          columns={[
            {
              key: "id",
              header: "Tx ID",
              render: (r) => <span className="a-mono text-xs text-[var(--a-muted)]">{r.id}</span>,
            },
            {
              key: "user",
              header: "User",
              render: (r) => (
                <div>
                  <p className="text-xs font-semibold text-[var(--a-fg)]">{r.user}</p>
                  <p className="text-[10px] text-[var(--a-muted)]">{r.email}</p>
                </div>
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
              render: (r) => <span className="text-xs text-[var(--a-fg-2)]">{r.method}</span>,
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
              key: "date",
              header: "When",
              render: (r) => (
                <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.createdAt)}</span>
              ),
            },
          ]}
        />
      )}

      {/* Transaction sheet */}
      <RecordSheet<AdminTx>
        open={!!selectedTx}
        onOpenChange={(o) => !o && setSelectedTx(null)}
        eyebrow={selectedTx?.type.toUpperCase()}
        title={selectedTx ? `${fmtMoney(selectedTx.amount)} · ${selectedTx.user}` : ""}
        subtitle={selectedTx?.id}
        record={selectedTx}
        fields={txFields}
        onSave={(p) => selectedTx && patchTx(selectedTx.id, p)}
        extra={
          selectedTx && (
            <div>
              <p className="a-eyebrow mb-2">Ledger entry</p>
              <ul className="space-y-2 text-xs text-[var(--a-fg-2)]">
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Channel</span>
                  <span className="a-mono">{selectedTx.method}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Fee est.</span>
                  <span className="a-mono">{fmtMoney(Math.round(selectedTx.amount * 0.012))}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Net</span>
                  <span className="a-mono">{fmtMoney(Math.round(selectedTx.amount * 0.988))}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Date</span>
                  <span className="a-mono">{fmtDateTime(selectedTx.createdAt)}</span>
                </li>
              </ul>
            </div>
          )
        }
        operations={
          selectedTx
            ? [
                {
                  id: "approve",
                  label: "Approve",
                  icon: CheckCircle2,
                  tone: "success",
                  onRun: () => patchTx(selectedTx.id, { status: "completed" }),
                },
                {
                  id: "reject",
                  label: "Reject",
                  icon: XCircle,
                  tone: "danger",
                  confirm: "Reject this transaction?",
                  onRun: () => patchTx(selectedTx.id, { status: "failed" }),
                },
                {
                  id: "hold",
                  label: "Send to review",
                  icon: Flag,
                  onRun: () => patchTx(selectedTx.id, { status: "review" }),
                },
                ...(selectedTx.type === "withdraw"
                  ? [
                      {
                        id: "release",
                        label: "Release payout",
                        icon: ArrowUpRight,
                        tone: "primary" as const,
                        onRun: () => patchTx(selectedTx.id, { status: "completed" }),
                      },
                    ]
                  : []),
                ...(selectedTx.status === "completed"
                  ? [
                      {
                        id: "refund",
                        label: "Issue refund",
                        icon: RotateCcw,
                        tone: "danger" as const,
                        confirm: "Refund this transaction?",
                        onRun: () => alert(`Refunded ${fmtMoney(selectedTx.amount)} (mock).`),
                      },
                    ]
                  : []),
              ]
            : undefined
        }
      />

      {/* Account sheet */}
      <RecordSheet<AdminUser>
        open={!!selectedAcc}
        onOpenChange={(o) => !o && setSelectedAcc(null)}
        eyebrow="Wallet account"
        title={selectedAcc?.name ?? ""}
        subtitle={selectedAcc?.email}
        record={selectedAcc}
        fields={accFields}
        onSave={(p) => selectedAcc && patchAcc(selectedAcc.id, p)}
        extra={
          selectedAcc && (
            <div>
              <p className="a-eyebrow mb-2">Balance</p>
              <p className="font-display text-3xl font-extrabold text-[var(--a-accent)]">
                {fmtMoney(selectedAcc.balance)}
              </p>
              <p className="mt-1 text-[10px] text-[var(--a-muted)]">Spendable</p>
              <ul className="mt-4 space-y-2 text-xs">
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Tx count</span>
                  <span className="a-mono text-[var(--a-fg-2)]">
                    {txs.filter((t) => t.email === selectedAcc.email).length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Last seen</span>
                  <span className="a-mono text-[var(--a-fg-2)]">
                    {fmtDateTime(selectedAcc.lastSeen)}
                  </span>
                </li>
              </ul>
            </div>
          )
        }
        operations={
          selectedAcc
            ? [
                {
                  id: "verify",
                  label: "Mark verified",
                  icon: ShieldCheck,
                  tone: "success",
                  onRun: () => patchAcc(selectedAcc.id, { status: "active" }),
                },
                {
                  id: "suspend",
                  label: "Suspend account",
                  icon: Ban,
                  tone: "danger",
                  confirm: `Suspend ${selectedAcc.name}?`,
                  onRun: () => patchAcc(selectedAcc.id, { status: "suspended" }),
                },
                {
                  id: "credit",
                  label: "Credit $100",
                  icon: WalletIcon,
                  onRun: () => patchAcc(selectedAcc.id, { balance: selectedAcc.balance + 100 }),
                },
                {
                  id: "debit",
                  label: "Debit $100",
                  icon: WalletIcon,
                  tone: "danger",
                  onRun: () =>
                    patchAcc(selectedAcc.id, { balance: Math.max(0, selectedAcc.balance - 100) }),
                },
                {
                  id: "reset",
                  label: "Force password reset",
                  icon: KeyRound,
                  onRun: () => alert(`Reset email sent to ${selectedAcc.email} (mock).`),
                },
                {
                  id: "message",
                  label: "Message user",
                  icon: Mail,
                  onRun: () => alert(`Opened message thread with ${selectedAcc.name} (mock).`),
                },
              ]
            : undefined
        }
      />
    </div>
  );
}
