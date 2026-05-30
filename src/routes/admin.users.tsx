import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, UserPlus, Shield, ChevronRight } from "lucide-react";
import { DataTable, SectionHeader, StatusChip } from "@/components/admin/primitives";
import {
  adminUsers as seedUsers,
  fmtDateTime,
  fmtMoney,
  type UserRole,
  type AdminUser,
} from "@/data/admin-mock";

export const Route = createFileRoute("/admin/users")({
  component: UsersAdmin,
});

function UsersAdmin() {
  const [users, setUsers] = useState<AdminUser[]>(seedUsers);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"all" | UserRole>("all");

  const rows = users
    .filter((u) => role === "all" || u.role === role)
    .filter(
      (u) =>
        !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q.toLowerCase()),
    );

  const counts = {
    admin: users.filter((u) => u.role === "admin").length,
    moderator: users.filter((u) => u.role === "moderator").length,
    user: users.filter((u) => u.role === "user").length,
  };

  function setUserRole(id: string, next: UserRole) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: next } : u)));
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <SectionHeader
        title="Users & roles"
        description="Manage platform identities and access. Role changes update mock state in-session."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]">
            <UserPlus className="size-3.5" /> Invite user
          </button>
        }
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        <RoleCard label="Admins" count={counts.admin} />
        <RoleCard label="Moderators" count={counts.moderator} />
        <RoleCard label="Members" count={counts.user} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] p-0.5">
          {(["all", "admin", "moderator", "user"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`rounded px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                role === r
                  ? "bg-[var(--a-bg-2)] text-[var(--a-fg)]"
                  : "text-[var(--a-muted)] hover:text-[var(--a-fg)]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--a-faint)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users…"
            className="h-9 w-64 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]"
          />
        </div>
      </div>

      <DataTable
        rows={rows}
        getRowLink={(u) => ({ to: "/admin/users/$id", params: { id: u.id } })}
        columns={[
          {
            key: "user",
            header: "User",
            render: (u) => (
              <div className="flex items-center gap-2.5">
                <span
                  className="grid size-9 place-items-center rounded-md text-[11px] font-bold text-[var(--a-accent-ink)] shadow"
                  style={{ background: u.avatar }}
                >
                  {u.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div>
                  <p className="text-xs font-semibold text-[var(--a-fg)]">{u.name}</p>
                  <p className="a-mono text-[10px] text-[var(--a-muted)]">{u.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: "role",
            header: "Role",
            rowLink: false,
            render: (u) => (
              <select
                value={u.role}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  setUserRole(u.id, e.target.value as UserRole);
                }}
                className="rounded-md border border-[var(--a-border)] bg-[var(--a-input)] px-2 py-1 text-xs text-[var(--a-fg)] focus:border-[var(--a-border-hi)]"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            ),
          },
          { key: "status", header: "Status", render: (u) => <StatusChip value={u.status} /> },
          {
            key: "bal",
            header: "Balance",
            render: (u) => (
              <span className="a-mono text-xs font-bold text-[var(--a-fg)]">
                {fmtMoney(u.balance)}
              </span>
            ),
          },
          {
            key: "joined",
            header: "Joined",
            render: (u) => (
              <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(u.joined)}</span>
            ),
          },
          {
            key: "last",
            header: "Last seen",
            render: (u) => (
              <span className="text-xs text-[var(--a-muted)]">{fmtDateTime(u.lastSeen)}</span>
            ),
          },
          {
            key: "view",
            header: "",
            rowLink: false,
            className: "w-[60px] text-right",
            render: (u) => (
              <Link
                to="/admin/users/$id"
                params={{ id: u.id }}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--a-border)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-fg)]"
              >
                View <ChevronRight className="size-3" />
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}

function RoleCard({ label, count }: { label: string; count: number }) {
  return (
    <div className="a-card flex items-center justify-between p-4">
      <div>
        <p className="a-eyebrow">{label}</p>
        <p className="font-display mt-1 text-2xl font-extrabold text-[var(--a-fg)]">{count}</p>
      </div>
      <span className="grid size-9 place-items-center rounded-md bg-[var(--a-surface-2)] text-[var(--a-accent)]">
        <Shield className="size-4" />
      </span>
    </div>
  );
}
