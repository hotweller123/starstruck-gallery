import { type ReactNode, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Palette,
  Wallet,
  Users,
  Search,
  Bell,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  Shield,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/exhibition", label: "Exhibition", icon: Palette },
  { to: "/admin/wallet", label: "Wallet ops", icon: Wallet },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/account", label: "Account", icon: UserCircle },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full text-[var(--a-fg)]">
      {/* Desktop sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-[var(--a-border)] bg-[var(--a-bg-2)] md:block md:sticky md:top-0 md:h-screen md:overflow-y-auto md:overflow-x-hidden ${
          collapsed ? "md:w-[68px]" : "md:w-[244px]"
        } transition-[width] duration-200`}
      >
        <SidebarInner
          collapsed={collapsed}
          pathname={pathname}
          onToggle={() => setCollapsed((v) => !v)}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-[244px] border-r border-[var(--a-border)] bg-[var(--a-bg-2)] md:hidden"
            >
              <SidebarInner
                collapsed={false}
                pathname={pathname}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto a-scrollbar bg-[var(--a-bg)] px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarInner({
  collapsed,
  pathname,
  onToggle,
  onClose,
}: {
  collapsed: boolean;
  pathname: string;
  onToggle?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col relative">
      {onToggle && (
        <button
          onClick={onToggle}
          className="hidden absolute top-1/2 -right-1 bg-[var(--a-accent)] z-10 size-7 place-items-center  text-[var(--a-muted)] group text-slate-800 md:grid rounded-full rounded-r-none"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronsRight className="size-4.5 group-hover:size-5 transistion-all duration-300" />
          ) : (
            <ChevronsLeft className="size-4.5 group-hover:size-5 transistion-all duration-300" />
          )}
        </button>
      )}

      <div className="flex h-[60px]  items-center justify-between border-b border-[var(--a-border)] px-4">
        <Link to="/admin" className="flex items-center gap-2 min-w-0">
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[var(--a-accent)] text-[var(--a-accent-ink)]">
            <Shield className="size-4" strokeWidth={2.4} />
          </span>
          {!collapsed && (
            <span className="truncate font-display text-sm font-extrabold tracking-tight">
              Aethelred · Console
            </span>
          )}
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface)]"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto a-scrollbar px-2 py-3">
        {!collapsed && <p className="a-eyebrow px-3 pb-2 pt-1">Workspace</p>}
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-[var(--a-surface)] text-[var(--a-fg)]"
                      : "text-[var(--a-muted)] hover:bg-[var(--a-surface)]/60 hover:text-[var(--a-fg)]"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r bg-[var(--a-accent)]" />
                  )}
                  <Icon className="size-4 shrink-0" strokeWidth={2} />
                  {!collapsed && <span className="truncate font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--a-border)] p-3">
        {!collapsed ? (
          <div className="rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[var(--a-warn)] a-live" />
              <p className="text-[11px] font-semibold text-[var(--a-fg-2)]">Mock data mode</p>
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-[var(--a-muted)]">
              No backend connected. All writes are in-memory.
            </p>
          </div>
        ) : (
          <span className="mx-auto block size-2 rounded-full bg-[var(--a-warn)] a-live" />
        )}
      </div>
    </div>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-[var(--a-border)] bg-[var(--a-bg)]/85 px-4 backdrop-blur md:px-8">
      <button
        onClick={onMenu}
        className="grid size-9 place-items-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface)] md:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--a-faint)]" />
        <input
          placeholder="Search artworks, users, tx id…"
          className="h-9 w-full rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]"
        />
      </div>
      <div className="flex-1 " />

      <span className="hidden items-center gap-1.5 rounded-full border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-muted)] sm:inline-flex">
        <span className="size-1.5 rounded-full bg-[var(--a-warn)] a-live" /> Mock env
      </span>

      <button className="relative grid size-9 place-items-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-fg)]">
        <Bell className="size-4" />
        <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[var(--a-accent)]" />
      </button>

      <div className="flex items-center gap-2 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] py-1 pl-1 pr-3">
        <span className="grid size-7 place-items-center rounded bg-[var(--a-accent)] text-[11px] font-bold text-[var(--a-accent-ink)]">
          AD
        </span>
        <div className="hidden text-left leading-tight sm:block">
          <p className="text-[11px] font-semibold text-[var(--a-fg)]">Avery Doss</p>
          <p className="text-[10px] text-[var(--a-muted)]">Super admin</p>
        </div>
      </div>
    </header>
  );
}
