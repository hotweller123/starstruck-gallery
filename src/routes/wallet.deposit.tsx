import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  ArrowDownToLine,
  CreditCard,
  CheckCircle2,
  Building2,
  Calendar,
  Lock,
  Sparkles,
  Clipboard,
  Copy,
  File as IconFile,
  Image,
} from "lucide-react";
import {
  FormPage,
  WAmount,
  WInput,
  WSelect,
  WSubmit,
  WRow,
  WCopied,
  WFile,
} from "@/components/wallet/FormPage";
import { useShallow } from "zustand/shallow";
import { useAuthStore, useDataStore } from "@/store/zustand";
import { WalletLoader } from "@/components/wallet/WalletLoader";
import { FormProvider, useForm } from "react-hook-form";
import { AdminWallet, WalletTx } from "@/types";
import type { WalletAccount } from "@/types";
import { increment, serverTimestamp, Timestamp } from "firebase/firestore";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import qrcode from "@/assets/swminto.jpg";
import { copyClipboard, formatMoney } from "@/utils";
import useDoc from "@/hooks/useDoc";
import { toast } from "@/lib/useToast";

export const Route = createFileRoute("/wallet/deposit")({
  component: DepositPage,
  head: () => ({ meta: [{ title: "Deposit — EmberPay" }] }),
});

const PRESETS = [50, 100, 250, 500, 1000, 2500];

const METHODS = [
  // { value: "card", label: "Debit / Credit card" },
  { value: "bank", label: "Bank transfer (ACH / SEPA)" },
  { value: "crypto", label: "Crypto Details" },
];

export interface DepositSchema {
  amount: number;
  proof: File;
}

const depositSchema = z.object({
  amount: z
    .number()
    .positive("Enter an amount")
    .max(1_000_0000, { message: "Amount Must Be Less Than 10,000,000" }),
  proof: z
    .instanceof(File, { message: "Please select an image file." })
    .refine((file) => file.size <= 5000000, `Max size 5MB.`)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Supported: .jpg, .png, .webp",
    ),
});

function DepositPage() {
  const { user, isAuthHydrated, loading } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      isAuthHydrated: s.isAuthHydrated,
      loading: s.loading,
    })),
  );

  // Guard: wait for the centralized listener (in __root) to finish onAuth + Firestore fetch.
  // This is the single source of truth. Without this, user can be null or have incomplete shape.
  if (loading || !isAuthHydrated || !user) {
    return <WalletLoader partial message="Preparing deposit" showSkeleton={false} />;
  }

  // After the guard, `u` is the fully-loaded WalletAccount fetched by the single listener.
  const u: WalletAccount = user;

  const { addDocToCollection, updateDocument } = useDoc();

  const [wallet, setWallet] = useState<AdminWallet | null>(null);

  const { adminWallets } = useDataStore(
    useShallow((state) => ({
      adminWallets: state.wallets,
    })),
  );

  const modWallets = adminWallets.map((w) => ({
    label: `${w.name} ~ ${w.network}`,
    value: w.id,
  }));

  const formControl = useForm({
    resolver: zodResolver(depositSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      proof: undefined,
    },
  });

  const [method, setMethod] = useState("crypto");
  const [done, setDone] = useState<number | null>(null);
  const [save, setSave] = useState<boolean>(false);

  const amount = formControl.getValues("amount");

  const submit = formControl.handleSubmit(
    async (data) => {
      try {
        const balanceAfter = amount + user.wallet.balance;
        const payload: Omit<WalletTx, "id"> = {
          channel: method,
          amount,
          balanceAfter,
          date: serverTimestamp() as unknown as Timestamp,
          createdAt: new Date().toISOString(),
          currency: user.currency,
          symbol: user.symbol,
          email: user.email,
          fullName: user.fullName,
          status: "Pending",
          title: "Deposit",
          type: "deposit",
          userID: user.userID,
          counterparty: "counterparty",
          details: {
            name: wallet?.name ?? "",
            address: wallet?.address ?? "",
            network: wallet?.network ?? "",
          },
        };

        await addDocToCollection({
          collections: "transactions",
          document: payload,
        });

        await updateDocument({
          collections: "users",
          document: {
            wallet: {
              balance: balanceAfter,
              bidBalance: user.wallet.bidBalance,
            },
            id: user.id,
          },
        });

        toast.added({
          title: "Transaction Successful",
          description: "Transaction Description",
          position: "bottom-left",
        });
        setDone(balanceAfter);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        toast.error({
          title: "Error Message",
          description: message,
          position: "top-left",
        });
      }
    },
    (invalidate) => {
      toast.error({
        title: "Form Invalid",
        description: invalidate.form?.message,
        position: "top-left",
      });
    },
  );

  if (done !== null)
    return <Success amount={done} currency={user.currency} balance={user.wallet.balance} />;

  return (
    <FormPage
      eyebrow="Add funds"
      title="Deposit"
      subtitle="Top up your EmberPay balance — settled instantly."
      icon={<ArrowDownToLine className="size-6" strokeWidth={2.2} />}
      aside={
        <Sidebar
          user={user}
          symbol={user.symbol}
          amount={formControl.watch("amount")}
          method={method}
        />
      }
    >
      <FormProvider {...formControl}>
        <form onSubmit={submit} className="flex flex-col gap-5">
          <WRow>
            <WSelect
              placeholder="Select A Method"
              name="method"
              label="Method"
              value={method}
              onChange={setMethod}
              options={METHODS}
            />
          </WRow>

          <div>
            <WAmount schema="deposit" name="amount" currency={user.currency} />
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  key={p}
                  onClick={() => formControl.setValue("amount", p)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${
                    amount === p
                      ? "border-transparent shadow"
                      : "border-[var(--w-border)] bg-[var(--w-input)] text-[var(--w-fg)] hover:border-[var(--w-brand)]/40"
                  }`}
                  style={
                    amount === p
                      ? { background: "var(--w-brand)", color: "var(--w-brand-contrast)" }
                      : undefined
                  }
                >
                  {user.symbol}
                  {p}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] p-5"
          >
            <div className="flex items-center gap-3">
              <Building2 className="size-5 text-[var(--w-brand)]" strokeWidth={2} />
              <p className="text-sm font-extrabold text-[var(--w-fg)]">Crypto details</p>
            </div>
            <div className="mt-4 grid gap-3">
              <WSelect
                placeholder="Select Wallet To Deposit To"
                label="Select Wallet To Deposit To"
                name="wallet"
                options={modWallets}
                value={wallet?.id ?? ""}
                onChange={(v) => {
                  const findW = adminWallets.find((w) => w.id == v);
                  if (findW) setWallet(findW);
                }}
              />

              {wallet && (
                <>
                  <div className="flex flex-col gap-5">
                    <img
                      src={qrcode}
                      alt="swminto"
                      className="object-cover aspect-square border border-muted/20 "
                      style={{
                        borderRadius: "10px",
                      }}
                    />

                    <WCopied label={wallet.address} value={wallet.address} />
                    <WFile
                      label="Upload Proof"
                      name="proof"
                      className="file:bg-transparent file:w-0 file:px-0 file:mx-0 appearance-none"
                      icon={<Image size={14} />}
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* <label className="flex items-center gap-2 text-xs text-[var(--w-muted)]">
            <input
              type="checkbox"
              checked={save}
              onChange={(e) => setSave(e.target.checked)}
              className="size-4 rounded border-[var(--w-border)] bg-[var(--w-input)] accent-[var(--w-brand)]"
            />
            Save this {method === "card" ? "card" : "method"} for next time
          </label> */}

          <WSubmit>
            <span className="inline-flex items-center justify-center gap-2">Proceed</span>
          </WSubmit>
        </form>
      </FormProvider>
    </FormPage>
  );
}

function Sidebar({
  amount,
  method,
  symbol = "$",
  user,
}: {
  amount: number;
  method: string;
  symbol: string;
  user: WalletAccount; // always defined when Sidebar renders (we pass after guard)
}) {
  const fee = method === "card" ? Math.round(amount * 0.015 * 100) / 100 : 0;
  const total = amount - fee;
  return (
    <div className="sticky top-28 rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
        Summary
      </p>
      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--w-fg)] break-all line-clamp-1">
        {formatMoney(amount, user.currency, {
          decimals: 2,
          withSymbol: true,
        })}
      </h3>

      <dl className="mt-5 flex flex-col gap-3 text-sm">
        <Row label="Method" value={METHODS.find((m) => m.value === method)?.label ?? method} />
        <Row label="Processing fee" value={` ${symbol} ${fee}`} />
        <Row label="Arrival" value="Instant" />
        <div className="border-t border-[var(--w-border)] pt-3">
          <Row label="You receive" value={formatMoney(total, user.currency)} bold />
        </div>
      </dl>

      <div className="mt-6 rounded-[1.2rem] border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] p-3 text-[11px] text-[var(--w-muted)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-brand)]">
          Safe by default
        </p>
        <p className="mt-1 leading-snug">Deposit Notify</p>
      </div>
    </div>
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

function Success({
  amount,
  balance,
  currency,
}: {
  amount: number;
  balance: number;
  currency: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md text-center"
    >
      <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-10 shadow-xl wallet-ring">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="mx-auto grid size-16 place-items-center rounded-full border border-[var(--w-brand)]/40 text-[var(--w-brand)] shadow-lg"
          style={{ background: "var(--w-brand-soft)" }}
        >
          <CheckCircle2 className="size-8" strokeWidth={2} />
        </motion.span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight animate__animated animate__fadeInUp">
          {formatMoney(amount, currency, {
            withSymbol: true,
          })}{" "}
          deposited
        </h1>
        <p className="mt-2 text-sm text-[var(--w-muted)]">
          New balance {formatMoney(balance, currency)}
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

export function Err({ msg }: { msg: string }) {
  return (
    <p className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)] animate__animated animate__headShake">
      {msg}
    </p>
  );
}
