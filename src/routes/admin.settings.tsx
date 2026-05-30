import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Save } from "lucide-react";
import { BentoCard, SectionHeader } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const [maintenance, setMaintenance] = useState(false);
  const [newSignups, setNewSignups] = useState(true);
  const [auctions, setAuctions] = useState(true);
  const [fee, setFee] = useState(2.5);
  const [withdrawMin, setWithdrawMin] = useState(50);

  return (
    <div className="mx-auto max-w-[1100px]">
      <SectionHeader title="Settings" description="Global platform toggles, fee structure and dangerous actions." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BentoCard eyebrow="Platform" title="Feature flags">
          <div className="space-y-3">
            <Toggle label="Maintenance mode" hint="Block all non-admin traffic." value={maintenance} onChange={setMaintenance} />
            <Toggle label="Accept new signups" hint="Allow public registrations." value={newSignups} onChange={setNewSignups} />
            <Toggle label="Live auctions" hint="Master switch for bidding." value={auctions} onChange={setAuctions} />
          </div>
        </BentoCard>

        <BentoCard eyebrow="Money" title="Fee structure">
          <div className="space-y-4">
            <NumberField label="Platform fee" suffix="%" value={fee} onChange={setFee} />
            <NumberField label="Minimum withdrawal" suffix="USD" value={withdrawMin} onChange={setWithdrawMin} />
            <button className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)]">
              <Save className="size-3.5" /> Save changes
            </button>
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-2" eyebrow="Danger zone" title="Irreversible actions">
          <div className="rounded-md border border-[var(--a-neg)]/40 bg-[var(--a-neg)]/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 shrink-0 text-[var(--a-neg)]" />
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--a-fg)]">Purge mock data</p>
                <p className="mt-0.5 text-xs text-[var(--a-muted)]">
                  Removes all in-memory transactions, users and listings. Cannot be undone (until refresh).
                </p>
              </div>
              <button className="shrink-0 rounded-md bg-[var(--a-neg)] px-3 py-1.5 text-xs font-bold text-white">
                Purge
              </button>
            </div>
          </div>
        </BentoCard>
      </div>
    </div>
  );
}

function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-3">
      <div>
        <p className="text-sm font-semibold text-[var(--a-fg)]">{label}</p>
        {hint && <p className="text-xs text-[var(--a-muted)]">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${value ? "bg-[var(--a-accent)]" : "bg-[var(--a-surface-2)]"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-white transition ${value ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}

function NumberField({ label, suffix, value, onChange }: { label: string; suffix: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="a-eyebrow mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-sm text-[var(--a-fg)] outline-none"
        />
        <span className="a-mono text-[10px] font-bold uppercase tracking-wider text-[var(--a-muted)]">{suffix}</span>
      </div>
    </div>
  );
}
