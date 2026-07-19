import { type ReactNode, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
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
  Copy,
  Check,
  Bell,
  Search,
  Sparkles,
  ChevronRight,
  LockKeyhole,
} from "lucide-react";
import { AuthForms } from "./AuthForms";
import { useAuthStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import useAuth from "@/hooks/useAuth";

const nav: ReadonlyArray<{
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { to: "/wallet", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/wallet/deposit", label: "Deposit", icon: ArrowDownToLine },
  { to: "/wallet/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/wallet/send", label: "Send", icon: Send },
  { to: "/wallet/activity", label: "Activity", icon: ListOrdered },
  { to: "/wallet/security", label: "Security", icon: ShieldCheck },
];

function Brand() {
  return (
    <Link to="/wallet" className="flex items-center gap-2.5">
      <motion.span
        whileHover={{ rotate: -8 }}
        transition={{ duration: 0.25 }}
        className="grid size-10 place-items-center rounded-[1rem] text-[var(--w-brand-contrast)] shadow-lg shadow-[oklch(0.62_0.18_45/0.4)]"
        style={{ background: "var(--w-brand)" }}
      >
        <WalletIcon className="size-5" strokeWidth={2.4} />
      </motion.span>
      <div className="leading-tight">
        <p className="text-base font-extrabold tracking-tight text-[var(--w-fg)]">
          Ember<span className="text-[var(--w-brand)]">Pay</span>
        </p>
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--w-muted)]">
          Aethelred wallet
        </p>
      </div>
    </Link>
  );
}

function AccountChip() {
  const { user, loggedIn } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      loggedIn: state.loggedIn,
    })),
  );
  const { logOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!user) return null;

  const initials = user.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const copyToken = () => {
    navigator.clipboard.writeText(user.token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2  rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] py-1 pl-1 pr-1 sm:pr-3 text-sm font-semibold text-[var(--w-fg)] transition hover:border-[var(--w-brand)]/50"
        type="button"
      >
        <span
          className="grid size-8 place-items-center rounded-full text-xs font-extrabold"
          style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
        >
          {initials || "A"}
        </span>
        <span className="hidden sm:inline">{user.fullName.split(" ")[0]}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.16, ease: "easeInOut" }}
              className="absolute right-0 top-12 z-20 w-72 overflow-hidden rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-surface)] shadow-2xl"
            >
              <div className="p-4">
                <p className="text-sm font-bold text-[var(--w-fg)]">{user.fullName}</p>
                <p className="text-xs text-[var(--w-muted)]">{user.email}</p>
              </div>
              <div className="border-t border-[var(--w-border)] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
                  Wallet token
                </p>
                <button
                  onClick={copyToken}
                  className="mt-1 flex w-full items-center justify-between gap-2 rounded-[1rem] bg-[var(--w-input)] px-3 py-2 text-left transition hover:bg-[var(--w-bg-2)]"
                  type="button"
                >
                  <code className="truncate font-mono text-[11px] text-[var(--w-fg)]">
                    {user.token}
                  </code>
                  {copied ? (
                    <Check className="size-3.5 shrink-0 text-[var(--w-brand)]" />
                  ) : (
                    <Copy className="size-3.5 shrink-0 text-[var(--w-muted)]" />
                  )}
                </button>
              </div>
              <Link
                className="flex w-full items-center gap-2 border-t border-[var(--w-border)] px-4 py-3 text-sm font-medium text-[var(--w-fg)] transition hover:bg-[var(--w-bg-2)]"
                to="/wallet/security"
              >
                <LockKeyhole className="size-4" />
                Account Settings
              </Link>
              <button
                onClick={logOut}
                className="flex w-full items-center gap-2 border-t border-[var(--w-border)] px-4 py-3 text-sm font-medium text-[var(--w-fg)] transition hover:bg-[var(--w-bg-2)]"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopBar({ showAccount }: { showAccount: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--w-border)] bg-[var(--w-bg)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Brand />
        <div className="flex items-center gap-2">
          {/* {showAccount && (
            <button
              className="hidden md:inline-grid size-10 place-items-center rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] text-[var(--w-muted)] transition hover:text-[var(--w-fg)]"
              aria-label="Search"
            >
              <Search className="size-4" />
            </button>
          )}
          {showAccount && (
            <button
              className="relative hidden md:inline-grid size-10 place-items-center rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] text-[var(--w-muted)] transition hover:text-[var(--w-fg)]"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[var(--w-brand)]" />
            </button>
          )} */}

          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--w-border)] bg-[var(--w-surface)] px-3 py-2 text-[11px] font-semibold text-[var(--w-fg)] transition hover:border-[var(--w-brand)]/50"
          >
            Gallery <ArrowUpRight className="size-3.5" />
          </Link>
          {showAccount && <AccountChip />}
        </div>
      </div>
    </header>
  );
}

function Ticker() {
  const items = [
    "BTC $68,420 ▲ 2.4%",
    "ETH $3,612 ▲ 1.1%",
    "USDC $1.00 ◆",
    "AET $42.18 ▲ 4.6%",
    "SOL $174 ▼ 0.8%",
    "ART-INDEX 1,240 ▲ 0.9%",
  ];
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-b border-[var(--w-border)] bg-[var(--w-bg-2)] py-2">
      <div className="flex wallet-marquee gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--w-muted)]">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--w-brand)]" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function WalletShell({ children }: { children: ReactNode }) {
  const { user, loggedIn } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      loggedIn: state.loggedIn,
    })),
  );

  const pathname = useRouterState({ select: (r) => r.location.pathname });

  if (!loggedIn || !user) {
    return (
      <>
        <TopBar showAccount={false} />
        <div className="relative">
          <div className="absolute inset-0 wallet-dotgrid opacity-30" aria-hidden />
          <div className="relative mx-auto grid w-full max-w-7xl flex-1 gap-12 px-6 py-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--w-brand)]/40 bg-[var(--w-brand-soft)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[var(--w-brand)]">
                <Sparkles className="size-3" /> New · v2
              </span>
              <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
                Spend it.
                <br />
                <span className="text-[var(--w-brand)]">Send it.</span>
                <br />
                Bid on it.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--w-muted)]">
                EmberPay is the pocket wallet for the Aethelred exhibition. One token, one tap — bid
                on auctions, buy artworks, and settle with fellow collectors instantly.
              </p>
              <ul className="mt-8 grid max-w-md gap-3 text-sm text-[var(--w-fg)]/90">
                {[
                  "Deposit, withdraw, transfer · zero fees",
                  "One token unlocks the entire gallery",
                  "Every bid, sale and purchase ledgered here",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1.5 size-1.5 rounded-full bg-[var(--w-brand)]" />
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
            <AuthForms />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar showAccount />
      <Ticker />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-10 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 flex flex-col gap-1 rounded-[1.6rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-2">
            {nav.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`group flex items-center gap-3 rounded-[1rem] px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--w-bg-2)] text-[var(--w-fg)]"
                      : "text-[var(--w-muted)] hover:bg-[var(--w-bg-2)] hover:text-[var(--w-fg)]"
                  }`}
                >
                  <span
                    className={`grid size-8 place-items-center rounded-[0.9rem] transition ${
                      active
                        ? ""
                        : "bg-[var(--w-bg-2)] text-[var(--w-fg)] group-hover:bg-[var(--w-input)]"
                    }`}
                    style={
                      active
                        ? { background: "var(--w-brand)", color: "var(--w-brand-contrast)" }
                        : undefined
                    }
                  >
                    <Icon className="size-4" strokeWidth={2.2} />
                  </span>
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="size-3.5 text-[var(--w-muted)]" />}
                </Link>
              );
            })}

            <div className="mt-3 rounded-[1.2rem] border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] p-3 text-[11px] text-[var(--w-fg)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-brand)]">
                Pro tip
              </p>
              <p className="mt-1 leading-snug text-[var(--w-muted)]">
                Tap your balance to hide it during gallery walks.
              </p>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom dock */}
      <motion.nav
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
        className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md justify-between gap-1 rounded-[1.6rem] border border-[var(--w-border)] bg-[var(--w-surface)]/95 p-1.5 pt-2.5 px-2 shadow-2xl backdrop-blur-xl lg:hidden"
      >
        {nav.slice(0, 5).map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <span key={to} className="relative flex flex-1 w-full">
              <Link
                to={to}
                className={`flex flex-1 flex-col z-20 items-center gap-1 rounded-[1rem] px-2 py-2 text-[10px] font-bold transition ${
                  active ? "" : "text-[var(--w-muted)]"
                }`}
                style={active ? { color: "var(--w-brand-contrast)" } : undefined}
              >
                <Icon className="size-4" strokeWidth={2.2} />
                {label}
              </Link>

              <motion.span
                animate={active ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                className={`inset-0 absolute rounded-[1rem] z-10 ${active && "bg-[var(--w-brand)] "}`}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
              />
            </span>
          );
        })}
      </motion.nav>
    </>
  );
}
