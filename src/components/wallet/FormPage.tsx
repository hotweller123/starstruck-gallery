import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function FormPage({
  title,
  subtitle,
  icon,
  tint,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  tint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <Link
        to="/wallet"
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--w-muted)] transition hover:text-[var(--w-fg)]"
      >
        <ArrowLeft className="size-3.5" /> Back
      </Link>

      <div className="mt-5 rounded-3xl border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl md:p-8">
        <div className="flex items-center gap-4">
          <span
            className="grid size-14 place-items-center rounded-2xl text-white shadow-lg"
            style={{ background: tint ?? "var(--w-grad-brand)" }}
          >
            {icon}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--w-fg)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--w-muted)]">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export function WInput({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)]">
        {label}
      </span>
      <input
        {...props}
        className={`rounded-xl border border-[var(--w-border)] bg-[var(--w-input)] px-4 py-3 text-sm font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 focus:border-[var(--w-brand-2)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-2)]/30 ${props.className ?? ""}`}
      />
    </label>
  );
}

export function WAmount({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[var(--w-border)] bg-[var(--w-input)] px-5 py-5">
      <span className="text-3xl font-bold text-[var(--w-muted)]">$</span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-transparent text-4xl font-extrabold tracking-tight text-[var(--w-fg)] focus:outline-none"
      />
    </div>
  );
}

export function WSubmit({
  children,
  variant = "brand",
  ...props
}: {
  variant?: "brand" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const bg =
    variant === "danger"
      ? "linear-gradient(135deg, oklch(0.7 0.22 22), oklch(0.55 0.22 12))"
      : "var(--w-grad-brand)";
  return (
    <button
      {...props}
      className={`w-full rounded-2xl px-6 py-4 text-sm font-bold tracking-wide text-white shadow-xl transition hover:scale-[1.01] disabled:opacity-50 ${props.className ?? ""}`}
      style={{ background: bg }}
    >
      {children}
    </button>
  );
}
