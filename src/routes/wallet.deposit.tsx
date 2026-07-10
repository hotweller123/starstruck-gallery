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

export const Route = createFileRoute("/wallet/deposit")({
  component: DepositPage,
  head: () => ({ meta: [{ title: "Deposit — EmberPay" }] }),
});

const PRESETS = [50, 100, 250, 500, 1000, 2500];

const METHODS = [
  { value: "card", label: "Debit / Credit card" },
  { value: "bank", label: "Bank transfer (ACH / SEPA)" },
  { value: "apple", label: "Apple Pay" },
  { value: "google", label: "Google Pay" },
];

const CURRENCIES = [
  { value: "USD", label: "USD · US Dollar" },
  { value: "EUR", label: "EUR · Euro" },
  { value: "GBP", label: "GBP · Pound Sterling" },
];

function DepositPage() {
  const { deposit, currentAccount } = useWallet();
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("card");
  const [currency, setCurrency] = useState("USD");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [holder, setHolder] = useState(currentAccount?.name ?? "");
  const [zip, setZip] = useState("10001");
  const [save, setSave] = useState(true);
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const note =
      method === "card"
        ? `Card · •••• ${card.replace(/\s+/g, "").slice(-4)}`
        : (METHODS.find((m) => m.value === method)?.label ?? "Deposit");
    const res = deposit(Number(amount), note);
    if (!res.ok) setError(res.error ?? "Failed");
    else setDone(Number(amount));
  };

  if (done !== null) return <Success amount={done} balance={currentAccount?.balance ?? 0} />;

  return (
    <FormPage
      eyebrow="Add funds"
      title="Deposit"
      subtitle="Top up your EmberPay balance — settled instantly."
      icon={<ArrowDownToLine className="size-6" strokeWidth={2.2} />}
      aside={<Sidebar amount={amount} method={method} />}
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        <WRow>
          <WSelect label="Currency" value={currency} onChange={setCurrency} options={CURRENCIES} />
          <WSelect label="Method" value={method} onChange={setMethod} options={METHODS} />
        </WRow>

        <div>
          <WAmount value={amount} onChange={setAmount} currency={currency} />
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
                ${p}
              </motion.button>
            ))}
          </div>
        </div>

        {method === "card" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] p-5"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-[var(--w-brand)]" strokeWidth={2} />
              <p className="text-sm font-extrabold text-[var(--w-fg)]">Card details</p>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
                mock
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              <WInput
                label="Card number"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                icon={<CreditCard className="size-4" />}
                className="font-mono tracking-wider"
              />
              <WRow>
                <WInput
                  label="Expiry"
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  placeholder="MM/YY"
                  icon={<Calendar className="size-4" />}
                />
                <WInput
                  label="CVC"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="123"
                  icon={<Lock className="size-4" />}
                />
              </WRow>
              <WRow>
                <WInput
                  label="Cardholder"
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                />
                <WInput label="Billing ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
              </WRow>
            </div>
          </motion.div>
        )}

        {method === "bank" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] p-5"
          >
            <div className="flex items-center gap-3">
              <Building2 className="size-5 text-[var(--w-brand)]" strokeWidth={2} />
              <p className="text-sm font-extrabold text-[var(--w-fg)]">Bank details</p>
            </div>
            <div className="mt-4 grid gap-3">
              <WInput label="Account holder" defaultValue={currentAccount?.name} />
              <WRow>
                <WInput label="Routing / SWIFT" defaultValue="ETHRGB22" className="font-mono" />
                <WInput label="Account number" defaultValue="••••5310" className="font-mono" />
              </WRow>
            </div>
          </motion.div>
        )}

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
