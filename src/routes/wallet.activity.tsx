import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Search, Inbox } from "lucide-react";
import { TxRow } from "@/components/wallet/TxRow";
import { TX_LABEL } from "@/lib/wallet";
import { useShallow } from "zustand/shallow";
import { useAuthStore, useDataStore } from "@/store/zustand";
import { TxType } from "@/types";

export const Route = createFileRoute("/wallet/activity")({
  component: ActivityPage,
  head: () => ({ meta: [{ title: "Activity — EmberPay" }] }),
});

const TYPES: Array<{ value: TxType | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "deposit", label: TX_LABEL.deposit },
  { value: "withdraw", label: TX_LABEL.withdraw },
  { value: "transfer_out", label: TX_LABEL.transfer_out },
  { value: "transfer_in", label: TX_LABEL.transfer_in },
  { value: "purchase", label: TX_LABEL.purchase },
  { value: "bid_hold", label: TX_LABEL.bid_hold },
];

function ActivityPage() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<TxType | "all">("all");
  const { transactions } = useDataStore(
    useShallow((s) => ({
      transactions: s.transactions,
    })),
  );
  const [q, setQ] = useState("");
  if (!user) return null;

  let list = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);
  if (q.trim()) {
    const needle = q.toLowerCase();
    list = list.filter(
      (t) =>
        (t.note ?? "").toLowerCase().includes(needle) ||
        (t.counterparty ?? "").toLowerCase().includes(needle),
    );
  }

  return (
    <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--w-brand)]">
            Ledger
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--w-fg)] md:text-4xl">
            Activity
          </h1>
          <p className="mt-1 text-sm text-[var(--w-muted)]">
            Every transaction made with this wallet, on and off the gallery.
          </p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--w-muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search note or counterparty"
            className="w-full rounded-full border border-[var(--w-border)] bg-[var(--w-input)] py-2.5 pl-10 pr-4 text-sm text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)]"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 wallet-hscroll overflow-x-auto pb-1">
        {TYPES.map((t) => {
          const active = filter === t.value;
          return (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={t.value}
              onClick={() => setFilter(t.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${
                active
                  ? "border-transparent shadow"
                  : "border-[var(--w-border)] bg-[var(--w-input)] text-[var(--w-muted)] hover:text-[var(--w-fg)]"
              }`}
              style={
                active
                  ? { background: "var(--w-brand)", color: "var(--w-brand-contrast)" }
                  : undefined
              }
            >
              {t.label}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6">
        {list.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="grid size-12 place-items-center rounded-full border border-[var(--w-border)] bg-[var(--w-bg-2)] text-[var(--w-muted)]">
              <Inbox className="size-5" />
            </span>
            <p className="mt-3 text-sm text-[var(--w-muted)]">Nothing here yet.</p>
          </div>
        ) : (
          list.map((t) => <TxRow key={t.id} tx={t} />)
        )}
      </div>
    </div>
  );
}
