import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getCurrencySymbol } from "@/utils";

export function FormPage({
  title,
  subtitle,
  icon,
  eyebrow,
  children,
  aside,
}: {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  eyebrow?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-5xl"
    >
      <Link
        to="/wallet"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)] transition hover:border-[var(--w-brand)]/40 hover:text-[var(--w-fg)]"
      >
        <ArrowLeft className="size-3.5" /> Wallet
      </Link>

      <div className={`mt-5 grid gap-6 ${aside ? "lg:grid-cols-[1.6fr_1fr]" : ""}`}>
        <motion.div
          initial={{ scale: 0.985 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="overflow-hidden rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] shadow-xl"
        >
          <div className="relative border-b border-[var(--w-border)] bg-[var(--w-surface-2)] px-7 py-7 md:px-9 md:py-9">
            <div className="absolute inset-0 wallet-dotgrid opacity-40" aria-hidden />
            <div className="relative flex items-center gap-4">
              <motion.span
                initial={{ rotate: -8, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                className="grid size-14 place-items-center rounded-[1.25rem] border border-[var(--w-brand)]/40 bg-[var(--w-brand-soft)] text-[var(--w-brand)] shadow-lg"
              >
                {icon}
              </motion.span>
              <div>
                {eyebrow && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--w-brand)]">
                    {eyebrow}
                  </p>
                )}
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--w-fg)] md:text-[2rem]">
                  {title}
                </h1>
                {subtitle && <p className="mt-1 text-sm text-[var(--w-muted)]">{subtitle}</p>}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">{children}</div>

          <div className="flex items-center gap-2 border-t border-[var(--w-border)] bg-[var(--w-bg-2)]/60 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)]">
            <Lock className="size-3" />
            Encrypted · simulated payment rail
          </div>
        </motion.div>

        {aside && <div>{aside}</div>}
      </div>
    </motion.div>
  );
}

export function WInput({
  label,
  hint,
  icon,
  ...props
}: {
  label: string;
  hint?: string;
  icon?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
        {label}
      </span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--w-muted)]">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] py-3.5 ${icon ? "pl-11 pr-4" : "px-4"} text-sm font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)] ${props.className ?? ""}`}
        />
      </div>
      {hint && <span className="text-[11px] text-[var(--w-muted)]">{hint}</span>}
    </label>
  );
}

export function WTextarea({
  label,
  hint,
  ...props
}: {
  label: string;
  hint?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
        {label}
      </span>
      <textarea
        {...props}
        rows={props.rows ?? 3}
        className={`resize-none rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] px-4 py-3 text-sm font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)] ${props.className ?? ""}`}
      />
      {hint && <span className="text-[11px] text-[var(--w-muted)]">{hint}</span>}
    </label>
  );
}

export function WSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
        {label}
      </span>
      <Select value={value} onValueChange={(e) => onChange(e)}>
        <SelectTrigger className="appearance-none rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] px-4 py-3.5 text-sm font-medium text-[var(--w-fg)] focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((o) => (
              <SelectItem
                key={o.value}
                value={o.value}
                className={
                  value === o.value
                    ? "!bg-slate-600 z-10 text-white"
                    : "hover:bg-slate-600/30! z-10"
                }
              >
                {o.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </label>
  );
}

export function WAmount({
  value,
  onChange,
  max,
  currency = "USD",
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
  currency?: string;
}) {
  return (
    <motion.div
      whileFocus={{ scale: 1.01 }}
      className="relative overflow-hidden rounded-[1.5rem] border border-[var(--w-brand)]/30 bg-[var(--w-bg-2)] px-6 py-7"
    >
      <div className="absolute inset-0 wallet-dotgrid opacity-30" aria-hidden />
      <div className="relative">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--w-brand)]">
          You enter
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[var(--w-muted)]">
            {getCurrencySymbol(currency)}
          </span>
          <input
            type="text"
            inputMode="decimal"
            min={0}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full bg-transparent text-5xl font-extrabold tracking-tight text-[var(--w-fg)] focus:outline-none md:text-6xl"
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
            {currency}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function WSubmit({
  children,
  variant = "brand",
  ...props
}: {
  variant?: "brand" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const bg = variant === "danger" ? "var(--w-danger)" : "var(--w-brand)";
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      {...(props as React.ComponentProps<typeof motion.button>)}
      className={`w-full rounded-[1.4rem] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--w-brand-contrast)] shadow-xl transition disabled:opacity-50 ${props.className ?? ""}`}
      style={{ background: bg }}
    >
      {children}
    </motion.button>
  );
}

export function WRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
