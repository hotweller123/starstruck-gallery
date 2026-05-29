import {
  ArrowDownLeft,
  ArrowUpRight,
  Gavel,
  RotateCcw,
  ShoppingBag,
  Banknote,
  Tag,
} from "lucide-react";
import { formatMoney, TX_LABEL, txSign, type WalletTx } from "@/lib/wallet";

const ICONS = {
  deposit: ArrowDownLeft,
  withdraw: ArrowUpRight,
  transfer_in: ArrowDownLeft,
  transfer_out: ArrowUpRight,
  purchase: ShoppingBag,
  bid_hold: Gavel,
  bid_release: RotateCcw,
  sale: Tag,
} as const;

export function TxRow({ tx }: { tx: WalletTx }) {
  const Icon = ICONS[tx.type] ?? Banknote;
  const sign = txSign(tx.type);
  const positive = sign > 0;
  const date = new Date(tx.createdAt);

  return (
    <div className="flex items-center gap-4 border-b border-[var(--w-border)] py-3.5 last:border-b-0">
      <span
        className="grid size-10 shrink-0 place-items-center rounded-[1rem] border border-[var(--w-border)] text-[var(--w-fg)]"
        style={{
          background: positive ? "var(--w-brand-soft)" : "var(--w-bg-2)",
        }}
      >
        <Icon className="size-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--w-fg)]">{TX_LABEL[tx.type]}</p>
        <p className="truncate text-xs text-[var(--w-muted)]">
          {tx.counterparty ? `${tx.counterparty} · ` : ""}
          {tx.note ?? date.toLocaleString()}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`text-base font-bold tracking-tight ${
            positive ? "text-[var(--w-pos)]" : "text-[var(--w-fg)]"
          }`}
        >
          {positive ? "+" : "−"}
          {formatMoney(tx.amount)}
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--w-muted)]">
          Bal {formatMoney(tx.balanceAfter)}
        </p>
      </div>
    </div>
  );
}
