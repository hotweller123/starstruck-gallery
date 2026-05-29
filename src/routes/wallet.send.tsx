import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { WalletShell } from "@/components/wallet/WalletShell";
import { FormPage, WAmount, WInput, WSubmit } from "@/components/wallet/FormPage";
import { useWallet, formatMoney } from "@/lib/wallet";

export const Route = createFileRoute("/wallet/send")({
  component: SendPage,
  head: () => ({ meta: [{ title: "Send — Aethelred Wallet" }] }),
});

function SendPage() {
  return (
    <WalletShell>
      <Inner />
    </WalletShell>
  );
}

function Inner() {
  const { transfer, currentAccount } = useWallet();
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState(25);
  const [note, setNote] = useState("");
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = transfer(token, Number(amount), note || undefined);
    if (!res.ok) setError(res.error ?? "Failed");
    else setDone(Number(amount));
  };

  if (done !== null) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="rounded-3xl border border-[var(--w-border)] bg-[var(--w-surface)] p-10 shadow-xl">
          <span
            className="mx-auto grid size-16 place-items-center rounded-full text-white shadow-lg"
            style={{ background: "var(--w-grad-brand)" }}
          >
            <CheckCircle2 className="size-8" strokeWidth={2} />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
            {formatMoney(done)} sent
          </h1>
          <p className="mt-2 text-sm text-[var(--w-muted)]">
            New balance {formatMoney(currentAccount?.balance ?? 0)}
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

  return (
    <FormPage
      title="Send funds"
      subtitle="Transfer to another Aethelred wallet using its token"
      icon={<Send className="size-6" strokeWidth={2.2} />}
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        <WInput
          label="Recipient token"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="AET-XXXX-XXXX-XXXX"
          className="font-mono tracking-wider"
        />

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Amount
          </p>
          <div className="mt-2">
            <WAmount value={amount} onChange={setAmount} max={currentAccount?.balance ?? 0} />
          </div>
          <p className="mt-2 text-[11px] text-[var(--w-muted)]">
            Available · {formatMoney(currentAccount?.balance ?? 0)}
          </p>
        </div>

        <WInput
          label="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="For the framing"
        />

        {error && (
          <p className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)]">
            {error}
          </p>
        )}

        <WSubmit type="submit">Send {formatMoney(amount)}</WSubmit>
      </form>
    </FormPage>
  );
}
