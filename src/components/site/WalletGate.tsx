import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Wallet as WalletIcon, KeyRound } from "lucide-react";
import { useStore } from "@/lib/store";
import { useWallet, formatMoney } from "@/lib/wallet";

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function WalletGate({
  children,
  title = "Connect your Aethelred Wallet",
  description = "The exhibition is wallet-gated. Paste your wallet token on the Connect page to unlock bidding, buying, selling, and your profile.",
}: Props) {
  const { connectedWalletId } = useStore();
  const { getAccount } = useWallet();
  const account = getAccount(connectedWalletId);

  if (!account) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="border border-ink/10 bg-surface/40 p-10 text-center md:p-14">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-clay/10 text-clay">
            <WalletIcon className="size-6" strokeWidth={1.3} />
          </span>
<<<<<<< HEAD
          <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-detail">
            Wallet required
          </p>
          <h2 className="mt-3 font-display text-4xl italic md:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-detail">
            {description}
          </p>
=======
          <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-detail">Wallet required</p>
          <h2 className="mt-3 font-display text-4xl italic md:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-detail">{description}</p>
>>>>>>> 49a1b1e (updated)
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/connect"
              className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
            >
              <KeyRound className="size-3.5" strokeWidth={1.5} />
              Connect with token
            </Link>
            <Link
              to="/wallet"
              className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
            >
              Open wallet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-ink/10 bg-surface/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-detail">
          <span>
            Wallet connected · {account.name} ·{" "}
            <span className="text-ink">{formatMoney(account.balance)}</span>
          </span>
          <Link to="/wallet" className="text-ink hover:text-clay">
            Open wallet →
          </Link>
        </div>
      </div>
      {children}
    </>
  );
}
