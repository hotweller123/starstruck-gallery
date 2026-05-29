import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { WalletShell } from "@/components/wallet/WalletShell";
import { TxRow } from "@/components/wallet/TxRow";
import { useWallet, TX_LABEL, type TxType } from "@/lib/wallet";

export const Route = createFileRoute("/wallet/activity")({
  component: ActivityPage,
  head: () => ({ meta: [{ title: "Activity — Aethelred Wallet" }] }),
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
  return <Inner />;
}

function Inner() {
  const { currentAccount, txsFor } = useWallet();
  const [filter, setFilter] = useState<TxType | "all">("all");
  if (!currentAccount) return null;
  const all = txsFor(currentAccount.id);
  const list = filter === "all" ? all : all.filter((t) => t.type === filter);

  return (
    <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl md:p-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--w-fg)]">
        Activity
      </h1>
      <p className="mt-1 text-sm text-[var(--w-muted)]">
        Every transaction made with this wallet, including site activity.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TYPES.map((t) => {
          const active = filter === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setFilter(t.value)}
              className={`rounded-full border border-[var(--w-border)] px-4 py-1.5 text-xs font-semibold transition ${
                active
                  ? "shadow"
                  : "bg-[var(--w-input)] text-[var(--w-muted)] hover:text-[var(--w-fg)]"
              }`}
              style={active ? { background: "var(--w-brand)", color: "var(--w-brand-contrast)" } : undefined}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {list.length === 0 ? (
          <p className="py-16 text-center text-sm text-[var(--w-muted)]">
            Nothing here yet.
          </p>
        ) : (
          list.map((t) => <TxRow key={t.id} tx={t} />)
        )}
      </div>
    </div>
  );
}
