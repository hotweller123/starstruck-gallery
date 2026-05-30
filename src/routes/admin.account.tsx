import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  WalletCards,
  ShieldCheck,
  KeyRound,
  Building2,
  Globe,
  Upload,
  Save,
  UserCog,
  CheckCircle2,
  FileBadge2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BentoCard, DataTable, SectionHeader, StatusChip } from "@/components/admin/primitives";
import {
  adminCryptoWallets as seedWallets,
  adminProfile,
  fmtDateTime,
  fmtMoney,
  type AdminCryptoWallet,
} from "@/data/admin-mock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/account")({
  component: AdminAccountPage,
});

const walletSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Enter a wallet label")
    .max(60, "Keep the label under 60 characters"),
  asset: z.string().trim().min(2, "Enter the asset").max(12, "Use a short asset ticker"),
  network: z.string().trim().min(2, "Enter the network").max(30, "Keep the network name short"),
  address: z
    .string()
    .trim()
    .min(12, "Enter a valid wallet address")
    .max(120, "Wallet address is too long"),
  provider: z.string().trim().max(40, "Provider name is too long").optional().or(z.literal("")),
  memo: z.string().trim().max(120, "Memo is too long").optional().or(z.literal("")),
});

type WalletFormValues = z.infer<typeof walletSchema>;

function AdminAccountPage() {
  const [wallets, setWallets] = useState<AdminCryptoWallet[]>(seedWallets);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      label: "",
      asset: "",
      network: "",
      address: "",
      provider: "",
      memo: "",
    },
  });

  const totals = useMemo(
    () => ({
      activeWallets: wallets.filter((wallet) => wallet.status === "active").length,
      reviewWallets: wallets.filter((wallet) => wallet.status === "review").length,
    }),
    [wallets],
  );

  function onSubmit(values: WalletFormValues) {
    setWallets((prev) => [
      {
        id: `cw_${prev.length + 1}`,
        label: values.label,
        asset: values.asset.toUpperCase(),
        network: values.network,
        address: values.address,
        provider: values.provider || undefined,
        memo: values.memo || undefined,
        fileName: selectedFile?.name,
        status: "review",
        addedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    form.reset();
    setSelectedFile(null);
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <SectionHeader
        title="Admin account"
        description="Identity, approval authority, security posture and linked treasury wallets for the acting administrator."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]">
                <Upload className="size-3.5" /> Upload wallet details
              </button>
            </DialogTrigger>
            <DialogContent className="admin-theme border border-[var(--a-border-hi)] bg-[#111111] text-[var(--a-fg)] shadow-2xl sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-extrabold tracking-tight text-[var(--a-fg)]">
                  Add crypto wallet details
                </DialogTitle>
                <DialogDescription className="text-sm text-[var(--a-muted)]">
                  Store a treasury or settlement wallet for internal admin review. This stays in
                  mock state for now.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Wallet label" error={form.formState.errors.label?.message}>
                    <Input
                      {...form.register("label")}
                      className="border-[var(--a-border)] bg-[var(--a-input)] text-[var(--a-fg)] placeholder:text-[var(--a-faint)] focus-visible:ring-[var(--a-accent)]"
                      placeholder="Treasury settlement wallet"
                    />
                  </Field>
                  <Field label="Asset" error={form.formState.errors.asset?.message}>
                    <Input
                      {...form.register("asset")}
                      className="border-[var(--a-border)] bg-[var(--a-input)] text-[var(--a-fg)] placeholder:text-[var(--a-faint)] focus-visible:ring-[var(--a-accent)]"
                      placeholder="USDT"
                    />
                  </Field>
                  <Field label="Network" error={form.formState.errors.network?.message}>
                    <Input
                      {...form.register("network")}
                      className="border-[var(--a-border)] bg-[var(--a-input)] text-[var(--a-fg)] placeholder:text-[var(--a-faint)] focus-visible:ring-[var(--a-accent)]"
                      placeholder="Ethereum"
                    />
                  </Field>
                  <Field label="Provider" error={form.formState.errors.provider?.message}>
                    <Input
                      {...form.register("provider")}
                      className="border-[var(--a-border)] bg-[var(--a-input)] text-[var(--a-fg)] placeholder:text-[var(--a-faint)] focus-visible:ring-[var(--a-accent)]"
                      placeholder="Fireblocks"
                    />
                  </Field>
                </div>

                <Field label="Wallet address" error={form.formState.errors.address?.message}>
                  <Input
                    {...form.register("address")}
                    className="border-[var(--a-border)] bg-[var(--a-input)] text-[var(--a-fg)] placeholder:text-[var(--a-faint)] focus-visible:ring-[var(--a-accent)]"
                    placeholder="0x... or bc1..."
                  />
                </Field>

                <Field label="Memo / notes" error={form.formState.errors.memo?.message}>
                  <Textarea
                    {...form.register("memo")}
                    className="min-h-[92px] border-[var(--a-border)] bg-[var(--a-input)] text-[var(--a-fg)] placeholder:text-[var(--a-faint)] focus-visible:ring-[var(--a-accent)]"
                    placeholder="Add operational notes, custody notes, or routing memo"
                  />
                </Field>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--a-muted)]">
                    Verification file
                  </Label>
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-[var(--a-border-hi)] bg-[var(--a-surface)] px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--a-fg)]">
                        Upload proof of ownership
                      </p>
                      <p className="text-xs text-[var(--a-muted)]">
                        PDF, PNG or JPG evidence document
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-md border border-[var(--a-border)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]">
                      <FileBadge2 className="size-3.5" /> Choose file
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="sr-only"
                      onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                    />
                  </label>
                  {selectedFile && (
                    <p className="a-mono text-[10px] text-[var(--a-accent)]">
                      Attached: {selectedFile.name}
                    </p>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setSelectedFile(null);
                      setOpen(false);
                    }}
                    className="inline-flex items-center justify-center rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-2 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-2 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]"
                  >
                    <Save className="size-3.5" /> Save wallet
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <BentoCard className="lg:col-span-8" eyebrow="Identity" title="Administrator profile">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <span
                className="grid size-16 place-items-center rounded-xl text-lg font-extrabold text-[var(--a-accent-ink)] shadow-lg"
                style={{ background: adminProfile.avatar }}
              >
                AD
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--a-fg)]">
                    {adminProfile.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--a-border-hi)] bg-[var(--a-accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-accent)]">
                    <UserCog className="size-3" /> {adminProfile.role}
                  </span>
                </div>
                <div className="mt-2 grid gap-2 text-xs text-[var(--a-muted)] sm:grid-cols-2">
                  <MetaLine icon={Building2} text={adminProfile.staffId} />
                  <MetaLine icon={Globe} text={adminProfile.location} />
                  <MetaLine
                    icon={ShieldCheck}
                    text={`Last login ${fmtDateTime(adminProfile.lastLogin)}`}
                  />
                  <MetaLine
                    icon={KeyRound}
                    text={`Password rotated ${fmtDateTime(adminProfile.lastPasswordReset)}`}
                  />
                </div>
                <p className="mt-3 text-sm text-[var(--a-fg-2)]">{adminProfile.email}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 md:w-[360px]">
              <MiniStat label="Approval limit" value={fmtMoney(adminProfile.approvalLimit)} />
              <MiniStat label="Wallet queue" value={String(adminProfile.walletReviewQueue)} />
              <MiniStat label="Lot flags" value={String(adminProfile.exhibitionFlags)} />
            </div>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-4" eyebrow="Security" title="Access posture">
          <ul className="space-y-3 text-xs">
            <SecurityRow
              icon={ShieldCheck}
              label="Two-factor"
              value={adminProfile.twoFactor ? "Enabled" : "Disabled"}
              good={adminProfile.twoFactor}
            />
            <SecurityRow
              icon={CheckCircle2}
              label="Trusted devices"
              value={`${adminProfile.trustedDevices} devices`}
            />
            <SecurityRow
              icon={WalletCards}
              label="Linked wallets"
              value={`${wallets.length} records`}
            />
            <SecurityRow
              icon={UserCog}
              label="Ops teams"
              value={`${adminProfile.teams.length} scopes`}
            />
          </ul>
        </BentoCard>

        <BentoCard className="lg:col-span-5" eyebrow="Scope" title="Assigned teams">
          <ul className="space-y-2.5">
            {adminProfile.teams.map((team) => (
              <li
                key={team}
                className="rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] px-3 py-2 text-sm font-semibold text-[var(--a-fg)]"
              >
                {team}
              </li>
            ))}
          </ul>
        </BentoCard>

        <BentoCard className="lg:col-span-7" eyebrow="Authority" title="Granted permissions">
          <div className="grid gap-2 sm:grid-cols-2">
            {adminProfile.permissions.map((permission) => (
              <div
                key={permission}
                className="flex items-center gap-2 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] px-3 py-2 text-sm text-[var(--a-fg-2)]"
              >
                <CheckCircle2 className="size-4 text-[var(--a-accent)]" />
                <span>{permission}</span>
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard
          className="lg:col-span-12"
          eyebrow="Treasury"
          title="Linked crypto wallets"
          action={
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--a-muted)]">
              {totals.activeWallets} active · {totals.reviewWallets} in review
            </span>
          }
        >
          <DataTable
            rows={wallets}
            columns={[
              {
                key: "label",
                header: "Wallet",
                render: (wallet) => (
                  <div>
                    <p className="text-xs font-semibold text-[var(--a-fg)]">{wallet.label}</p>
                    <p className="text-[10px] text-[var(--a-muted)]">
                      {wallet.provider ?? "Manual custody"}
                    </p>
                  </div>
                ),
              },
              {
                key: "asset",
                header: "Asset",
                render: (wallet) => (
                  <span className="a-mono text-xs font-bold text-[var(--a-accent)]">
                    {wallet.asset}
                  </span>
                ),
              },
              {
                key: "network",
                header: "Network",
                render: (wallet) => (
                  <span className="text-xs text-[var(--a-fg-2)]">{wallet.network}</span>
                ),
              },
              {
                key: "address",
                header: "Address",
                render: (wallet) => (
                  <span className="a-mono text-[10px] text-[var(--a-muted)]">
                    {truncateAddress(wallet.address)}
                  </span>
                ),
              },
              {
                key: "proof",
                header: "Proof file",
                render: (wallet) => (
                  <span className="text-xs text-[var(--a-fg-2)]">{wallet.fileName ?? "—"}</span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (wallet) => <StatusChip value={wallet.status} />,
              },
              {
                key: "addedAt",
                header: "Added",
                render: (wallet) => (
                  <span className="text-xs text-[var(--a-muted)]">
                    {fmtDateTime(wallet.addedAt)}
                  </span>
                ),
              },
            ]}
          />
        </BentoCard>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--a-muted)]">
        {label}
      </Label>
      {children}
      {error && <p className="text-[11px] text-[var(--a-neg)]">{error}</p>}
    </div>
  );
}

function MetaLine({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-3.5" /> {text}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-3">
      <p className="a-eyebrow">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--a-fg)]">{value}</p>
    </div>
  );
}

function SecurityRow({
  icon: Icon,
  label,
  value,
  good,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  good?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-2.5">
      <span className="inline-flex items-center gap-2 text-[var(--a-muted)]">
        <Icon className="size-3.5" />
        <span className="font-semibold text-[var(--a-fg-2)]">{label}</span>
      </span>
      <span
        className={`a-mono text-xs font-bold ${good ? "text-[var(--a-pos)]" : "text-[var(--a-fg)]"}`}
      >
        {value}
      </span>
    </li>
  );
}

function truncateAddress(value: string) {
  if (value.length <= 16) return value;
  return `${value.slice(0, 8)}…${value.slice(-8)}`;
}

export default AdminAccountPage;
