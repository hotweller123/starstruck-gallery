import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowDownToLine, CreditCard, CheckCircle2 } from "lucide-react";
import { WalletShell } from "@/components/wallet/WalletShell";
import { FormPage, WAmount, WInput, WSubmit } from "@/components/wallet/FormPage";
import { useWallet, formatMoney } from "@/lib/wallet";

export const Route = createFileRoute("/wallet/deposit")({
  component: DepositPage,
  head: () => ({ meta: [{ title: "Deposit — Aethelred Wallet" }] }),
});

const PRESETS = [50, 100, 250, 500, 1000];

function DepositPage() {
  return (
    <WalletShell>
      <Inner />
    </WalletShell>
  );
}

function Inner() {
  const { deposit, currentAccount } = useWallet();
  const [amount, setAmount] = useState(100);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [holder, setHolder] = useState(currentAccount?.name ?? "");
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = deposit(Number(amount), `Card ending ${card.slice(-4)}`);
    if (!res.ok) setError(res.error ?? "Failed");
    else setDone(Number(amount));
  };

  if (done !== null) return <Success amount={done} balance={currentAccount?.balance ?? 0} />;

  return (
    <FormPage
      title="Deposit"
      subtitle="Add funds to your wallet · simulated"
      icon={<ArrowDownToLine className="size-6" strokeWidth={2.2} />}
      tint="linear-gradient(135deg, var(--w-pos), var(--w-brand-hi))"
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Amount
          </p>
          <div className="mt-2">
            <WAmount value={amount} onChange={setAmount} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setAmount(p)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  amount === p
                    ? "text-white shadow"
                    : "bg-[var(--w-input)] text-[var(--w-fg)] hover:bg-[var(--w-bg-2)]"
                }`}
                style={amount === p ? { background: "var(--w-grad-brand)" } : undefined}
              >
                ${p}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--w-border)] bg-[var(--w-input)] p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="size-5 text-[var(--w-brand)]" strokeWidth={2} />
            <p className="text-sm font-semibold text-[var(--w-fg)]">
              Card · mock payment
            </p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <WInput
              label="Card number"
              value={card}
              onChange={(e) => setCard(e.target.value)}
            />
            <WInput
              label="Cardholder"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
            />
          </div>
        </div>

        {error && <Err msg={error} />}

        <WSubmit type="submit">Deposit {formatMoney(amount)}</WSubmit>
      </form>
    </FormPage>
  );
}

function Success({ amount, balance }: { amount: number; balance: number }) {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="rounded-3xl border border-[var(--w-border)] bg-[var(--w-surface)] p-10 shadow-xl">
        <span
          className="mx-auto grid size-16 place-items-center rounded-full text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--w-pos), var(--w-brand-hi))" }}
        >
          <CheckCircle2 className="size-8" strokeWidth={2} />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
          {formatMoney(amount)} deposited
        </h1>
        <p className="mt-2 text-sm text-[var(--w-muted)]">
          New balance {formatMoney(balance)}
        </p>
        <Link
          to="/wallet"
          className="mt-6 inline-block w-full rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-lg"
          style={{ background: "var(--w-grad-brand)" }}
        >
          Back to wallet
        </Link>
      </div>
    </div>
  );
}

function Err({ msg }: { msg: string }) {
  return (
    <p className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)]">
      {msg}
    </p>
  );
}
