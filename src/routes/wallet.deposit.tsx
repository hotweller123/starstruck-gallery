import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  ArrowDownToLine,
  CreditCard,
  CheckCircle2,
  Building2,
  Calendar,
  Lock,
  Sparkles,
} from "lucide-react";
import { FormPage, WAmount, WInput, WSelect, WSubmit, WRow } from "@/components/wallet/FormPage";
import { useWallet, formatMoney } from "@/lib/wallet";
import { useAuthStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import { FormProvider, useForm } from "react-hook-form";
import { WalletTx } from "@/types";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export const Route = createFileRoute("/wallet/deposit")({
  component: DepositPage,
  head: () => ({ meta: [{ title: "Deposit — EmberPay" }] }),
});

const PRESETS = [50, 100, 250, 500, 1000, 2500];

const METHODS = [
  // { value: "card", label: "Debit / Credit card" },
  { value: "bank", label: "Bank transfer (ACH / SEPA)" },
  { value: "crypto", label: "Crypto Details" },
];

function DepositPage() {
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  );

  const formControl = useForm();

  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("crypto");
  const [save, setSave] = useState(true);
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const balanceAfter = amount + user?.wallet.balance;
    const payload: Omit<WalletTx, "id"> = {
      channel: method,
      amount,
      balanceAfter,
      date: serverTimestamp() as unknown as Timestamp,
      createdAt: new Date().toISOString(),
      currency: user?.currency,
      symbol: user?.symbol,
      email: user?.email,
      fullName: user?.fullName,
      status: "Pending",
      title: "Deposit",
      type: "deposit",
      userID: user?.userID,
      counterparty: "counterparty",
      details: {},
    };
  };

  if (done !== null) return <Success amount={done} balance={user?.wallet.balance ?? 0} />;

  return (
    <FormPage
      eyebrow="Add funds"
      title="Deposit"
      subtitle="Top up your EmberPay balance — settled instantly."
      icon={<ArrowDownToLine className="size-6" strokeWidth={2.2} />}
      aside={<Sidebar amount={amount} method={method} />}
    >
      <FormProvider {...formControl}>
        <form onSubmit={submit} className="flex flex-col gap-5">
          <WRow>
            {/* <WSelect label="Currency" value={currency} onChange={setCurrency} options={CURRENCIES} /> */}
            <WSelect label="Method" value={method} onChange={setMethod} options={METHODS} />
          </WRow>

          <div>
            <WAmount value={amount} onChange={setAmount} currency={user?.currency} />
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${
                    amount === p
                      ? "border-transparent shadow"
                      : "border-[var(--w-border)] bg-[var(--w-input)] text-[var(--w-fg)] hover:border-[var(--w-brand)]/40"
                  }`}
                  style={
                    amount === p
                      ? { background: "var(--w-brand)", color: "var(--w-brand-contrast)" }
                      : undefined
                  }
                >
                  {user?.symbol}
                  {p}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] p-5"
          >
            <div className="flex items-center gap-3">
              <Building2 className="size-5 text-[var(--w-brand)]" strokeWidth={2} />
              <p className="text-sm font-extrabold text-[var(--w-fg)]">Crypto details</p>
            </div>
            <div className="mt-4 grid gap-3">
              <WSelect
                label="Select Wallet To Deposit To"
                options={[{ label: "Apple", value: "apple" }]}
                value="apple"
                onChange={(v) => console.log(v)}
              />
            </div>
          </motion.div>

          <label className="flex items-center gap-2 text-xs text-[var(--w-muted)]">
            <input
              type="checkbox"
              checked={save}
              onChange={(e) => setSave(e.target.checked)}
              className="size-4 rounded border-[var(--w-border)] bg-[var(--w-input)] accent-[var(--w-brand)]"
            />
            Save this {method === "card" ? "card" : "method"} for next time
          </label>

          {error && <Err msg={error} />}

          <WSubmit type="submit">
            <span className="inline-flex items-center justify-center gap-2">
              <Sparkles className="size-4" /> Deposit {formatMoney(amount)}
            </span>
          </WSubmit>
        </form>
      </FormProvider>
    </FormPage>
  );
}

function Sidebar({ amount, method }: { amount: number; method: string }) {
  const fee = method === "card" ? Math.round(amount * 0.015 * 100) / 100 : 0;
  const total = amount - fee;
  return (
    <div className="sticky top-28 rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
        Summary
      </p>
      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--w-fg)]">
        {formatMoney(amount)}
      </h3>

      <dl className="mt-5 flex flex-col gap-3 text-sm">
        <Row label="Method" value={METHODS.find((m) => m.value === method)?.label ?? method} />
        <Row label="Processing fee" value={formatMoney(fee)} />
        <Row label="Arrival" value="Instant" />
        <div className="border-t border-[var(--w-border)] pt-3">
          <Row label="You receive" value={formatMoney(total)} bold />
        </div>
      </dl>

      <div className="mt-6 rounded-[1.2rem] border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] p-3 text-[11px] text-[var(--w-muted)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-brand)]">
          Safe by default
        </p>
        <p className="mt-1 leading-snug">
          Funds are simulated for the exhibition. No real payment is taken.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[var(--w-muted)]">{label}</dt>
      <dd
        className={`text-right ${bold ? "text-base font-extrabold text-[var(--w-fg)]" : "font-semibold text-[var(--w-fg)]"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function Success({ amount, balance }: { amount: number; balance: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md text-center"
    >
      <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-10 shadow-xl wallet-ring">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="mx-auto grid size-16 place-items-center rounded-full border border-[var(--w-brand)]/40 text-[var(--w-brand)] shadow-lg"
          style={{ background: "var(--w-brand-soft)" }}
        >
          <CheckCircle2 className="size-8" strokeWidth={2} />
        </motion.span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight animate__animated animate__fadeInUp">
          {formatMoney(amount)} deposited
        </h1>
        <p className="mt-2 text-sm text-[var(--w-muted)]">New balance {formatMoney(balance)}</p>
        <Link
          to="/wallet"
          className="mt-6 inline-block w-full rounded-[1.4rem] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] shadow-lg"
          style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
        >
          Back to wallet
        </Link>
      </div>
    </motion.div>
  );
}

function Err({ msg }: { msg: string }) {
  return (
    <p className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)] animate__animated animate__headShake">
      {msg}
    </p>
  );
}
