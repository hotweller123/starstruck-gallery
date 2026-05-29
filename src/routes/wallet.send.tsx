import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { WalletShell } from "@/components/wallet/WalletShell";
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
      <div className="rounded-2xl border border-white/5 bg-[var(--w-surface)] p-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--w-accent)]/15 text-[var(--w-accent)]">
          <Send className="size-6" strokeWidth={1.4} />
        </span>
        <h1 className="mt-6 font-display text-4xl italic">
          {formatMoney(done)} sent
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
      <h1 className="font-display text-4xl italic">Send funds</h1>
      <p className="mt-1 text-sm text-[var(--w-muted)]">
        Transfer to another Aethelred wallet using its token.
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
        <Field label="Recipient token">
          <input
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="AET-XXXX-XXXX-XXXX"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm tracking-wider focus:border-[var(--w-accent)] focus:outline-none"
          />
        </Field>

        <Field label="Amount">
          <div className="flex items-center rounded-lg border border-white/10 bg-black/30">
            <span className="px-4 text-lg text-[var(--w-muted)]">$</span>
            <input
              type="number"
              min={1}
              max={currentAccount?.balance ?? 0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent py-3 pr-4 font-display text-2xl italic focus:outline-none"
            />
          </div>
        </Field>

        <Field label="Note (optional)">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="For the framing"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm focus:border-[var(--w-accent)] focus:outline-none"
          />
        </Field>

        {error && (
          <p className="rounded-md border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs text-[var(--w-danger)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="self-start rounded-lg bg-[var(--w-accent)] px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-black hover:brightness-110"
        >
          Send {formatMoney(amount)}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}
