import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import {
  DataTable,
  SectionHeader,
  StatusChip,
  TabBar,
  BentoCard,
} from "@/components/admin/primitives";
import { adminTxs, adminUsers, fmtDateTime, fmtMoney } from "@/data/admin-mock";

export const Route = createFileRoute("/admin/wallet")({
  component: WalletOps,
});

type Tab = "transactions" | "accounts" | "deposits" | "withdrawals";

function WalletOps() {
  const [tab, setTab] = useState<Tab>("transactions");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const totals = useMemo(() => {
    const dep = adminTxs.filter((t) => t.type === "deposit").reduce((s, t) => s + t.amount, 0);
    const wd  = adminTxs.filter((t) => t.type === "withdraw").reduce((s, t) => s + t.amount, 0);
    const vol = adminTxs.reduce((s, t) => s + t.amount, 0);
    return { dep, wd, vol };
  }, []);

  const rows = useMemo(() => {
    const ql = q.toLowerCase();
    return adminTxs
      .filter((t) => (tab === "deposits" ? t.type === "deposit" : tab === "withdrawals" ? t.type === "withdraw" : true))
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter((t) => !q || t.user.toLowerCase().includes(ql) || t.id.includes(ql) || t.email.includes(ql));
  }, [tab, q, status]);

  return (
    <div className="mx-auto max-w-[1440px]">
      <SectionHeader
        title="Wallet ops"
        description="Inspect transactions, manage accounts, approve pending payouts."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
            <Download className="size-3.5" /> Export CSV
          </button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BentoCard eyebrow="Inflow · 30d" title={fmtMoney(totals.dep)} delay={0}>
          <p className="text-xs text-[var(--a-muted)]">Total deposits this period.</p>
        </BentoCard>
        <BentoCard eyebrow="Outflow · 30d" title={fmtMoney(totals.wd)} delay={0.05}>
          <p className="text-xs text-[var(--a-muted)]">Total withdrawals processed.</p>
        </BentoCard>
        <BentoCard eyebrow="Volume · 30d" title={fmtMoney(totals.vol)} delay={0.1}>
          <p className="text-xs text-[var(--a-muted)]">All transaction types combined.</p>
        </BentoCard>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabBar
          tabs={[
            { id: "transactions", label: "Transactions", count: adminTxs.length },
            { id: "accounts", label: "Accounts", count: adminUsers.length },
            { id: "deposits", label: "Deposits" },
            { id: "withdrawals", label: "Withdrawals" },
          ]}
          active={tab}
          onChange={(id) => setTab(id as Tab)}
        />
        <div className="flex items-center gap-2">
          {tab !== "accounts" && (
            <div className="flex rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-0.5">
              {["all", "completed", "pending", "review", "failed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                    status === s ? "bg-[var(--a-bg-2)] text-[var(--a-fg)]" : "text-[var(--a-muted)] hover:text-[var(--a-fg)]"
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
              className="h-9 w-56 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]"
            />
          </div>
        </div>
      </div>

      {tab === "accounts" ? (
        <DataTable
          rows={adminUsers.filter((u) => !q || u.name.toLowerCase().includes(q.toLowerCase())).map((u) => ({ ...u }))}
          columns={[
            { key: "name", header: "Account", render: (r) => (
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-md text-[11px] font-bold text-[var(--a-accent-ink)]" style={{ background: r.avatar }}>
                  {r.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <div>
                  <p className="text-xs font-semibold text-[var(--a-fg)]">{r.name}</p>
                  <p className="text-[10px] text-[var(--a-muted)]">{r.email}</p>
                </div>
              </div>
            ) },
            { key: "balance", header: "Balance", render: (r) => <span className="a-mono text-xs font-bold text-[var(--a-fg)]">{fmtMoney(r.balance)}</span> },
            { key: "status", header: "Status", render: (r) => <StatusChip value={r.status} /> },
            { key: "joined", header: "Joined", render: (r) => <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.joined)}</span> },
          ]}
        />
      ) : (
        <DataTable
          rows={rows}
          columns={[
            { key: "id", header: "Tx ID", render: (r) => <span className="a-mono text-xs text-[var(--a-muted)]">{r.id}</span> },
            { key: "user", header: "User", render: (r) => (
              <div>
                <p className="text-xs font-semibold text-[var(--a-fg)]">{r.user}</p>
                <p className="text-[10px] text-[var(--a-muted)]">{r.email}</p>
              </div>
            ) },
            { key: "type", header: "Type", render: (r) => <span className="inline-flex rounded bg-[var(--a-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]">{r.type}</span> },
            { key: "method", header: "Method", render: (r) => <span className="text-xs text-[var(--a-fg-2)]">{r.method}</span> },
            { key: "amount", header: "Amount", render: (r) => <span className="a-mono text-xs font-bold text-[var(--a-fg)]">{fmtMoney(r.amount)}</span> },
            { key: "status", header: "Status", render: (r) => <StatusChip value={r.status} /> },
            { key: "date", header: "When", render: (r) => <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.createdAt)}</span> },
          ]}
        />
      )}
    </div>
  );
}
