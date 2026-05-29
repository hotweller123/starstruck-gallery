import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowDownToLine, CreditCard } from "lucide-react";
import { WalletShell } from "@/components/wallet/WalletShell";
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
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = deposit(Number(amount), `Card ending ${card.slice(-4)}`);
    if (!res.ok) setError(res.error ?? "Failed");
    else setDone(Number(amount));
  };

  if (done !== null) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[var(--w-surface)] p-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--w-accent)]/15 text-[var(--w-accent)]">
          <ArrowDownToLine className="size-6" strokeWidth={1.4} />
        </span>
        <h1 className="mt-6 font-display text-4xl italic">
          {formatMoney(done)} deposited
        </h1>
        <p className="mt-2 text-sm text-[var(--w-muted)]">
          New balance {formatMoney(currentAccount?.balance ?? 0)}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setDone(null)}
            className="rounded-lg border border-white/10 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] hover:border-[var(--w-accent)]/50 hover:text-[var(--w-accent)]"
          >
            Deposit again
          </button>
          <Link
            to="/wallet"
            className="rounded-lg bg-[var(--w-accent)] px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-black hover:brightness-110"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--w-surface)] p-6 md:p-8">
      <h1 className="font-display text-4xl italic">Deposit</h1>
      <p className="mt-1 text-sm text-[var(--w-muted)]">
        Add funds to your wallet. Simulated — no real money is moved.
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Amount
          </p>
          <div className="mt-2 flex items-center rounded-lg border border-white/10 bg-black/30">
            <span className="px-4 text-lg text-[var(--w-muted)]">$</span>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent py-4 pr-4 font-display text-3xl italic text-[var(--w-accent)] focus:outline-none"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setAmount(p)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  amount === p
                    ? "border-[var(--w-accent)] text-[var(--w-accent)]"
                    : "border-white/10 text-[var(--w-muted)] hover:text-[var(--w-fg)]"
                }`}
              >
                ${p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Payment method (mock)
          </p>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-3">
            <CreditCard className="size-5 text-[var(--w-accent)]" strokeWidth={1.4} />
            <input
              value={card}
              onChange={(e) => setCard(e.target.value)}
              className="w-full bg-transparent text-sm tracking-wider focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs text-[var(--w-danger)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="self-start rounded-lg bg-[var(--w-accent)] px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-black hover:brightness-110"
        >
          Deposit {formatMoney(amount)}
        </button>
      </form>
    </div>
  );
}
