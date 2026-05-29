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
  Sun,
  Moon,
  Copy,
} from "lucide-react";
import { useState } from "react";
import { useWallet, formatMoney } from "@/lib/wallet";
import { useWalletTheme } from "@/lib/wallet-theme";
import { AuthForms } from "./AuthForms";

const nav = [
  { to: "/wallet", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/wallet/deposit", label: "Deposit", icon: ArrowDownToLine },
  { to: "/wallet/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/wallet/send", label: "Send", icon: Send },
  { to: "/wallet/activity", label: "Activity", icon: ListOrdered },
  { to: "/wallet/security", label: "Security", icon: ShieldCheck },
];

function ThemeToggle() {
  const { mode, toggle } = useWalletTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-grid size-10 place-items-center rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] text-[var(--w-fg)] transition hover:scale-105"
    >
      {mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

function Brand() {
  return (
    <Link to="/wallet" className="flex items-center gap-2.5">
      <span
        className="grid size-10 place-items-center rounded-2xl text-white shadow-lg"
        style={{ background: "var(--w-grad-brand)" }}
      >
        <WalletIcon className="size-5" strokeWidth={2} />
      </span>
      <div className="leading-tight">
        <p className="text-base font-bold tracking-tight text-[var(--w-fg)]">
          Aethelred Pay
        </p>
        <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[var(--w-muted)]">
          Pocket wallet · v1.0
        </p>
      </div>
    </Link>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--w-border)] bg-[var(--w-bg)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Brand />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] px-3 py-2 text-[11px] font-medium text-[var(--w-fg)] transition hover:scale-105"
          >
            Gallery <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function AccountChip() {
  const { currentAccount, signOut } = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!currentAccount) return null;

  const initials = currentAccount.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const copyToken = () => {
    navigator.clipboard.writeText(currentAccount.token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] py-1 pl-1 pr-3 text-sm font-medium text-[var(--w-fg)] transition hover:scale-105"
      >
        <span
          className="grid size-8 place-items-center rounded-full text-xs font-bold text-white"
          style={{ background: "var(--w-grad-brand)" }}
        >
          {initials || "A"}
        </span>
        <span className="hidden sm:inline">{currentAccount.name.split(" ")[0]}</span>
      </button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-12 z-20 w-72 overflow-hidden rounded-2xl border border-[var(--w-border)] bg-[var(--w-surface)] shadow-2xl">
            <div className="p-4">
              <p className="text-sm font-semibold text-[var(--w-fg)]">{currentAccount.name}</p>
              <p className="text-xs text-[var(--w-muted)]">{currentAccount.email}</p>
            </div>
            <div className="border-t border-[var(--w-border)] p-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--w-muted)]">
                Wallet token
              </p>
              <button
                onClick={copyToken}
                className="mt-1 flex w-full items-center justify-between gap-2 rounded-lg bg-[var(--w-input)] px-3 py-2 text-left transition hover:bg-[var(--w-bg-2)]"
              >
                <code className="truncate font-mono text-[11px] text-[var(--w-fg)]">
                  {currentAccount.token}
                </code>
                <Copy className="size-3.5 shrink-0 text-[var(--w-muted)]" />
              </button>
              {copied && (
                <p className="mt-1 text-[10px] text-[var(--w-brand-1)]">Copied!</p>
              )}
            </div>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-2 border-t border-[var(--w-border)] px-4 py-3 text-sm text-[var(--w-fg)] transition hover:bg-[var(--w-bg-2)]"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function WalletShell({ children }: { children: ReactNode }) {
  const { signedIn, currentAccount } = useWallet();
  const { mode } = useWalletTheme();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const themeClass = mode === "light" ? "wallet-light" : "";

  if (!signedIn || !currentAccount) {
    return (
      <div className={`${themeClass} flex min-h-screen flex-col bg-[var(--w-bg)] text-[var(--w-fg)]`}>
        <TopBar />
        <div className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-6 py-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
          <div>
            <span
              className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white"
              style={{ background: "var(--w-grad-brand)" }}
            >
              New
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Your money,
              <br />
              <span className="wallet-grad-text">in your pocket.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--w-muted)]">
              Aethelred Pay is a standalone wallet built for the exhibition.
              Create one to deposit, send, and receive — then paste your token
              on the gallery to bid, buy, and sell instantly.
            </p>
            <ul className="mt-8 grid max-w-md gap-3 text-sm text-[var(--w-fg)]/90">
              {[
                "Deposit, withdraw, and transfer between members",
                "One token unlocks the entire exhibition site",
                "Every purchase, bid and sale logged here",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 size-2 rounded-full"
                    style={{ background: "var(--w-grad-brand)" }}
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <AuthForms />
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClass} flex min-h-screen flex-col bg-[var(--w-bg)] text-[var(--w-fg)]`}>
      <header className="sticky top-0 z-40 border-b border-[var(--w-border)] bg-[var(--w-bg)]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Brand />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] px-3 py-2 text-[11px] font-medium text-[var(--w-fg)] transition hover:scale-105"
            >
              Gallery <ArrowUpRight className="size-3.5" />
            </Link>
            <AccountChip />
          </div>
        </div>
      </header>

      {/* Desktop sidebar + content */}
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 flex flex-col gap-1 rounded-2xl border border-[var(--w-border)] bg-[var(--w-surface)] p-2">
            {nav.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--w-bg-2)] text-[var(--w-fg)]"
                      : "text-[var(--w-muted)] hover:bg-[var(--w-bg-2)] hover:text-[var(--w-fg)]"
                  }`}
                >
                  <span
                    className={`grid size-8 place-items-center rounded-lg ${
                      active ? "text-white" : "bg-[var(--w-bg-2)] text-[var(--w-fg)]"
                    }`}
                    style={active ? { background: "var(--w-grad-brand)" } : undefined}
                  >
                    <Icon className="size-4" strokeWidth={2} />
                  </span>
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      {/* Mobile bottom dock */}
      <nav className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md justify-between gap-1 rounded-2xl border border-[var(--w-border)] bg-[var(--w-surface)]/95 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden">
        {nav.slice(0, 5).map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium transition ${
                active ? "text-white" : "text-[var(--w-muted)]"
              }`}
              style={active ? { background: "var(--w-grad-brand)" } : undefined}
            >
              <Icon className="size-4" strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <footer className="hidden border-t border-[var(--w-border)] px-6 py-6 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--w-muted)] md:block">
        Aethelred Pay · Simulated wallet · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
