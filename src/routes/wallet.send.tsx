import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2, KeyRound, MessageSquare, Tag as TagIcon, Zap } from "lucide-react";
import {
  FormPage,
  WAmount,
  WInput,
  WSelect,
  WTextarea,
  WSubmit,
  WRow,
} from "@/components/wallet/FormPage";
import { useWallet, formatMoney } from "@/lib/wallet";

export const Route = createFileRoute("/wallet/send")({
  component: SendPage,
  head: () => ({ meta: [{ title: "Send — EmberPay" }] }),
});

const PURPOSES = [
  { value: "gift", label: "Gift" },
  { value: "settle", label: "Settle a bill" },
  { value: "art", label: "Artwork payment" },
  { value: "commission", label: "Commission" },
  { value: "other", label: "Other" },
];

function SendPage() {
  const { transfer, currentAccount, getAccountByToken } = useWallet();
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState(25);
  const [purpose, setPurpose] = useState("gift");
  const [note, setNote] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [priority, setPriority] = useState("standard");
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recipient = token.length >= 6 ? getAccountByToken(token) : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const fullNote = [emoji, note].filter(Boolean).join(" ");
    const res = transfer(token, Number(amount), fullNote || undefined);
    if (!res.ok) setError(res.error ?? "Failed");
    else setDone(Number(amount));
  };

  if (done !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-md text-center"
      >
        <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-10 shadow-xl wallet-ring">
          <motion.span
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring" }}
            className="mx-auto grid size-16 place-items-center rounded-full border border-[var(--w-brand)]/40 text-[var(--w-brand)] shadow-lg"
            style={{ background: "var(--w-brand-soft)" }}
          >
            <CheckCircle2 className="size-8" strokeWidth={2} />
          </motion.span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">{formatMoney(done)} sent</h1>
          <p className="mt-2 text-sm text-[var(--w-muted)]">
            New balance {formatMoney(currentAccount?.wallet.balance ?? 0)}
          </p>
          <Link
            to="/wallet"
            className="mt-6 inline-block w-full rounded-[1.4rem] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] shadow-lg"
            style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
          >
            Back to wallet
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <FormPage
      eyebrow="Transfer"
      title="Send funds"
      subtitle="Move money to another EmberPay wallet using its token."
      icon={<Send className="size-6" strokeWidth={2.2} />}
      aside={
        <div className="sticky top-28 space-y-3">
          {recipient && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[2rem] border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-brand)]">
                Recipient found
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className="grid size-12 place-items-center rounded-full text-base font-extrabold"
                  style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
                >
                  {recipient.fullName
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-[var(--w-fg)]">
                    {recipient.fullName}
                  </p>
                  <p className="truncate text-xs text-[var(--w-muted)]">{recipient.email}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
              Summary
            </p>
            <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--w-fg)]">
              {formatMoney(amount)}
            </h3>
            <dl className="mt-5 flex flex-col gap-3 text-sm">
              <Row label="Available" value={formatMoney(currentAccount?.wallet.balance ?? 0)} />
              <Row label="Fee" value="Free" />
              <Row label="Speed" value={priority === "instant" ? "Instant" : "Standard"} />
              <div className="border-t border-[var(--w-border)] pt-3">
                <Row
                  label="After"
                  value={formatMoney(Math.max((currentAccount?.wallet.balance ?? 0) - amount, 0))}
                  bold
                />
              </div>
            </dl>
          </div>
        </div>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        <WInput
          label="Recipient token"
          required
          value={token}
          onChange={(e) => setToken(e.target.value.toUpperCase())}
          placeholder="AET-XXXX-XXXX-XXXX"
          className="font-mono tracking-wider"
          icon={<KeyRound className="size-4" />}
          hint="Ask the recipient for their wallet token (from their Security page)."
        />

        <WAmount value={amount} onChange={setAmount} max={currentAccount?.wallet.balance ?? 0} />

        <WRow>
          <WSelect label="Purpose" value={purpose} onChange={setPurpose} options={PURPOSES} />
          <WSelect
            label="Priority"
            value={priority}
            onChange={setPriority}
            options={[
              { value: "standard", label: "Standard · free" },
              { value: "instant", label: "Instant · ⚡" },
            ]}
          />
        </WRow>

        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Tag with emoji
          </p>
          <div className="flex flex-wrap gap-2">
            {["✨", "🎨", "🥂", "🖼️", "💸", "🌹", "🪙"].map((e) => (
              <motion.button
                key={e}
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={() => setEmoji(e)}
                className={`grid size-10 place-items-center rounded-full border text-lg transition ${
                  emoji === e
                    ? "border-[var(--w-brand)] bg-[var(--w-brand-soft)]"
                    : "border-[var(--w-border)] bg-[var(--w-input)] hover:border-[var(--w-brand)]/40"
                }`}
              >
                {e}
              </motion.button>
            ))}
          </div>
        </div>

        <WTextarea
          label="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="For the framing of the Marchand triptych…"
        />

        {priority === "instant" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] px-3 py-2 text-xs text-[var(--w-fg)]"
          >
            <Zap className="size-3.5 text-[var(--w-brand)]" />
            Instant transfers settle in under one second.
          </motion.div>
        )}

        {error && (
          <p className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)] animate__animated animate__headShake">
            {error}
          </p>
        )}

        <WSubmit type="submit">
          <span className="inline-flex items-center justify-center gap-2">
            <Send className="size-4" /> Send {formatMoney(amount)}
          </span>
        </WSubmit>

        <div className="flex items-center gap-2 text-[11px] text-[var(--w-muted)]">
          <MessageSquare className="size-3" />
          The recipient sees your note and tag next to the transfer.
          <span className="ml-auto inline-flex items-center gap-1 text-[var(--w-brand)]">
            <TagIcon className="size-3" /> {purpose}
          </span>
        </div>
      </form>
    </FormPage>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[var(--w-muted)]">{label}</dt>
      <dd
        className={`text-right ${bold ? "text-base font-extrabold text-[var(--w-fg)]" : "font-semibold text-[var(--w-fg)]"}`}
      >
        {value}
      </dd>
    </div>
  );
}
