// Deterministic mock data for the admin console.

export type UserRole = "admin" | "moderator" | "user";
export type UserStatus = "active" | "pending" | "suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string; // ISO
  lastSeen: string; // ISO
  balance: number;
  avatar: string; // initials color
}

export type TxKind = "deposit" | "withdraw" | "transfer" | "purchase" | "sale";
export type TxStatus = "completed" | "pending" | "failed" | "review";

export interface AdminTx {
  id: string;
  user: string;
  email: string;
  type: TxKind;
  amount: number;
  status: TxStatus;
  method: string;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  kind: "deposit" | "bid" | "signup" | "withdraw" | "sale" | "listing";
  who: string;
  detail: string;
  amount?: number;
  at: string; // relative
}

const seedNames = [
  "Iris Okafor", "Mateo Alvarez", "Yuki Tanaka", "Aisha Bello", "Lukas Berg",
  "Noor Haddad", "Priya Menon", "Diego Costa", "Hana Kim", "Marcus Reed",
  "Salome Ndlovu", "Theo Laurent", "Wren Petrova", "Junior Adeyemi", "Carla Moreno",
  "Sven Holm", "Lila Rashid", "Onyeka Eze", "Aria Volkov", "Idris Bah",
];

function isoDaysAgo(d: number) {
  return new Date(Date.now() - d * 864e5).toISOString();
}

export const adminUsers: AdminUser[] = seedNames.map((name, i) => {
  const role: UserRole = i === 0 ? "admin" : i < 4 ? "moderator" : "user";
  const status: UserStatus = i % 11 === 0 ? "suspended" : i % 7 === 0 ? "pending" : "active";
  return {
    id: `usr_${1000 + i}`,
    name,
    email: name.toLowerCase().replace(/[^a-z]+/g, ".") + "@aethelred.art",
    role,
    status,
    joined: isoDaysAgo(180 - i * 7),
    lastSeen: isoDaysAgo((i * 3) % 30),
    balance: Math.round(((i * 137) % 9000) + 250),
    avatar: ["#f5d76e", "#7dd3fc", "#fda4af", "#86efac", "#c4b5fd"][i % 5],
  };
});

const txKinds: TxKind[] = ["deposit", "withdraw", "transfer", "purchase", "sale"];
const methods = ["Card", "Bank transfer", "Apple Pay", "Wallet", "SWIFT"];
const statuses: TxStatus[] = ["completed", "completed", "completed", "pending", "review", "failed"];

export const adminTxs: AdminTx[] = Array.from({ length: 48 }).map((_, i) => {
  const u = adminUsers[i % adminUsers.length];
  return {
    id: `tx_${5000 + i}`,
    user: u.name,
    email: u.email,
    type: txKinds[i % txKinds.length],
    amount: Math.round(((i * 73) % 4200) + 35),
    status: statuses[i % statuses.length],
    method: methods[i % methods.length],
    createdAt: isoDaysAgo((i * 0.7) % 30),
  };
});

export const adminActivity: ActivityEvent[] = [
  { id: "a1", kind: "deposit",  who: "Iris Okafor",   detail: "topped up wallet",          amount: 1200, at: "just now" },
  { id: "a2", kind: "bid",      who: "Mateo Alvarez", detail: "bid on 'Quiet Tide'",        amount: 4800, at: "2m" },
  { id: "a3", kind: "signup",   who: "Wren Petrova",  detail: "joined the platform",                       at: "6m" },
  { id: "a4", kind: "sale",     who: "Yuki Tanaka",   detail: "sold 'Marble Hour'",         amount: 9200, at: "14m" },
  { id: "a5", kind: "withdraw", who: "Idris Bah",     detail: "requested payout",           amount: 540,  at: "22m" },
  { id: "a6", kind: "listing",  who: "Aisha Bello",   detail: "listed 3 new works",                       at: "1h" },
  { id: "a7", kind: "bid",      who: "Lukas Berg",    detail: "bid on 'Untitled No. 7'",    amount: 2300, at: "1h" },
  { id: "a8", kind: "deposit",  who: "Noor Haddad",   detail: "topped up wallet",           amount: 420,  at: "2h" },
  { id: "a9", kind: "sale",     who: "Hana Kim",      detail: "sold 'Pale Garden'",         amount: 3100, at: "3h" },
];

// 30-day revenue & volume series
export const revenueSeries = Array.from({ length: 30 }).map((_, i) => {
  const base = 1800 + Math.sin(i / 3) * 600;
  const noise = ((i * 53) % 400) - 200;
  return {
    day: `D${i + 1}`,
    revenue: Math.max(400, Math.round(base + noise)),
    volume: Math.max(900, Math.round(base * 1.7 + noise * 2)),
  };
});

export const trafficSeries = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  visits: 800 + ((i * 137) % 900),
  bids: 30 + ((i * 17) % 80),
}));

export const overviewKpis = {
  revenue: { value: 184250, delta: 12.4 },
  volume24h: { value: 92140, delta: -3.1 },
  activeAuctions: { value: 27, delta: 6.0 },
  newUsers: { value: 318, delta: 8.2 },
};

export const systemHealth = [
  { label: "API",      ok: true,  value: "182ms" },
  { label: "Database", ok: true,  value: "OK" },
  { label: "Jobs",     ok: true,  value: "3 queued" },
  { label: "Webhooks", ok: false, value: "1 failing" },
];

export const pendingKyc = adminUsers
  .filter((u) => u.status === "pending")
  .slice(0, 5)
  .map((u) => ({ id: u.id, name: u.name, email: u.email, submitted: "2d ago" }));

export const pendingWithdrawals = adminTxs
  .filter((t) => t.type === "withdraw" && t.status === "pending")
  .slice(0, 6);

export function fmtMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
