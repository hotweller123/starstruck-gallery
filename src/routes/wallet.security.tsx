import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
<<<<<<< HEAD
import { AlertTriangle, Copy, Check, RefreshCw, ShieldCheck, Smartphone, Fingerprint, Bell } from "lucide-react";
=======
import {
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Fingerprint,
  Bell,
} from "lucide-react";
>>>>>>> 49a1b1e (updated)
import { useWallet } from "@/lib/wallet";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wallet/security")({
  component: SecurityPage,
  head: () => ({ meta: [{ title: "Security — EmberPay" }] }),
});

function SecurityPage() {
  const { currentAccount, regenerateToken } = useWallet();
  const { connectedWalletId, disconnectWallet } = useStore();
  const [copied, setCopied] = useState(false);
  const [twofa, setTwofa] = useState(true);
  const [bio, setBio] = useState(false);
  const [alerts, setAlerts] = useState(true);
  if (!currentAccount) return null;

  const copy = () => {
    navigator.clipboard.writeText(currentAccount.token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const regen = () => {
<<<<<<< HEAD
    if (
      !confirm("Generating a new token will disconnect the wallet from the site. Continue?")
    )
=======
    if (!confirm("Generating a new token will disconnect the wallet from the site. Continue?"))
>>>>>>> 49a1b1e (updated)
      return;
    if (connectedWalletId === currentAccount.id) disconnectWallet();
    regenerateToken();
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-[1.5rem] border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] p-5 text-sm"
      >
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--w-brand)]" strokeWidth={2} />
        <div>
          <p className="font-extrabold text-[var(--w-fg)]">Demo wallet</p>
          <p className="mt-1 text-[var(--w-muted)]">
<<<<<<< HEAD
            Simulated for exhibition purposes. All data lives in your browser
            and password storage is not production-grade.
=======
            Simulated for exhibition purposes. All data lives in your browser and password storage
            is not production-grade.
>>>>>>> 49a1b1e (updated)
          </p>
        </div>
      </motion.div>

      <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl md:p-8">
<<<<<<< HEAD
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--w-fg)]">
          Wallet token
        </h1>
=======
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--w-fg)]">Wallet token</h1>
>>>>>>> 49a1b1e (updated)
        <p className="mt-1 text-sm text-[var(--w-muted)]">
          Paste this token on the site's Connect page to log in to Aethelred.
        </p>

        <div className="mt-5 rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] p-5">
          <code className="block break-all font-mono text-base font-semibold tracking-widest text-[var(--w-fg)]">
            {currentAccount.token}
          </code>
          <div className="mt-4 flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider shadow"
              style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy token"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={regen}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--w-border)] bg-[var(--w-input)] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[var(--w-fg)] transition hover:border-[var(--w-brand)]/40"
            >
              <RefreshCw className="size-3.5" />
              Regenerate
            </motion.button>
          </div>
        </div>

        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
          Connected to site:{" "}
          <span className="text-[var(--w-fg)]">
            {connectedWalletId === currentAccount.id ? "Yes" : "No"}
          </span>
        </p>
      </div>

      {/* Toggles */}
      <div className="grid gap-3 md:grid-cols-2">
        <Toggle
          icon={Smartphone}
          title="Two-factor auth"
          desc="Require a code on every sign in."
          value={twofa}
          onChange={setTwofa}
        />
        <Toggle
          icon={Fingerprint}
          title="Biometric unlock"
          desc="Use Face ID / Touch ID."
          value={bio}
          onChange={setBio}
        />
        <Toggle
          icon={Bell}
          title="Transaction alerts"
          desc="Notify me on every deposit, withdrawal, or transfer."
          value={alerts}
          onChange={setAlerts}
        />
        <Toggle
          icon={ShieldCheck}
          title="Auto-lock"
          desc="Lock after 5 minutes of inactivity."
          value
          onChange={() => undefined}
        />
      </div>

      <div className="rounded-[2rem] border border-[var(--w-danger)]/30 bg-[var(--w-danger)]/5 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 text-[var(--w-danger)]" strokeWidth={2} />
<<<<<<< HEAD
          <h2 className="text-xl font-bold tracking-tight text-[var(--w-fg)]">
            Danger zone
          </h2>
        </div>
        <p className="mt-2 text-sm text-[var(--w-muted)]">
          Disconnect this wallet from the exhibition site. Your balance and
          activity stay intact.
=======
          <h2 className="text-xl font-bold tracking-tight text-[var(--w-fg)]">Danger zone</h2>
        </div>
        <p className="mt-2 text-sm text-[var(--w-muted)]">
          Disconnect this wallet from the exhibition site. Your balance and activity stay intact.
>>>>>>> 49a1b1e (updated)
        </p>
        <button
          onClick={() => disconnectWallet()}
          disabled={connectedWalletId !== currentAccount.id}
          className="mt-5 rounded-full border border-[var(--w-danger)]/60 bg-[var(--w-danger)]/15 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[var(--w-danger)] hover:bg-[var(--w-danger)]/25 disabled:opacity-40"
        >
          Disconnect from site
        </button>
      </div>
    </div>
  );
}

function Toggle({
  icon: Icon,
  title,
  desc,
  value,
  onChange,
}: {
  icon: typeof Smartphone;
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-start gap-3 rounded-[1.4rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-4 text-left transition hover:border-[var(--w-brand)]/40"
    >
      <span
        className="grid size-9 shrink-0 place-items-center rounded-[0.9rem]"
        style={
          value
            ? { background: "var(--w-brand)", color: "var(--w-brand-contrast)" }
            : { background: "var(--w-bg-2)", color: "var(--w-muted)" }
        }
      >
        <Icon className="size-4" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-[var(--w-fg)]">{title}</p>
        <p className="text-xs text-[var(--w-muted)]">{desc}</p>
      </div>
      <span
        className={`relative inline-block h-5 w-9 rounded-full transition ${
          value ? "" : "bg-[var(--w-bg-2)]"
        }`}
        style={value ? { background: "var(--w-brand)" } : undefined}
      >
        <span
          className="absolute top-0.5 size-4 rounded-full bg-white transition-all"
          style={{ left: value ? "calc(100% - 18px)" : "2px" }}
        />
      </span>
    </motion.button>
  );
}
