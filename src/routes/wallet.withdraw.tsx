import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  ArrowUpFromLine,
  Building2,
  CheckCircle2,
  Globe,
  Hash,
  User,
} from "lucide-react";
import {
  FormPage,
  WAmount,
  WInput,
  WSelect,
  WSubmit,
  WRow,
} from "@/components/wallet/FormPage";
import { useWallet, formatMoney } from "@/lib/wallet";

export const Route = createFileRoute("/wallet/withdraw")({
  component: WithdrawPage,
  head: () => ({ meta: [{ title: "Withdraw — EmberPay" }] }),
});

const SPEEDS = [
  { value: "instant", label: "Instant · 1% fee" },
  { value: "standard", label: "Standard · 1–2 days · free" },
];

const COUNTRIES = [
  { value: "PT", label: "Portugal" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
];

function WithdrawPage() {
  const { withdraw, currentAccount } = useWallet();
  const [amount, setAmount] = useState(50);
  const [speed, setSpeed] = useState("instant");
  const [country, setCountry] = useState("PT");
  const [bank, setBank] = useState("Banco Português");
  const [holder, setHolder] = useState(currentAccount?.name ?? "");
  const [iban, setIban] = useState("PT50 0000 0000 0000 0000 0");
  const [swift, setSwift] = useState("BBPIPTPL");
  const [reference, setReference] = useState("EmberPay withdrawal");
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = withdraw(Number(amount), `${bank} · ${iban.slice(-4).padStart(4, "•")}`);
    if (!res.ok) setError(res.error ?? "Failed");
    else setDone(Number(amount));
  };

  if (done !== null) {
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
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
            {formatMoney(done)} withdrawn
          </h1>
          <p className="mt-2 text-sm text-[var(--w-muted)]">
            New balance {formatMoney(currentAccount?.balance ?? 0)}
          </p>
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

  const fee = speed === "instant" ? Math.round(amount * 0.01 * 100) / 100 : 0;

  return (
    <FormPage
      eyebrow="Cash out"
      title="Withdraw"
      subtitle={`Available · ${formatMoney(currentAccount?.balance ?? 0)}`}
      icon={<ArrowUpFromLine className="size-6" strokeWidth={2.2} />}
      aside={
        <div className="sticky top-28 rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Summary
          </p>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--w-fg)]">
            {formatMoney(amount)}
          </h3>
          <dl className="mt-5 flex flex-col gap-3 text-sm">
            <Row label="Destination" value={`${bank}, ${country}`} />
            <Row label="Speed" value={speed === "instant" ? "Instant" : "Standard"} />
            <Row label="Fee" value={formatMoney(fee)} />
            <div className="border-t border-[var(--w-border)] pt-3">
              <Row label="They receive" value={formatMoney(amount - fee)} bold />
            </div>
          </dl>
        </div>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        <WAmount value={amount} onChange={setAmount} max={currentAccount?.balance ?? 0} />

        <WSelect label="Withdrawal speed" value={speed} onChange={setSpeed} options={SPEEDS} />

        <div className="rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] p-5">
          <div className="flex items-center gap-3">
            <Building2 className="size-5 text-[var(--w-brand)]" strokeWidth={2} />
            <p className="text-sm font-extrabold text-[var(--w-fg)]">Bank destination</p>
          </div>
          <div className="mt-4 grid gap-3">
            <WRow>
              <WSelect label="Country" value={country} onChange={setCountry} options={COUNTRIES} />
              <WInput
                label="Bank name"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                icon={<Globe className="size-4" />}
              />
            </WRow>
            <WInput
              label="Account holder"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              icon={<User className="size-4" />}
            />
            <WRow>
              <WInput
                label="IBAN / Account"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                icon={<Hash className="size-4" />}
                className="font-mono"
              />
              <WInput
                label="SWIFT / BIC"
                value={swift}
                onChange={(e) => setSwift(e.target.value)}
                className="font-mono"
              />
            </WRow>
            <WInput
              label="Reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              hint="Shown on your bank statement."
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)] animate__animated animate__headShake">
            {error}
          </p>
        )}

        <WSubmit type="submit">Withdraw {formatMoney(amount)}</WSubmit>
      </form>
    </FormPage>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[var(--w-muted)]">{label}</dt>
      <dd className={`text-right ${bold ? "text-base font-extrabold text-[var(--w-fg)]" : "font-semibold text-[var(--w-fg)]"}`}>
        {value}
      </dd>
    </div>
  );
}
