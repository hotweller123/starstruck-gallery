import {
  ArrowDownLeft,
  ArrowUpRight,
  Gavel,
  RotateCcw,
  ShoppingBag,
  Banknote,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import { TX_LABEL, txSign } from "@/lib/wallet";
import { WalletTx } from "@/types";
import { formatMoney } from "@/utils";

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
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ x: 2 }}
      className="flex items-center gap-4 border-b border-[var(--w-border)] py-3.5 last:border-b-0"
    >
      <span
        className="grid size-10 shrink-0 place-items-center rounded-[1rem] border border-[var(--w-border)]"
        style={{
          background: positive ? "var(--w-brand-soft)" : "var(--w-bg-2)",
          color: positive ? "var(--w-brand)" : "var(--w-fg)",
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
            positive ? "text-[var(--w-brand)]" : "text-[var(--w-fg)]"
          }`}
        >
          {positive ? "+" : "−"}
          {formatMoney(tx.amount, tx.currency)}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--w-muted)]">
          Bal {formatMoney(tx.balanceAfter, tx.currency)}
        </p>
      </div>
    </motion.div>
  );
}
