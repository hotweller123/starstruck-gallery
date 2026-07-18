import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Copy, Loader2, Lock } from "lucide-react";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  copyClipboard,
  formatMoney,
  formatMoneyInput,
  getCurrencySymbol,
  parseMoney,
} from "@/utils";
import { Controller, useFormContext } from "react-hook-form";
import { DepositSchema, Err } from "@/routes/wallet.deposit";
import { WithdrawalSchema } from "@/routes/wallet.withdraw";
import { useAuthStore } from "@/store/zustand";

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
            Encrypted · payment rail
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
  name,
  schema = "withdraw",
  ...props
}: {
  label: string;
  hint?: string;
  name: string;
  icon?: ReactNode;
  schema: keyof FormSchema;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  const errorWithdraw = errors[name]?.message;

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
          {...register(name)}
          className={`w-full rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] py-3.5 ${icon ? "pl-11 pr-4" : "px-4"} text-base font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)] ${props.className ?? ""}`}
        />
      </div>
      {hint && <span className="text-[11px] text-[var(--w-muted)]">{hint}</span>}
      {errorWithdraw && <Err msg={typeof errorWithdraw == "string" && errorWithdraw} />}
    </label>
  );
}

export function WTextarea({
  label,
  hint,
  name,
  ...props
}: {
  label: string;
  hint?: string;
  name: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const errorMessage = errors[name]?.message;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
        {label}
      </span>
      <textarea
        {...props}
        {...register(name)}
        rows={props.rows ?? 3}
        className={`resize-none text-base rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] px-4 py-3 text-sm font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)] ${props.className ?? ""}`}
      />
      {hint && <span className="text-[11px] text-[var(--w-muted)]">{hint}</span>}
      {typeof errorMessage == "string" && <Err msg={errorMessage} />}
    </label>
  );
}

export function WSelect({
  label,
  options,
  value,
  name,
  placeholder,
  onChange,
}: {
  label: string;
  placeholder: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (v: string) => void;
}) {
  const {
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useFormContext();
  const errorMessage = errors[name]?.message;

  return (
    <>
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
          {label}
        </span>

        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            return (
              <Select
                value={value}
                onValueChange={(e) => {
                  onChange(e);
                  field.onChange(e);
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className="appearance-none rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] px-4 py-6 text-sm font-medium text-[var(--w-fg)] focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)]">
                  <SelectValue
                    placeholder={placeholder}
                    className="placehoder:text-[var(--w-muted)]!"
                  />
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
            );
          }}
        />

        {errorMessage && <Err msg={typeof errorMessage == "string" && errorMessage} />}
      </label>
    </>
  );
}

interface FormSchema {
  deposit: DepositSchema;
  withdraw: WithdrawalSchema;
  transfer: {
    amount: number;
    token: string;
    purpose?: string;
    emoji?: string;
    note?: string;
  };
}

export function WAmount({
  currency = "USD",
  name = "amount",
  schema = "withdraw",
}: {
  currency?: string;
  name?: string;
  schema: keyof FormSchema;
}) {
  const { user } = useAuthStore();

  const {
    setValue,
    watch,
    getValues,
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const options = {};
  const errorMessage = errors["amount"]?.message;

  const amount: number = getValues("amount");

  const handleChange = (v: string) => {
    const parsed = parseMoney(v);
    setV(String(parsed));
    setValue("amount", parsed);
  };

  const [v, setV] = useState("");
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value: number = field.value;

          const str = formatMoney(value, user?.currency, {
            withSymbol: false,
            decimals: 0,
          });

          return (
            <>
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
                      value={str}
                      className="w-full bg-transparent text-5xl font-extrabold tracking-tight text-[var(--w-fg)] focus:outline-none md:text-6xl"
                      onChange={(e) => {
                        const parsed = parseMoney(e.target.value);

                        field.onChange(parsed);
                      }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
                      {currency}
                    </span>
                  </div>
                  {errorMessage && <Err msg={typeof errorMessage == "string" && errorMessage} />}
                </div>
              </motion.div>
            </>
          );
        }}
      ></Controller>
    </>
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
  const {
    formState: { isLoading, isSubmitting, isValid },
  } = useFormContext();

  const loading = isLoading || isSubmitting;

  return (
    <motion.button
      whileHover={{ y: -1 }}
      type="submit"
      disabled={loading || !isValid}
      whileTap={{ scale: 0.98 }}
      {...(props as React.ComponentProps<typeof motion.button>)}
      className={`w-full rounded-[1.4rem] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--w-brand-contrast)] shadow-xl transition disabled:opacity-50 disabled:pointer-events-none ${props.className ?? ""} text-center mx-auto`}
      style={{ background: bg }}
    >
      {loading ? <Loader2 className="animate-spin mx-auto text-center" /> : <>{children}</>}
    </motion.button>
  );
}

export function WRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function WCopied({
  label = "Clipboard is Empty",
  value = "Clipboard is Empty",
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
        Wallet Address
      </p>
      <div
        onClick={() => {
          copyClipboard(value);
        }}
        className="cursor-pointer gap-3 overflow-clip rounded-2xl py-3 px-3 bg-[var(--w-input)] border border-[var(--w-border)] rounded-[1rem] text-[var(--w-brand)] flex justify-between items-center"
      >
        <p className="break-all line-clamp-1 text-sm text-white">
          {label}fougphiadfosuip'agohup97hsdfoui
        </p>
        <Copy size={17} />
      </div>
    </div>
  );
}

export function WFile({
  label,
  hint,
  icon,
  name,
  ...props
}: {
  label: string;
  hint?: string;
  name: string;
  icon?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const {
    setValue,
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
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
                type="file"
                onChange={(e) => {
                  const type = e.target.files[0];
                  field.onChange(type);
                }}
                className={`w-full rounded-[1.1rem] border border-[var(--w-border)] bg-[var(--w-input)] py-3.5 ${icon ? "pl-11 pr-4" : "px-4"} text-sm font-medium text-[var(--w-fg)] placeholder:text-[var(--w-muted)]/60 transition focus:border-[var(--w-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--w-brand-ring)] ${props.className ?? ""}`}
              />
            </div>
            {hint && <span className="text-[11px] text-[var(--w-muted)]">{hint}</span>}
            {error && <Err msg={typeof error == "string" && error} />}
          </label>
        );
      }}
    ></Controller>
  );
}
