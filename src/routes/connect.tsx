import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { KeyRound, Wallet as WalletIcon, CheckCircle2 } from "lucide-react";
import { useWallet, formatMoney } from "@/lib/wallet";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/connect")({
  component: ConnectPage,
  head: () => ({ meta: [{ title: "Connect Wallet — Aethelred" }] }),
});

function ConnectPage() {
  const { getAccountByToken } = useWallet();
  const { connectWallet, connectedWalletId, disconnectWallet } = useStore();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const connected = connectedWalletId
    ? getAccountByToken(
        // round-trip through the wallet
        useWalletAccount(connectedWalletId)?.token ?? "",
      )
    : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const acc = getAccountByToken(token);
    if (!acc) {
      setError("That token doesn't match any wallet on this device.");
      return;
    }
    connectWallet(acc.id);
    navigate({ to: "/profile" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Wallet"
        title="Connect to the exhibition"
        description="Paste your Aethelred Wallet token to unlock bidding, buying, selling, and your profile."
      />

      <section className="mx-auto grid max-w-5xl gap-12 px-6 pb-32 pt-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="border border-ink/15 p-8 md:p-10">
          {connected ? (
            <div>
              <div className="flex items-center gap-3 border-b border-ink/10 pb-5">
                <CheckCircle2 className="size-5 text-clay" strokeWidth={1.4} />
<<<<<<< HEAD
                <p className="text-[11px] uppercase tracking-[0.3em] text-clay">
                  Wallet connected
                </p>
              </div>
              <p className="mt-6 font-display text-3xl italic">{connected.name}</p>
              <p className="text-sm text-detail">{connected.email}</p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-detail">
                Balance
              </p>
              <p className="font-display text-4xl italic">
                {formatMoney(connected.balance)}
              </p>
=======
                <p className="text-[11px] uppercase tracking-[0.3em] text-clay">Wallet connected</p>
              </div>
              <p className="mt-6 font-display text-3xl italic">{connected.name}</p>
              <p className="text-sm text-detail">{connected.email}</p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-detail">Balance</p>
              <p className="font-display text-4xl italic">{formatMoney(connected.balance)}</p>
>>>>>>> 49a1b1e (updated)

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/profile"
                  className="border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
                >
                  Go to profile
                </Link>
                <Link
                  to="/wallet"
                  className="border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
                >
                  Open wallet
                </Link>
                <button
                  onClick={disconnectWallet}
                  className="border border-ink/30 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-detail hover:border-clay hover:text-clay"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center bg-clay/10 text-clay">
                  <KeyRound className="size-4" strokeWidth={1.5} />
                </span>
<<<<<<< HEAD
                <p className="text-[10px] uppercase tracking-[0.3em] text-detail">
                  Wallet token
                </p>
=======
                <p className="text-[10px] uppercase tracking-[0.3em] text-detail">Wallet token</p>
>>>>>>> 49a1b1e (updated)
              </div>

              <input
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                placeholder="AET-XXXX-XXXX-XXXX"
                className="mt-5 w-full border border-ink/20 bg-canvas px-4 py-4 font-mono text-base tracking-widest text-ink focus:border-ink focus:outline-none"
                autoFocus
              />

              {error && (
                <p className="mt-3 border border-clay/40 bg-clay/5 px-3 py-2 text-xs text-clay">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-6 w-full border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
              >
                Connect wallet
              </button>

              <p className="mt-5 text-xs text-detail">
                Don't have a wallet?{" "}
                <Link to="/wallet" className="text-ink underline underline-offset-4">
                  Create one in under a minute →
                </Link>
              </p>
            </form>
          )}
        </div>

        <aside className="border border-ink/10 bg-surface/40 p-8">
          <div className="flex items-center gap-3">
            <WalletIcon className="size-5 text-clay" strokeWidth={1.4} />
            <h3 className="font-display text-2xl italic">How it works</h3>
          </div>
          <ol className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-ink/85">
            <Step n={1} title="Create a wallet">
<<<<<<< HEAD
              Sign up for a free Aethelred Wallet — it lives alongside the
              exhibition.
=======
              Sign up for a free Aethelred Wallet — it lives alongside the exhibition.
>>>>>>> 49a1b1e (updated)
            </Step>
            <Step n={2} title="Copy your token">
              In Wallet → Security, copy your unique{" "}
              <code className="font-mono text-xs">AET-…</code> token.
            </Step>
            <Step n={3} title="Connect here">
              Paste the token above. The site is unlocked instantly.
            </Step>
            <Step n={4} title="Bid, buy, sell">
<<<<<<< HEAD
              Auctions, checkout, and listings all flow through your wallet
              balance.
=======
              Auctions, checkout, and listings all flow through your wallet balance.
>>>>>>> 49a1b1e (updated)
            </Step>
          </ol>
        </aside>
      </section>
    </>
  );
}

// Tiny helper to look up account by id without redoing the import dance
function useWalletAccount(id: string) {
  const { getAccount } = useWallet();
  return getAccount(id);
}

<<<<<<< HEAD
function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
=======
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
>>>>>>> 49a1b1e (updated)
  return (
    <li className="flex gap-4">
      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-ink/20 font-display text-sm italic">
        {n}
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-detail">{children}</p>
      </div>
    </li>
  );
}
