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
  "Iris Okafor",
  "Mateo Alvarez",
  "Yuki Tanaka",
  "Aisha Bello",
  "Lukas Berg",
  "Noor Haddad",
  "Priya Menon",
  "Diego Costa",
  "Hana Kim",
  "Marcus Reed",
  "Salome Ndlovu",
  "Theo Laurent",
  "Wren Petrova",
  "Junior Adeyemi",
  "Carla Moreno",
  "Sven Holm",
  "Lila Rashid",
  "Onyeka Eze",
  "Aria Volkov",
  "Idris Bah",
];

// Fixed epoch so SSR and client render identical timestamps (no hydration mismatch).
const EPOCH = Date.UTC(2026, 4, 30, 12, 0, 0); // 2026-05-30T12:00:00Z
function isoDaysAgo(d: number) {
  return new Date(EPOCH - d * 864e5).toISOString();
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
  {
    id: "a1",
    kind: "deposit",
    who: "Iris Okafor",
    detail: "topped up wallet",
    amount: 1200,
    at: "just now",
  },
  {
    id: "a2",
    kind: "bid",
    who: "Mateo Alvarez",
    detail: "bid on 'Quiet Tide'",
    amount: 4800,
    at: "2m",
  },
  { id: "a3", kind: "signup", who: "Wren Petrova", detail: "joined the platform", at: "6m" },
  {
    id: "a4",
    kind: "sale",
    who: "Yuki Tanaka",
    detail: "sold 'Marble Hour'",
    amount: 9200,
    at: "14m",
  },
  {
    id: "a5",
    kind: "withdraw",
    who: "Idris Bah",
    detail: "requested payout",
    amount: 540,
    at: "22m",
  },
  { id: "a6", kind: "listing", who: "Aisha Bello", detail: "listed 3 new works", at: "1h" },
  {
    id: "a7",
    kind: "bid",
    who: "Lukas Berg",
    detail: "bid on 'Untitled No. 7'",
    amount: 2300,
    at: "1h",
  },
  {
    id: "a8",
    kind: "deposit",
    who: "Noor Haddad",
    detail: "topped up wallet",
    amount: 420,
    at: "2h",
  },
  { id: "a9", kind: "sale", who: "Hana Kim", detail: "sold 'Pale Garden'", amount: 3100, at: "3h" },
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
  { label: "API", ok: true, value: "182ms" },
  { label: "Database", ok: true, value: "OK" },
  { label: "Jobs", ok: true, value: "3 queued" },
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
    timeZone: "UTC",
  });
}

/* ---------------- Per-user activity helpers ---------------- */
import { artworks as _aw } from "./artworks";

export interface UserBid {
  id: string;
  lotTitle: string;
  lotSlug: string;
  amount: number;
  status: "leading" | "outbid" | "won" | "lost";
  at: string;
}
export interface UserOrder {
  id: string;
  artworkTitle: string;
  artworkSlug: string;
  image: string;
  amount: number;
  status: "delivered" | "shipped" | "processing" | "refunded";
  at: string;
}
export interface UserFavourite {
  slug: string;
  title: string;
  artist: string;
  image: string;
  price: number;
}
export interface UserNote {
  id: string;
  author: string;
  body: string;
  at: string;
}

export function getUserActivity(userId: string) {
  const idx = adminUsers.findIndex((u) => u.id === userId);
  if (idx < 0) return null;
  const user = adminUsers[idx];
  const pick = <T>(arr: T[], n: number, offset = 0) =>
    Array.from({ length: n }, (_, i) => arr[(idx * 3 + offset + i * 2) % arr.length]);

  const bidArts = pick(_aw, 4);
  const bids: UserBid[] = bidArts.map((a, i) => ({
    id: `bid_${idx}_${i}`,
    lotTitle: a.title,
    lotSlug: a.slug,
    amount: Math.round(a.price * (0.5 + ((i + idx) % 5) * 0.1)),
    status: (["leading", "outbid", "won", "lost"] as const)[(idx + i) % 4],
    at: isoDaysAgo(((i + 1) * 2 + idx) % 20),
  }));

  const orderArts = pick(_aw, 3, 5);
  const orders: UserOrder[] = orderArts.map((a, i) => ({
    id: `ord_${idx}_${i}`,
    artworkTitle: a.title,
    artworkSlug: a.slug,
    image: a.image,
    amount: a.price,
    status: (["delivered", "shipped", "processing", "refunded"] as const)[(idx + i) % 4],
    at: isoDaysAgo(((i + 1) * 7 + idx) % 90),
  }));

  const favArts = pick(_aw, 6, 9);
  const favourites: UserFavourite[] = favArts.map((a) => ({
    slug: a.slug,
    title: a.title,
    artist: a.artist,
    image: a.image,
    price: a.price,
  }));

  const userTxs = adminTxs
    .filter((_, i) => (i + idx) % 4 !== 0)
    .slice(0, 14)
    .map((t) => ({ ...t, user: user.name, email: user.email }));

  const wallet = {
    available: user.balance,
    pending: Math.round(user.balance * 0.18),
    inEscrow: Math.round(user.balance * 0.32),
    lifetimeIn: Math.round(user.balance * 4.5),
    lifetimeOut: Math.round(user.balance * 2.1),
    feesPaid: Math.round(user.balance * 0.07),
    accountNumber: `AE-${1000 + idx}-${((idx * 7919) % 9000) + 1000}`,
    kycLevel:
      user.status === "pending"
        ? "Tier 1 · review"
        : user.status === "suspended"
          ? "Suspended"
          : "Tier 2 · verified",
    twoFactor: idx % 3 !== 0,
    devices: 1 + (idx % 3),
  };

  const series = Array.from({ length: 14 }).map((_, i) => ({
    day: `D${i + 1}`,
    balance: Math.max(
      120,
      Math.round(user.balance * (0.6 + Math.sin((i + idx) / 2) * 0.2 + (i / 14) * 0.4)),
    ),
  }));

  const notes: UserNote[] = [
    {
      id: "n1",
      author: "Avery Doss",
      body: "KYC docs verified manually. Cleared for higher withdrawal tier.",
      at: isoDaysAgo(3),
    },
    { id: "n2", author: "System", body: "Login from new device (Lisbon, PT).", at: isoDaysAgo(8) },
  ];

  return { user, bids, orders, favourites, txs: userTxs, wallet, series, notes };
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  staffId: string;
  location: string;
  lastLogin: string;
  lastPasswordReset: string;
  approvalLimit: number;
  walletReviewQueue: number;
  exhibitionFlags: number;
  twoFactor: boolean;
  trustedDevices: number;
  teams: string[];
  permissions: string[];
  avatar: string;
}

export interface AdminCryptoWallet {
  id: string;
  label: string;
  asset: string;
  network: string;
  address: string;
  provider?: string;
  memo?: string;
  fileName?: string;
  status: "active" | "review";
  addedAt: string;
}

export const adminProfile: AdminProfile = {
  name: "Avery Doss",
  email: "avery.doss@aethelred.art",
  role: "Super admin",
  staffId: "ADM-014",
  location: "London, UK",
  lastLogin: isoDaysAgo(1),
  lastPasswordReset: isoDaysAgo(19),
  approvalLimit: 250000,
  walletReviewQueue: 12,
  exhibitionFlags: 4,
  twoFactor: true,
  trustedDevices: 3,
  teams: ["Exhibition ops", "Wallet risk", "Content governance"],
  permissions: [
    "Approve withdrawals",
    "Release escrow",
    "Suspend accounts",
    "Override exhibition lots",
    "Publish editorial blocks",
    "Review flagged bids",
  ],
  avatar: "#e8d48a",
};

export const adminCryptoWallets: AdminCryptoWallet[] = [
  {
    id: "cw_1",
    label: "Treasury settlement wallet",
    asset: "USDT",
    network: "Ethereum",
    address: "0x84f8c2c51fc9a1c8b1d3f9c15a7258bd2b3102ad",
    provider: "Fireblocks",
    memo: "Primary ops rail",
    fileName: "treasury-wallet-proof.pdf",
    status: "active",
    addedAt: isoDaysAgo(14),
  },
  {
    id: "cw_2",
    label: "Collector payout reserve",
    asset: "BTC",
    network: "Bitcoin",
    address: "bc1q3mzun7f2r6vw7sj8ec0k5p4u0w86wsd5u9e4vh",
    provider: "Ledger Enterprise",
    status: "review",
    addedAt: isoDaysAgo(5),
  },
];
