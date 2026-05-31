import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Wallet as WalletIcon,
  Plus,
  Copy,
  Trash2,
  X,
  Check,
  Pencil,
} from "lucide-react";
import { BentoCard } from "@/components/admin/primitives";
import { RecordSheet, type FieldDef } from "@/components/admin/RecordSheet";

export const Route = createFileRoute("/admin/account")({
  component: AdminAccountPage,
});

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  joined: string;
  bio: string;
  timezone: string;
  twoFactor: string;
}

interface CryptoWallet {
  id: string;
  label: string;
  network: "Bitcoin" | "Ethereum" | "Solana" | "Tron" | "BNB" | "Polygon";
  address: string;
  memo?: string;
  isDefault: boolean;
  createdAt: string;
}

const initialProfile: AdminProfile = {
  id: "adm_001",
  name: "Avery Doss",
  email: "avery.doss@aethelred.art",
  phone: "+1 (415) 555-0142",
  role: "Super Administrator",
  location: "San Francisco, CA",
  joined: "2024-03-12",
  bio: "Operations lead. Owns exhibition curation, wallet reconciliation and platform health.",
  timezone: "America/Los_Angeles",
  twoFactor: "Authenticator app",
};

const initialWallets: CryptoWallet[] = [
  {
    id: "wal_btc_01",
    label: "Treasury — BTC cold",
    network: "Bitcoin",
    address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    isDefault: true,
    createdAt: "2025-09-12",
  },
  {
    id: "wal_eth_01",
    label: "Operations — ETH hot",
    network: "Ethereum",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    memo: "Gas wallet for payouts",
    isDefault: false,
    createdAt: "2025-11-03",
  },
];

const NETWORKS: CryptoWallet["network"][] = [
  "Bitcoin",
  "Ethereum",
  "Solana",
  "Tron",
  "BNB",
  "Polygon",
];

function AdminAccountPage() {
  const [profile, setProfile] = useState<AdminProfile>(initialProfile);
  const [wallets, setWallets] = useState<CryptoWallet[]>(initialWallets);
  const [profileOpen, setProfileOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [activeWallet, setActiveWallet] = useState<CryptoWallet | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const profileFields: FieldDef<AdminProfile>[] = [
    { key: "name", label: "Full name", editable: true },
    { key: "email", label: "Email", editable: true },
    { key: "phone", label: "Phone", editable: true },
    {
      key: "role",
      label: "Role",
      kind: "select",
      options: [
        { value: "Super Administrator", label: "Super Administrator" },
        { value: "Administrator", label: "Administrator" },
        { value: "Moderator", label: "Moderator" },
      ],
    },
    { key: "location", label: "Location", editable: true },
    { key: "timezone", label: "Timezone", editable: true },
    { key: "twoFactor", label: "Two-factor", editable: true },
    { key: "bio", label: "Bio", kind: "textarea", editable: true, span: 2 },
    { key: "joined", label: "Joined", kind: "readonly" },
    { key: "id", label: "Admin ID", kind: "readonly" },
  ];

  function copy(addr: string) {
    navigator.clipboard?.writeText(addr).then(() => {
      setCopied(addr);
      setTimeout(() => setCopied(null), 1400);
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">

        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="a-eyebrow">Admin · Account</p>
            <h1 className="font-display mt-1 text-3xl font-extrabold tracking-tight text-[var(--a-fg)] md:text-4xl">
              Account & crypto wallets
            </h1>
            <p className="mt-1 text-sm text-[var(--a-muted)]">
              Manage your administrator profile and the treasury wallets used for platform payouts.
            </p>
          </div>
          <button
            onClick={() => setProfileOpen(true)}
            className="inline-flex items-center gap-1.5 self-start rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-2 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)] md:self-auto"
          >
            <Pencil className="size-3.5" /> Edit profile
          </button>
        </header>

        {/* Profile card */}
        <BentoCard eyebrow="Identity" title="Administrator profile">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-[var(--a-accent)] text-2xl font-black text-[var(--a-accent-ink)]">
              {profile.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-extrabold tracking-tight text-[var(--a-fg)]">
                  {profile.name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]">
                  <Shield className="size-3" /> {profile.role}
                </span>
              </div>
              <p className="mt-2 max-w-prose text-sm text-[var(--a-muted)]">{profile.bio}</p>
              <dl className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <InfoRow icon={Mail} label="Email" value={profile.email} />
                <InfoRow icon={Phone} label="Phone" value={profile.phone} />
                <InfoRow icon={MapPin} label="Location" value={profile.location} />
                <InfoRow icon={Calendar} label="Joined" value={profile.joined} />
              </dl>
            </div>
          </div>
        </BentoCard>

        {/* Wallets */}
        <BentoCard
          eyebrow="Treasury"
          title="Crypto wallets"
          action={
            <button
              onClick={() => {
                setActiveWallet(null);
                setWalletModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
            >
              <Plus className="size-3.5" /> Upload wallet
            </button>
          }
        >
          {wallets.length === 0 ? (
            <EmptyWallets onAdd={() => setWalletModalOpen(true)} />
          ) : (
            <ul className="space-y-3">
              {wallets.map((w) => (
                <li
                  key={w.id}
                  className="group rounded-lg border border-[var(--a-border)] bg-[var(--a-bg-2)] p-4 transition hover:border-[var(--a-border-hi)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[var(--a-surface)] text-[var(--a-fg-2)]">
                          <WalletIcon className="size-3.5" />
                        </span>
                        <h4 className="truncate text-sm font-bold text-[var(--a-fg)]">
                          {w.label}
                        </h4>
                        {w.isDefault && (
                          <span className="rounded-full border border-[var(--a-pos)]/30 bg-[var(--a-pos)]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-pos)]">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--a-muted)]">
                        {w.network} · added {w.createdAt}
                      </p>
                      <p className="mt-2 break-all rounded-md border border-[var(--a-border)] bg-[var(--a-bg)] px-3 py-1.5 font-mono text-xs text-[var(--a-fg-2)]">
                        {w.address}
                      </p>
                      {w.memo && (
                        <p className="mt-1.5 text-[11px] text-[var(--a-muted)]">Memo: {w.memo}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => copy(w.address)}
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]"
                      >
                        {copied === w.address ? (
                          <>
                            <Check className="size-3" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" /> Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setActiveWallet(w);
                          setWalletModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]"
                      >
                        <Pencil className="size-3" /> Edit
                      </button>
                      {!w.isDefault && (
                        <button
                          onClick={() =>
                            setWallets((prev) =>
                              prev.map((x) => ({ ...x, isDefault: x.id === w.id })),
                            )
                          }
                          className="rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]"
                        >
                          Set default
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (!confirm(`Remove wallet ${w.label}?`)) return;
                          setWallets((prev) => prev.filter((x) => x.id !== w.id));
                        }}
                        className="grid size-7 place-items-center rounded-md border border-[var(--a-neg)]/30 bg-[var(--a-neg)]/10 text-[var(--a-neg)] hover:bg-[var(--a-neg)]/20"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </BentoCard>
      </div>

      {/* Profile edit sheet */}
      <RecordSheet
        open={profileOpen}
        onOpenChange={setProfileOpen}
        eyebrow="Administrator"
        title={profile.name}
        subtitle={profile.role}
        record={profile}
        fields={profileFields}
        onSave={(patch) => setProfile((p) => ({ ...p, ...patch }))}
      />

      {/* Wallet upload / edit modal */}
      <WalletFormModal
        open={walletModalOpen}
        onOpenChange={setWalletModalOpen}
        initial={activeWallet}
        onSubmit={(data) => {
          if (activeWallet) {
            setWallets((prev) =>
              prev.map((w) =>
                w.id === activeWallet.id ? { ...w, ...data } : data.isDefault ? { ...w, isDefault: false } : w,
              ),
            );
          } else {
            const id = `wal_${Date.now().toString(36)}`;
            setWallets((prev) => {
              const next = data.isDefault ? prev.map((w) => ({ ...w, isDefault: false })) : prev;
              return [
                ...next,
                {
                  ...data,
                  id,
                  createdAt: new Date().toISOString().slice(0, 10),
                },
              ];
            });
          }
          setWalletModalOpen(false);
          setActiveWallet(null);
        }}
      />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] px-3 py-2">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-[var(--a-muted)]" />
      <div className="min-w-0">
        <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--a-muted)]">
          {label}
        </dt>
        <dd className="truncate text-xs text-[var(--a-fg)]">{value}</dd>
      </div>
    </div>
  );
}

function EmptyWallets({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-[var(--a-border)] px-6 py-12 text-center">
      <WalletIcon className="size-8 text-[var(--a-muted)]" />
      <p className="mt-3 text-sm font-semibold text-[var(--a-fg)]">No wallets yet</p>
      <p className="mt-1 max-w-sm text-xs text-[var(--a-muted)]">
        Upload your first crypto wallet to receive treasury settlements and payouts.
      </p>
      <button
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
      >
        <Plus className="size-3.5" /> Upload wallet
      </button>
    </div>
  );
}

/* ------------ Wallet form modal (fullscreen on mobile) ------------ */
function WalletFormModal({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: CryptoWallet | null;
  onSubmit: (data: Omit<CryptoWallet, "id" | "createdAt">) => void;
}) {
  const [label, setLabel] = useState("");
  const [network, setNetwork] = useState<CryptoWallet["network"]>("Bitcoin");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sync when modal opens
  useStateSync(open, () => {
    setLabel(initial?.label ?? "");
    setNetwork(initial?.network ?? "Bitcoin");
    setAddress(initial?.address ?? "");
    setMemo(initial?.memo ?? "");
    setIsDefault(initial?.isDefault ?? false);
    setError(null);
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedLabel = label.trim();
    const trimmedAddr = address.trim();
    if (!trimmedLabel) return setError("Label is required.");
    if (trimmedLabel.length > 80) return setError("Label too long (max 80).");
    if (!trimmedAddr) return setError("Wallet address is required.");
    if (trimmedAddr.length < 12 || trimmedAddr.length > 120)
      return setError("Address looks invalid (12–120 chars).");
    onSubmit({
      label: trimmedLabel,
      network,
      address: trimmedAddr,
      memo: memo.trim() || undefined,
      isDefault,
    });
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="admin-theme fixed inset-0 z-50 flex flex-col bg-[#0f0f10] text-[var(--a-fg)] md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[88vh] md:w-[min(560px,94vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:border md:border-[var(--a-border-hi)] md:shadow-2xl"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[var(--a-border)] px-5 py-4 md:px-6">
                  <div>
                    <p className="a-eyebrow">Treasury</p>
                    <DialogPrimitive.Title className="font-display mt-0.5 text-xl font-extrabold tracking-tight md:text-2xl">
                      {initial ? "Edit crypto wallet" : "Upload crypto wallet"}
                    </DialogPrimitive.Title>
                  </div>
                  <DialogPrimitive.Close
                    className="grid size-8 place-items-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-surface)] hover:text-[var(--a-fg)]"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </DialogPrimitive.Close>
                </div>

                <form
                  onSubmit={submit}
                  className="flex flex-1 flex-col overflow-hidden"
                >
                  <div className="flex-1 space-y-4 overflow-y-auto a-scrollbar px-5 py-5 md:px-6">
                    <Field label="Label">
                      <input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g. Treasury — BTC cold"
                        maxLength={80}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Network">
                      <select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value as CryptoWallet["network"])}
                        className={inputCls}
                      >
                        {NETWORKS.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Wallet address">
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Paste full address"
                        maxLength={120}
                        className={`${inputCls} font-mono text-xs`}
                      />
                    </Field>
                    <Field label="Memo / tag (optional)">
                      <input
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="Internal note"
                        maxLength={120}
                        className={inputCls}
                      />
                    </Field>
                    <label className="flex items-center gap-2 text-sm text-[var(--a-fg-2)]">
                      <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                        className="size-4 accent-[var(--a-accent)]"
                      />
                      Set as default payout wallet
                    </label>
                    {error && (
                      <p className="rounded-md border border-[var(--a-neg)]/30 bg-[var(--a-neg)]/10 px-3 py-2 text-xs font-semibold text-[var(--a-neg)]">
                        {error}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t border-[var(--a-border)] bg-[var(--a-bg-2)] px-5 py-3 md:px-6">
                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
                    >
                      {initial ? "Save changes" : "Upload wallet"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

const inputCls =
  "w-full rounded-md border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-sm text-[var(--a-fg)] outline-none focus:border-[var(--a-border-hi)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="a-eyebrow mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

/* run a setup fn whenever `open` flips to true */
function useStateSync(open: boolean, fn: () => void) {
  const ran = useRef(false);
  useEffect(() => {
    if (open && !ran.current) {
      fn();
      ran.current = true;
    }
    if (!open) ran.current = false;
  }, [open, fn]);
}
