import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUpFromLine, Building2 } from "lucide-react";
import { WalletShell } from "@/components/wallet/WalletShell";
import { useWallet, formatMoney } from "@/lib/wallet";

export const Route = createFileRoute("/wallet/withdraw")({
  component: WithdrawPage,
  head: () => ({ meta: [{ title: "Withdraw — Aethelred Wallet" }] }),
});

function WithdrawPage() {
  return (
    <WalletShell>
      <Inner />
    </WalletShell>
  );
}

function Inner() {
  const { withdraw, currentAccount } = useWallet();
  const [amount, setAmount] = useState(50);
  const [bank, setBank] = useState("Banco Português · ****1234");
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = withdraw(Number(amount), `To ${bank}`);
    if (!res.ok) setError(res.error ?? "Failed");
    else setDone(Number(amount));
  };

  if (done !== null) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[var(--w-surface)] p-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-white/5">
          <ArrowUpFromLine className="size-6" strokeWidth={1.4} />
        </span>
        <h1 className="mt-6 font-display text-4xl italic">
          {formatMoney(done)} withdrawn
        </h1>
        <p className="mt-2 text-sm text-[var(--w-muted)]">
          New balance {formatMoney(currentAccount?.balance ?? 0)}
        </p>
        <Link
          to="/wallet"
          className="mt-6 inline-block rounded-lg bg-[var(--w-accent)] px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-black hover:brightness-110"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--w-surface)] p-6 md:p-8">
      <h1 className="font-display text-4xl italic">Withdraw</h1>
      <p className="mt-1 text-sm text-[var(--w-muted)]">
        Available: {formatMoney(currentAccount?.balance ?? 0)}
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
              max={currentAccount?.balance ?? 0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent py-4 pr-4 font-display text-3xl italic focus:outline-none"
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Destination (mock)
          </p>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-3">
            <Building2 className="size-5 text-[var(--w-accent)]" strokeWidth={1.4} />
            <input
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
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
          className="self-start rounded-lg border border-[var(--w-danger)]/60 bg-[var(--w-danger)]/15 px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--w-danger)] hover:bg-[var(--w-danger)]/25"
        >
          Withdraw {formatMoney(amount)}
        </button>
      </form>
    </div>
  );
}
