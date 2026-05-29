import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUpFromLine, Building2, CheckCircle2 } from "lucide-react";
import { WalletShell } from "@/components/wallet/WalletShell";
import { FormPage, WAmount, WInput, WSubmit } from "@/components/wallet/FormPage";
import { useWallet, formatMoney } from "@/lib/wallet";

export const Route = createFileRoute("/wallet/withdraw")({
  component: WithdrawPage,
  head: () => ({ meta: [{ title: "Withdraw — Aethelred Wallet" }] }),
});

function WithdrawPage() {
  return <Inner />;
}

function Inner() {
  const { withdraw, currentAccount } = useWallet();
  const [amount, setAmount] = useState(50);
  const [bank, setBank] = useState("Banco Português");
  const [acct, setAcct] = useState("****1234");
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = withdraw(Number(amount), `To ${bank} · ${acct}`);
    if (!res.ok) setError(res.error ?? "Failed");
    else setDone(Number(amount));
  };

  if (done !== null) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-10 shadow-xl">
          <span
            className="mx-auto grid size-16 place-items-center rounded-full border border-[var(--w-border)] text-[var(--w-brand)] shadow-lg"
            style={{ background: "var(--w-brand-soft)" }}
          >
            <CheckCircle2 className="size-8" strokeWidth={2} />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
            {formatMoney(done)} withdrawn
          </h1>
          <p className="mt-2 text-sm text-[var(--w-muted)]">
            New balance {formatMoney(currentAccount?.balance ?? 0)}
          </p>
          <Link
            to="/wallet"
            className="mt-6 inline-block w-full rounded-[1.4rem] px-6 py-3.5 text-sm font-bold shadow-lg"
            style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
          >
            Back to wallet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <FormPage
      title="Withdraw"
      subtitle={`Available · ${formatMoney(currentAccount?.balance ?? 0)}`}
      icon={<ArrowUpFromLine className="size-6" strokeWidth={2.2} />}
      tint="var(--w-brand-soft)"
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Amount
          </p>
          <div className="mt-2">
            <WAmount value={amount} onChange={setAmount} max={currentAccount?.balance ?? 0} />
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-input)] p-4">
          <div className="flex items-center gap-3">
            <Building2 className="size-5 text-[var(--w-brand)]" strokeWidth={2} />
            <p className="text-sm font-semibold text-[var(--w-fg)]">Bank destination</p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <WInput label="Bank name" value={bank} onChange={(e) => setBank(e.target.value)} />
            <WInput label="Account" value={acct} onChange={(e) => setAcct(e.target.value)} />
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)]">
            {error}
          </p>
        )}

        <WSubmit type="submit">Withdraw {formatMoney(amount)}</WSubmit>
      </form>
    </FormPage>
  );
}
