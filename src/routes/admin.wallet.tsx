import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  adminUsers as seedAdminUsers,
  fmtDateTime,
  fmtMoney,
  type AdminTx,
} from "@/data/admin-mock";
import { WalletAccount, WalletTx } from "@/types";
import { useDataStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import { useToast } from "@/lib/useToast";
import useDoc from "@/hooks/useDoc";
import { ToastPosition } from "@/components/ui/toast";
import { AdminLoader } from "@/components/admin/AdminLoader";

export const Route = createFileRoute("/admin/wallet")({
  component: WalletOps,
});

type Tab =
  | "transactions"
  | "accounts"
  | "deposits"
  | "withdrawals"
  | "transfer_in"
  | "transfer_out";

function WalletOps() {
  // Note: accounts tab uses local mapped state derived from admin-mock for now.
  // Real implementation should source from Firestore via zustand / queries.

  const { users, transactions } = useDataStore(
    useShallow((s) => ({
      users: s.users,
      transactions: s.transactions,
    })),
  );

  const [tab, setTab] = useState<Tab>("transactions");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const [selectedTx, setSelectedTx] = useState<WalletTx | null>(null);
  const [selectedAcc, setSelectedAcc] = useState<WalletAccount | null>(null);

  // Full-screen action loader (for any useDoc call)
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("Processing...");

  // Page readiness loader (initial dashboard hydration)
  const [pageLoading, setPageLoading] = useState(true);

  // Hide page loader once store has data
  useEffect(() => {
    if (users.length > 0 || transactions.length > 0) {
      setPageLoading(false);
    }
  }, [users.length, transactions.length]);

  const totals = useMemo(() => {
    const dep = transactions
      .filter((t) => t.type === "deposit" && t.status === "Approved")
      .reduce((s, t) => s + t.amount, 0);
    const wd = transactions
      .filter((t) => t.type === "withdraw" && t.status == "Approved")
      .reduce((s, t) => s + t.amount, 0);
    const vol = transactions
      .filter((t) => t.status == "Approved")
      .reduce((s, t) => s + t.amount, 0);
    const pending = transactions.filter((t) => t.status === "Pending").length;
    return { dep, wd, vol, pending };
  }, [transactions]);

  const txRows = useMemo(() => {
    const ql = q.toLowerCase();
    return transactions
      .filter((t) =>
        tab === "deposits"
          ? t.type === "deposit"
          : tab === "withdrawals"
            ? t.type === "withdraw"
            : tab === "transfer_in"
              ? t.type === "transfer_in"
              : tab == "transfer_out"
                ? t.type == "transfer_out"
                : true,
      )
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter(
        (t) =>
          !q || t.fullName.toLowerCase().includes(ql) || t.id.includes(ql) || t.email.includes(ql),
      );
  }, [tab, q, status, transactions]);

  const accRows = useMemo(
    () =>
      users.filter(
        (u) =>
          !q ||
          u.fullName.toLowerCase().includes(q.toLowerCase()) ||
          u.email.includes(q.toLowerCase()),
      ),
    [users, q],
  );

  const { toast } = useToast();
  const { updateDocument } = useDoc();

  // Helper to start/stop the elegant full-screen admin loader
  const startAction = (msg: string) => {
    setActionMessage(msg);
    setActionLoading(true);
  };
  const stopAction = () => setActionLoading(false);

  // Simple readiness: hide page loader once we have data
  // (Replace with real isAuthHydrated / store hydration flag when available)

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

  const txFields: FieldDef<WalletTx>[] = [
    // { key: "id", label: "Transaction ID", editable: false },
    { key: "fullName", label: "FullName", editable: false },
    { key: "email", label: "Email", editable: false },
    {
      key: "type",
      label: "Type",
      kind: "select",
      editable: false,
      options: ["deposit", "withdraw", "transfer", "purchase", "sale"].map((v) => ({
        value: v,
        label: v,
      })),
    },
    { key: "amount", label: "Amount", kind: "money" },
    { key: "channel", label: "Method", editable: false },
    // {
    //   key: "status",
    //   label: "Status",
    //   kind: "select",
    //   options: ["completed", "pending", "failed", "review"].map((v) => ({ value: v, label: v })),
    // },
    {
      key: "createdAt",
      label: "Created",
      editable: false,
      render: (v) => fmtDateTime(v as string),
    },
  ];

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

  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminLoader
        fullscreen
        variant="page"
        isLoading={pageLoading}
        message="Loading wallet ops"
        subMessage="Syncing transactions & accounts"
      />

      <AdminLoader fullscreen variant="action" isLoading={actionLoading} message={actionMessage} />

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
        <BentoCard eyebrow="Inflow" title={fmtMoney(totals.dep)} delay={0}>
          <p className="text-xs text-[var(--a-muted)]">Total Approved deposits.</p>
        </BentoCard>
        <BentoCard eyebrow="Outflow" title={fmtMoney(totals.wd)} delay={0.05}>
          <p className="text-xs text-[var(--a-muted)]">All Approved Withdrawals.</p>
        </BentoCard>
        <BentoCard eyebrow="Volume" title={fmtMoney(totals.vol)} delay={0.1}>
          <p className="text-xs text-[var(--a-muted)]">All Approved transactions combined.</p>
        </BentoCard>
        <BentoCard eyebrow="Queue" title={`${totals.pending}`} delay={0.15}>
          <p className="text-xs text-[var(--a-muted)]">Pending review.</p>
        </BentoCard>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabBar
          tabs={[
            { id: "transactions", label: "Transactions", count: transactions.length },
            // { id: "accounts", label: "Accounts", count: users.length },
            { id: "deposits", label: "Deposits" },
            { id: "withdrawals", label: "Withdrawals" },
            { id: "transfer_in", label: "Transfers (Received)" },
            { id: "transfer_out", label: "Transfers (Sent)" },
          ]}
          active={tab}
          onChange={(id) => setTab(id as Tab)}
        />
        <div className="flex items-center gap-2 flex-wrap">
          {tab !== "accounts" && (
            <div className="flex rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-0.5">
              {["all", "Approved", "Pending", "On Hold", "Failed"].map((s) => (
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
              key: "fullName",
              header: "Account",
              render: (r) => (
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid size-8 place-items-center rounded-md text-[11px] font-bold text-[var(--a-accent-ink)]"
                    style={{ background: "orange" }}
                  >
                    {r.fullName
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--a-fg)]">{r.fullName}</p>
                    <p className="text-[10px] text-[var(--a-muted)]">{r.email}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "wallet.balance",
              header: "Balance",
              render: (r) => (
                <span className="a-mono text-xs font-bold text-[var(--a-fg)]">
                  {fmtMoney(r.wallet.balance)}
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
              key: "joinedDate",
              header: "Joined",
              render: (r) => (
                <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(r.joinedDate)}</span>
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
              key: "fullName",
              header: "fullname",
              render: (r) => (
                <span className="a-mono text-xs text-[var(--a-muted)]">{r.fullName}</span>
              ),
            },
            {
              key: "email",
              header: "email",
              render: (r) => (
                <div>
                  {/* <p className="text-xs font-semibold text-[var(--a-fg)]">{r.user}</p> */}
                  <p className="text-[12px] text-[var(--a-muted)]">{r.email}</p>
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
              render: (r) => (
                <span className="text-xs text-[var(--a-fg-2)] capitalize">{r.channel}</span>
              ),
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
      <RecordSheet<WalletTx>
        open={!!selectedTx}
        onOpenChange={(o) => !o && setSelectedTx(null)}
        eyebrow={selectedTx?.type.toUpperCase()}
        title={selectedTx ? `${fmtMoney(selectedTx.amount)} · ${selectedTx.fullName}` : ""}
        subtitle={selectedTx?.id}
        record={selectedTx}
        fields={txFields}
        onSave={async (p) => {
          if (!selectedTx) {
            toast({
              title: "Error",
              description: "Error in Selection",
              variant: "warning",
            });
            return;
          }
          startAction("Updating transaction...");
          try {
            await updateDocument({
              collections: "transactions",
              document: {
                ...selectedTx,
                ...p,
              },
            });

            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            setSelectedTx(null);
            stopAction();
          }
        }}
        extra={
          selectedTx && (
            <div>
              <p className="a-eyebrow mb-2">Transaction Details</p>
              <ul className="space-y-2 text-xs text-[var(--a-fg-2)]">
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Channel</span>
                  <span className="a-mono capitalize">{selectedTx.channel}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Type</span>
                  <span className="a-mono capitalize">{selectedTx.type}</span>
                </li>
                {/* <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Fee est.</span>
                  <span className="a-mono">{fmtMoney(Math.round(selectedTx.amount * 0.012))}</span>
                </li> */}
                {/* <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Net</span>
                  <span className="a-mono">{fmtMoney(Math.round(selectedTx.amount * 0.988))}</span>
                </li> */}
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Date</span>
                  <span className="a-mono">{fmtDateTime(selectedTx.createdAt)}</span>
                </li>
                {selectedTx.type == "deposit" && (
                  <li className="border-[var(--a-muted)]/20 border p-3 grid place-items-center">
                    <img src={selectedTx.details?.proof ?? ""} className="aspect-auto" />
                  </li>
                )}
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
                  onRun: async () => {
                    if (!selectedTx) {
                      warnToast();
                      return;
                    }
                    startAction("Approving transaction...");
                    try {
                      await updateDocument({
                        collections: "transactions",
                        document: {
                          status: "Approved",
                          id: selectedTx.id,
                        },
                      });
                      modToast();
                    } catch (error) {
                      errorToast(error);
                    } finally {
                      setSelectedTx(null);
                      stopAction();
                    }
                  },
                },
                {
                  id: "decline",
                  label: "Decline",
                  icon: XCircle,
                  tone: "danger",
                  onRun: async () => {
                    if (!selectedTx) {
                      warnToast();
                      return;
                    }
                    startAction("Declining transaction...");
                    try {
                      await updateDocument({
                        collections: "transactions",
                        document: {
                          status: "Failed",
                          id: selectedTx.id,
                        },
                      });
                      modToast();
                    } catch (error) {
                      errorToast(error);
                    } finally {
                      setSelectedTx(null);
                      stopAction();
                    }
                  },
                },
                // {
                //   id: "hold",
                //   label: "Send to review",
                //   icon: Flag,
                //   onRun: () => patchTx(selectedTx.id, { status: "review" }),
                // },
                // ...(selectedTx.type === "withdraw"
                //   ? [
                //       {
                //         id: "release",
                //         label: "Release payout",
                //         icon: ArrowUpRight,
                //         tone: "primary" as const,
                //         onRun: () => patchTx(selectedTx.id, { status: "completed" }),
                //       },
                //     ]
                //   : []),
                // ...(selectedTx.status === "Approved"
                //   ? [
                //       {
                //         id: "refund",
                //         label: "Issue refund",
                //         icon: RotateCcw,
                //         tone: "danger" as const,
                //         confirm: "Refund this transaction?",
                //         onRun: () => alert(`Refunded ${fmtMoney(selectedTx.amount)} (mock).`),
                //       },
                //     ]
                //   : []),
              ]
            : undefined
        }
      />

      {/* Account sheet */}
      <RecordSheet<WalletAccount>
        open={!!selectedAcc}
        onOpenChange={(o) => !o && setSelectedAcc(null)}
        eyebrow="Wallet account"
        title={selectedAcc?.fullName ?? ""}
        subtitle={selectedAcc?.email}
        record={selectedAcc}
        fields={accFields}
        onSave={async (p) => {
          if (!selectedAcc) {
            toast({
              title: "Error",
              description: "Error in Selection",
              variant: "warning",
            });
            return;
          }

          startAction("Saving account...");
          try {
            await updateDocument({
              collections: "users",
              document: {
                ...selectedAcc,
                ...p,
              },
            });

            modToast();
          } catch (error) {
            errorToast(error);
          } finally {
            setSelectedAcc(null);
            stopAction();
          }
        }}
        extra={
          selectedAcc && (
            <div>
              <div className="flex flex-col gap-1">
                <p className="a-eyebrow ">Balance</p>
                <p className="font-display text-3xl font-extrabold text-[var(--a-accent)]">
                  {fmtMoney(selectedAcc.wallet.balance)}
                </p>
                <p className="a-eyebrow mb-">Bid Balance</p>
                <p className="font-display text-3xl font-extrabold text-[var(--a-accent)]">
                  {fmtMoney(selectedAcc.wallet.bidBalance)}
                </p>
              </div>
              {/* <p className="mt-1 text-[10px] text-[var(--a-muted)]">Spendable</p> */}
              <ul className="mt-4 space-y-2 text-xs">
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Tx count</span>
                  <span className="a-mono text-[var(--a-fg-2)]">
                    {transactions.filter((t) => t.userID === selectedAcc.userID).length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--a-muted)]">Joined Date</span>
                  <span className="a-mono text-[var(--a-fg-2)]">
                    {fmtDateTime(selectedAcc.joinedDate)}
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
                  onRun: async () => {
                    startAction("Marking account verified...");
                    try {
                      await updateDocument({
                        collections: "users",
                        document: { id: selectedAcc.id, status: "active" },
                      });
                      modToast();
                    } catch (error) {
                      errorToast(error);
                    } finally {
                      setSelectedAcc(null);
                      stopAction();
                    }
                  },
                },
                {
                  id: "suspend",
                  label: "Suspend account",
                  icon: Ban,
                  tone: "danger",
                  confirm: `Suspend ${selectedAcc.fullName}?`,
                  onRun: async () => {
                    startAction("Suspending account...");
                    try {
                      await updateDocument({
                        collections: "users",
                        document: { id: selectedAcc.id, status: "suspended" },
                      });
                      modToast();
                    } catch (error) {
                      errorToast(error);
                    } finally {
                      setSelectedAcc(null);
                      stopAction();
                    }
                  },
                },
                {
                  id: "credit",
                  label: "Credit $100",
                  icon: WalletIcon,
                  onRun: async () => {
                    startAction("Crediting wallet...");
                    try {
                      await updateDocument({
                        collections: "users",
                        document: {
                          id: selectedAcc.id,
                          wallet: {
                            balance: selectedAcc.wallet.balance + 100,
                            bidBalance: selectedAcc.wallet.bidBalance,
                          },
                        },
                      });
                      modToast();
                    } catch (error) {
                      errorToast(error);
                    } finally {
                      setSelectedAcc(null);
                      stopAction();
                    }
                  },
                },
                {
                  id: "debit",
                  label: "Debit $100",
                  icon: WalletIcon,
                  tone: "danger",
                  onRun: async () => {
                    startAction("Debiting wallet...");
                    try {
                      await updateDocument({
                        collections: "users",
                        document: {
                          id: selectedAcc.id,
                          wallet: {
                            balance: Math.max(0, selectedAcc.wallet.balance - 100),
                            bidBalance: selectedAcc.wallet.bidBalance,
                          },
                        },
                      });
                      modToast();
                    } catch (error) {
                      errorToast(error);
                    } finally {
                      setSelectedAcc(null);
                      stopAction();
                    }
                  },
                },
                // {
                //   id: "reset",
                //   label: "Force password reset",
                //   icon: KeyRound,
                //   onRun: () => alert(`Reset email sent to ${selectedAcc.email} (mock).`),
                // },
                // {
                //   id: "message",
                //   label: "Message user",
                //   icon: Mail,
                //   onRun: () => alert(`Opened message thread with ${selectedAcc.fullName} (mock).`),
                // },
              ]
            : undefined
        }
      />
    </div>
  );
}
