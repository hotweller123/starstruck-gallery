import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  ListOrdered,
  ShieldCheck,
  LogOut,
  Wallet as WalletIcon,
  ArrowLeft,
} from "lucide-react";
import { useWallet, formatMoney } from "@/lib/wallet";
import { AuthForms } from "./AuthForms";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};
const nav: NavItem[] = [
  { to: "/wallet", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/wallet/deposit", label: "Deposit", icon: ArrowDownToLine },
  { to: "/wallet/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/wallet/send", label: "Send", icon: Send },
  { to: "/wallet/activity", label: "Activity", icon: ListOrdered },
  { to: "/wallet/security", label: "Security", icon: ShieldCheck },
];

export function WalletShell({ children }: { children: ReactNode }) {
  const { signedIn, currentAccount, signOut } = useWallet();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  if (!signedIn || !currentAccount) {
    return (
      <div className="wallet-theme min-h-[calc(100vh-73px)] bg-[var(--w-bg)] text-[var(--w-fg)]">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--w-muted)] hover:text-[var(--w-accent)]"
            >
              <ArrowLeft className="size-3.5" /> Back to gallery
            </Link>
            <div className="mt-10 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-xl bg-[var(--w-accent)]/15 text-[var(--w-accent)]">
                <WalletIcon className="size-6" strokeWidth={1.4} />
              </span>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--w-muted)]">
                Aethelred Wallet
              </p>
            </div>
            <h1 className="mt-8 font-display text-5xl italic leading-[1.05] md:text-7xl">
              Your money,<br />in the gallery.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--w-muted)]">
              The wallet is required to bid, buy, or sell on Aethelred. Create
              one in under a minute — funds, transfers and activity all live in
              one place, and a single token links it to the exhibition.
            </p>
            <ul className="mt-8 grid max-w-md gap-3 text-sm text-[var(--w-muted)]">
              <li>· Deposit, withdraw, and transfer between members</li>
              <li>· One token unlocks the entire exhibition site</li>
              <li>· Every site purchase, bid and sale logged here</li>
            </ul>
          </div>
          <AuthForms />
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-theme min-h-[calc(100vh-73px)] bg-[var(--w-bg)] text-[var(--w-fg)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-white/5 bg-[var(--w-surface)] p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-[var(--w-accent)]/15 text-[var(--w-accent)]">
                <WalletIcon className="size-4" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)]">
                  Wallet
                </p>
                <p className="font-display text-lg italic">{currentAccount.name}</p>
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)]">
                Balance
              </p>
              <p className="mt-1 font-display text-2xl italic text-[var(--w-accent)]">
                {formatMoney(currentAccount.balance)}
              </p>
            </div>
          </div>

          <nav className="mt-4 flex flex-col gap-1 rounded-2xl border border-white/5 bg-[var(--w-surface)] p-2">
            {nav.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-[var(--w-accent)]/15 text-[var(--w-accent)]"
                      : "text-[var(--w-fg)]/80 hover:bg-white/5"
                  }`}
                >
                  <Icon className="size-4" strokeWidth={1.5} />
                  {label}
                </Link>
              );
            })}
            <button
              onClick={signOut}
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--w-fg)]/70 hover:bg-white/5 hover:text-[var(--w-danger)]"
            >
              <LogOut className="size-4" strokeWidth={1.5} />
              Sign out
            </button>
          </nav>

          <Link
            to="/"
            className="mt-4 flex items-center gap-2 px-3 text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)] hover:text-[var(--w-accent)]"
          >
            <ArrowLeft className="size-3" /> Back to gallery
          </Link>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
