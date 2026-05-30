import { type KeyboardEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

/* ---------------- BentoCard ---------------- */
export function BentoCard({
  title,
  eyebrow,
  action,
  children,
  className = "",
  delay = 0,
}: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={`a-card-elev flex flex-col p-5 ${className}`}
    >
      {(title || action || eyebrow) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {eyebrow && <p className="a-eyebrow mb-1">{eyebrow}</p>}
            {title && <h3 className="truncate text-sm font-bold text-[var(--a-fg)]">{title}</h3>}
          </div>
          {action}
        </header>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </motion.section>
  );
}

/* ---------------- KpiTile ---------------- */
export function KpiTile({
  label,
  value,
  delta,
  format = "currency",
  delay = 0,
}: {
  label: string;
  value: number;
  delta: number;
  format?: "currency" | "number";
  delay?: number;
}) {
  const positive = delta >= 0;
  const formatted =
    format === "currency"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(value)
      : new Intl.NumberFormat("en-US").format(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="a-card-elev relative overflow-hidden p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="a-eyebrow">{label}</p>
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            positive
              ? "bg-[var(--a-pos)]/15 text-[var(--a-pos)]"
              : "bg-[var(--a-neg)]/15 text-[var(--a-neg)]"
          }`}
        >
          {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
      <p className="font-display mt-3 text-3xl font-extrabold tracking-tight text-[var(--a-fg)]">
        {formatted}
      </p>
      <Sparkline positive={positive} />
    </motion.div>
  );
}

function Sparkline({ positive }: { positive: boolean }) {
  // Deterministic decorative svg
  const pts = positive
    ? "0,28 10,24 22,26 34,18 48,20 60,12 72,16 86,8 100,11"
    : "0,10 10,16 22,14 34,20 48,18 60,24 72,22 86,28 100,26";
  return (
    <svg viewBox="0 0 100 32" className="mt-4 h-9 w-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={positive ? "var(--a-accent)" : "var(--a-neg)"}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts}
      />
    </svg>
  );
}

/* ---------------- StatusChip ---------------- */
const STATUS_STYLES: Record<string, string> = {
  active: "bg-[var(--a-pos)]/15 text-[var(--a-pos)]",
  completed: "bg-[var(--a-pos)]/15 text-[var(--a-pos)]",
  pending: "bg-[var(--a-warn)]/18 text-[var(--a-warn)]",
  review: "bg-[var(--a-info)]/18 text-[var(--a-info)]",
  suspended: "bg-[var(--a-neg)]/15 text-[var(--a-neg)]",
  failed: "bg-[var(--a-neg)]/15 text-[var(--a-neg)]",
};
export function StatusChip({ value }: { value: string }) {
  const cls = STATUS_STYLES[value] || "bg-[var(--a-surface-2)] text-[var(--a-muted)]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}

/* ---------------- SectionHeader ---------------- */
export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="a-eyebrow">Admin · {title}</p>
        <h1 className="font-display mt-1 text-3xl font-extrabold tracking-tight text-[var(--a-fg)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-xl text-sm text-[var(--a-muted)]">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ---------------- DataTable (lightweight) ---------------- */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  empty = "No records.",
  onRowClick,
  getRowLink,
}: {
  columns: {
    key: string;
    header: string;
    render: (row: T) => ReactNode;
    className?: string;
    rowLink?: boolean;
  }[];
  rows: T[];
  empty?: string;
  onRowClick?: (row: T) => void;
  getRowLink?: (row: T) => { to: string; params?: Record<string, string> };
}) {
  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: T) {
    if (event.target instanceof HTMLElement) {
      const interactive = event.target.closest("a,button,input,select,textarea,[role='button']");
      if (interactive) return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick?.(row);
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-[var(--a-border)]">
      <div className="overflow-x-auto a-scrollbar">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--a-bg-2)] text-[var(--a-muted)]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`border-b border-[var(--a-border)] px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider ${c.className ?? ""}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-[var(--a-muted)]"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={onRowClick ? (event) => handleRowKeyDown(event, row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  className={`transition hover:bg-[var(--a-surface-2)]/70 ${onRowClick ? "a-row-link" : ""} ${
                    i % 2 === 0 ? "bg-[var(--a-surface)]/40" : "bg-transparent"
                  }`}
                >
                  {columns.map((c) => {
                    const rowLink = getRowLink?.(row);
                    const shouldWrapWithLink = Boolean(rowLink) && c.rowLink !== false;

                    return (
                      <td
                        key={c.key}
                        className={`border-b border-[var(--a-border)]/60 px-4 py-3 align-middle ${c.className ?? ""}`}
                      >
                        {shouldWrapWithLink && rowLink ? (
                          <Link
                            to={rowLink.to as never}
                            params={rowLink.params as never}
                            className="group/table-row-link -m-4 block rounded-sm p-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--a-accent)]"
                          >
                            {c.render(row)}
                          </Link>
                        ) : (
                          c.render(row)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- TabBar ---------------- */
export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-5 inline-flex rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-1">
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative rounded-[6px] px-3 py-1.5 text-xs font-semibold transition ${
              isActive
                ? "bg-[var(--a-accent)] text-[var(--a-accent-ink)]"
                : "text-[var(--a-muted)] hover:text-[var(--a-fg)]"
            }`}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] ${
                  isActive
                    ? "bg-[var(--a-accent-ink)]/15 text-[var(--a-accent-ink)]"
                    : "bg-[var(--a-bg-2)] text-[var(--a-muted)]"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
