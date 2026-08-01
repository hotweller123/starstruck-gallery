import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Key,
} from "lucide-react";
import { BentoCard } from "@/components/admin/primitives";
import { RecordSheet, type FieldDef } from "@/components/admin/RecordSheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore, useDataStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import { AdminWallet } from "@/types";
import { fmtDateTime } from "@/data/admin-mock";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useDoc from "@/hooks/useDoc";
import { copyClipboard, photoFN } from "@/utils";
import { toast } from "@/lib/useToast";

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
  const { user } = useAuthStore();
  const { wallets, setState } = useDataStore(
    useShallow((s) => ({
      wallets: s.wallets,
      setState: s.setState,
    })),
  );

  console.log({ wallets });

  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [activeWallet, setActiveWallet] = useState<AdminWallet | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const startLoad = (loading: boolean, msg: string) => {
    setLoading(true);
    setLoadingText(msg);
  };

  const stopLoad = () => {
    setLoading(false);
    setLoadingText("");
  };

  function copy(addr: string) {
    setCopied(addr);
    setTimeout(() => setCopied(null), 1400);

    copyClipboard(addr);
  }

  const { addDocToCollection, updateDocument, deleteDocument } = useDoc();

  if (!user) {
    return (
      <AdminLoader
        fullscreen
        variant="page"
        message="Loading profile"
        subMessage="Preparing admin account"
      />
    );
  }

  return (
    <>
      <AdminLoader isLoading={loading} fullscreen message={loadingText} variant="action" />

      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="a-eyebrow">Admin · Account</p>
            <h1 className="font-display mt-1 text-3xl font-extrabold tracking-tight text-[var(--a-fg)] md:text-4xl">
              Account & crypto wallets
            </h1>
            <p className="mt-1 text-sm text-[var(--a-muted)]">
              Manage your administrator Profile and the treasury wallets used for platform payouts.
            </p>
          </div>
          {/* <button
            onClick={() => setProfileOpen(true)}
            className="inline-flex items-center gap-1.5 self-start rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-2 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)] md:self-auto"
          >
            <Pencil className="size-3.5" /> Edit Profile
          </button> */}
        </header>

        {/* Profile card */}
        <BentoCard eyebrow="Identity" title="Administrator Profile">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div
              className="grid size-20 shrink-0 place-items-center rounded-xl bg-[var(--a-accent)] text-2xl font-black text-[var(--a-accent-ink)]"
              onClick={() =>
                setState({
                  wallets: [],
                })
              }
            >
              {user?.fullName
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-extrabold tracking-tight text-[var(--a-fg)]">
                  {user?.fullName}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]">
                  <Shield className="size-3" /> Super Administrator
                </span>
              </div>
              {/* <p className="mt-2 max-w-prose text-sm text-[var(--a-muted)]">{user.bio}</p> */}
              <dl className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <InfoRow icon={Mail} label="Email" value={user.email} />
                <InfoRow icon={Key} label="Password" value={user.password} />
                {/* <InfoRow icon={Phone} label="Phone" value={user.phone} />
                <InfoRow icon={MapPin} label="Location" value={user.location} /> */}
                <InfoRow icon={Calendar} label="Joined" value={user.joinedDate} />
              </dl>
            </div>
          </div>
        </BentoCard>

        {/* Wallets */}
        <BentoCard
          eyebrow=""
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
                        <h4 className="truncate text-sm font-bold text-[var(--a-fg)]">{w.name}</h4>
                        {w.isDefault && (
                          <span className="rounded-full border border-[var(--a-pos)]/30 bg-[var(--a-pos)]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--a-pos)]">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--a-muted)]">
                        {w.network} · added {fmtDateTime(w.createdAt)}
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
                        onClick={() => {
                          copy(w.address);
                        }}
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
                      {/* <button
                        onClick={() => {
                          setActiveWallet(w);
                          setWalletModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]"
                      >
                        <Pencil className="size-3" /> Edit
                      </button> */}
                      {/* {!w.isDefault && (
                        <button
                          onClick={() => {
                            awa
                            // )
                          }}
                          className="rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]"
                        >
                          Set default
                        </button>
                      )} */}
                      <button
                        onClick={async () => {
                          startLoad(true, "Wallet Deleting...");
                          try {
                            await deleteDocument({
                              collectionName: "wallets",
                              id: w.id,
                              message: `${w.name} Wallet Details Has Been Deleted Successfully`,
                            });
                          } catch (error) {
                            toast.error({
                              title: "Error",
                              description: error.message,
                            });
                          } finally {
                            stopLoad();
                          }
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
      {/* <RecordSheet
        open={profileOpen}
        onOpenChange={setProfileOpen}
        eyebrow="Administrator"
        title={user.fullName}
        subtitle={user.role}
        record={user}
        fields={profileFields}
        onSave={(patch) => setProfile((p) => ({ ...p, ...patch }))}
      /> */}

      {/* Wallet upload / edit modal */}
      <WalletFormModal
        open={walletModalOpen}
        onOpenChange={setWalletModalOpen}
        initial={activeWallet}
        onSubmit={async (data) => {
          if (!data) {
            toast.error({
              title: "Error",
              description: "Error Uploading Wallet",
              position: "top-left",
            });
            return;
          }

          startLoad(true, "Uploading Wallet Details");

          try {
            const image = await photoFN(data.qrCode as unknown as File);

            await addDocToCollection({
              collections: "wallets",
              document: {
                ...data,
                createdAt: new Date().toISOString(),
                qrCode: image,
              },
            });
          } catch (error) {
            toast.error({
              title: "Error",
              description: error.message,
              position: "top",
            });
          } finally {
            setWalletModalOpen(false);
            setActiveWallet(null);
            stopLoad();
          }
        }}
      />
    </>
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
    <div className="grid place-items-center rounded-xl border border-dashed border-[var(--a-border)] px-6 py-12 text-center">
      <WalletIcon className="size-8 text-[var(--a-muted)]" />
      <p className="mt-3 text-sm font-semibold text-[var(--a-fg)]">No wallets yet</p>
      <p className="mt-1 max-w-sm text-xs text-[var(--a-muted)]">Upload your first crypto wallet</p>
      <button
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
      >
        <Plus className="size-3.5" /> Upload wallet
      </button>
    </div>
  );
}

/* ------------ Zod schema + types ------------ */
const walletFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80, "Label too long (max 80)."),
  network: z.string().min(1, { message: "Network is required" }),
  address: z
    .string()
    .trim()
    .min(12, "Address looks invalid (12–120 chars).")
    .max(120, "Address looks invalid (12–120 chars)."),
  qrCode: z
    .instanceof(File, { message: "Please select an image file." })
    .refine((file) => file.size <= 5000000, `Max size 5MB.`)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Supported: .jpg, .png, .webp",
    ),
  memo: z.string().min(1, { message: "Note is required" }).trim(),
  isDefault: z.boolean().default(false),
});

type WalletFormData = z.infer<typeof walletFormSchema>;

// export interface AdminWallet {
//   name: string;
//   network: string;
//   address: string;
//   image: string;
//   id: string;
//   isDefault: boolean;
//   memo: string;
//   createdAt: string;
// }

/* ------------ Wallet form modal (fullscreen on mobile) ------------ */
function WalletFormModal({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: AdminWallet | null;
  onSubmit: (data: Omit<AdminWallet, "id" | "createdAt">) => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(walletFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      network: "",
      qrCode: undefined,
      address: "",
      memo: "",
      isDefault: false,
    },
  });

  // Reset form when modal opens or initial data changes
  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? "",
        network: initial?.network ?? "",
        address: initial?.address ?? "",
        memo: initial?.memo ?? "",
        isDefault: initial?.isDefault ?? false,
        qrCode: initial?.qrCode,
      });
    }
  }, [open, initial, reset]);

  const onFormSubmit = (data) => {
    onSubmit({
      name: data.name,
      network: data.network,
      address: data.address,
      memo: data.memo.trim(),
      isDefault: data.isDefault,
      qrCode: data.qrCode,
    });
  };

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
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="admin-theme fixed inset-0 z-50 flex flex-col bg-[#0f0f10] text-[var(--a-fg)] md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[88vh] md:w-[min(560px,94vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:border md:border-[var(--a-border-hi)] md:shadow-2xl"
              >
                <DialogPrimitive.Description className="sr-only">
                  Wallet upload or edit form
                </DialogPrimitive.Description>
                <div className="flex items-start justify-between gap-3 border-b border-[var(--a-border)] px-5 py-4 md:px-6">
                  <div>
                    {/* <p className="a-eyebrow">Treasury</p> */}
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
                  onSubmit={handleSubmit(onFormSubmit)}
                  className="flex flex-1 flex-col overflow-hidden"
                >
                  <div className="flex-1 space-y-4 overflow-y-auto a-scrollbar px-5 py-5 md:px-6">
                    <Field label="Name">
                      <input
                        {...register("name")}
                        placeholder="E.g Ethereum"
                        maxLength={80}
                        className={inputCls}
                      />
                      {errors.name && (
                        <p className="mt-1 text-[10px] text-[var(--a-neg)]">
                          {errors.name.message}
                        </p>
                      )}
                    </Field>

                    <Field label="Name">
                      <input
                        {...register("network")}
                        placeholder="E.g TRC-20"
                        maxLength={80}
                        className={inputCls}
                      />
                      {errors.network && (
                        <p className="mt-1 text-[10px] text-[var(--a-neg)]">
                          {errors.network.message}
                        </p>
                      )}
                    </Field>

                    <Field label="Wallet address">
                      <input
                        {...register("address")}
                        placeholder="Paste full address"
                        maxLength={120}
                        className={`${inputCls} font-mono text-xs`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-[10px] text-[var(--a-neg)]">
                          {errors.address.message}
                        </p>
                      )}
                    </Field>

                    <Field label="Memo">
                      <input
                        {...register("memo")}
                        placeholder="Note"
                        maxLength={120}
                        className={inputCls}
                      />
                      {errors.memo && (
                        <p className="mt-1 text-[10px] text-[var(--a-neg)]">
                          {errors.memo.message}
                        </p>
                      )}
                    </Field>

                    <Field label="Qr Code">
                      <>
                        <Controller
                          name={"qrCode"}
                          control={control}
                          render={({ field }) => {
                            return (
                              <input
                                type="file"
                                onChange={(e) => {
                                  const type = e.target.files[0];
                                  field.onChange(type);
                                }}
                                className={`${inputCls}`}
                              />
                            );
                          }}
                        ></Controller>
                        {errors.qrCode && (
                          <p className="mt-1 text-[10px] text-[var(--a-neg)]">
                            {errors.qrCode.message}
                          </p>
                        )}
                      </>
                    </Field>

                    {/* <Controller
                      name="isDefault"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 text-sm text-[var(--a-fg-2)]">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="size-4 accent-[var(--a-accent)]"
                          />
                          Set as default payout wallet
                        </label>
                      )}
                    /> */}

                    {/* {Object.keys(errors).length > 0 && (
                      <p className="rounded-md border border-[var(--a-neg)]/30 bg-[var(--a-neg)]/10 px-3 py-2 text-xs font-semibold text-[var(--a-neg)]">
                        Please fix the errors above.
                      </p>
                    )} */}
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
