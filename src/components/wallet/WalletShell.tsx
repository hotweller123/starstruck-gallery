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
  ArrowUpRight,
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

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[var(--w-bg)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/wallet" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--w-accent)] to-[var(--w-accent-2)] text-black shadow-[0_8px_30px_-10px_var(--w-accent)]">
            <WalletIcon className="size-4" strokeWidth={1.8} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg italic text-[var(--w-fg)]">
              Aethelred Pay
            </p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--w-muted)]">
              Wallet · v1.0
            </p>
          </div>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--w-muted)] transition-colors hover:border-[var(--w-accent)]/50 hover:text-[var(--w-accent)]"
        >
          Gallery <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </header>
  );
}

export function WalletShell({ children }: { children: ReactNode }) {
  const { signedIn, currentAccount, signOut } = useWallet();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  if (!signedIn || !currentAccount) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--w-bg)] text-[var(--w-fg)]">
        <TopBar />
        <div className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-6 py-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--w-accent)]">
              A wallet for the exhibition
            </p>
            <h1 className="mt-6 font-display text-5xl italic leading-[1.05] md:text-7xl">
              Your money,<br />beautifully held.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--w-muted)]">
              Aethelred Pay is a standalone wallet that pairs with the gallery
              site. Create one to deposit, send, and receive — then paste your
              token on the gallery to bid, buy, and sell.
            </p>
            <ul className="mt-8 grid max-w-md gap-3 text-sm text-[var(--w-muted)]">
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-[var(--w-accent)]" />
                Deposit, withdraw, and transfer between members
              </li>
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-[var(--w-accent)]" />
                One token unlocks the entire exhibition site
              </li>
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-[var(--w-accent)]" />
                Every site purchase, bid and sale logged here
              </li>
            </ul>
          </div>
          <AuthForms />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--w-bg)] text-[var(--w-fg)]">
      <TopBar />
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-8 md:px-6 lg:grid-cols-[240px_1fr]">
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
            <div className="mt-5 rounded-lg bg-black/30 p-3">
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
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      <footer className="border-t border-white/5 px-6 py-6 text-center text-[10px] uppercase tracking-[0.25em] text-[var(--w-muted)]">
        Aethelred Pay · Simulated wallet · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
