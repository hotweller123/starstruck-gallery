import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2, KeyRound, MessageSquare, Tag as TagIcon } from "lucide-react";

import {
  FormPage,
  WAmount,
  WInput,
  WSelect,
  WTextarea,
  WSubmit,
  WRow,
} from "@/components/wallet/FormPage";

import { FormProvider, useForm } from "react-hook-form";
import { useAuthStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { findObj, formatMoney } from "@/utils";
import { Err } from "./wallet.deposit";
import { WalletAccount, WalletTx } from "@/types";
import { WalletLoader } from "@/components/wallet/WalletLoader";
import { toast } from "@/lib/useToast";
import useDoc from "@/hooks/useDoc";
import { serverTimestamp, Timestamp } from "firebase/firestore";

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

type SendFormData = {
  token: string;
  amount: number;
  purpose: "gift" | "settle" | "art" | "commission" | "other";
  note?: string;
};

function SendPage() {
  const { user, loading, isAuthHydrated } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      loading: s.loading,
      isAuthHydrated: s.isAuthHydrated,
    })),
  );

  const { addDocToCollection, updateDocument } = useDoc();

  const [done, setDone] = useState(false);
  const [purpose, setPurpose] = useState("gift");

  if (loading || !isAuthHydrated || !user) {
    return <WalletLoader partial message="Preparing send" showSkeleton={false} />;
  }

  const u: WalletAccount = user;

  const sendSchema = z
    .object({
      token: z.string().min(18, "Token must be at least 18 characters"),
      amount: z
        .number()
        .positive("Amount must be greater than 0")
        .max(10_000_000, "Amount must be less than 10,000,000"),
      purpose: z.enum(["gift", "settle", "art", "commission", "other"]),
      note: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!recipient) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Token Not Found",
          path: ["token"],
        });
      }
    });

  // Form Setup
  const form = useForm<SendFormData>({
    resolver: zodResolver(sendSchema),
    mode: "onChange",
    defaultValues: {
      token: "",
      amount: 0,
      purpose: "gift",
      note: "",
    },
  });

  const { watch, formState } = form;
  const token = watch("token");
  const amount = watch("amount") || 0;

  // Recipient Lookup (memoized)
  const recipient = useMemo(() => {
    if (!token || token.length < 10) return null;
    return findObj<WalletAccount>({
      collection: "users",
      id: token,
      prop: "token",
    });
  }, [token]);

  // Zod Schema

  // Re-validate when recipient changes
  useEffect(() => {
    form.trigger("token");
  }, [recipient, form]);

  const onSubmit = async (data: SendFormData) => {
    if (!recipient || !u) return;

    if (recipient?.token == u?.token) {
      toast.info({
        title: "Info",
        description: `Can't Enter Your Personal Token`,
      });
      return;
    }

    try {
      const newSenderBalance = (u.wallet.balance ?? 0) - data.amount;
      const newReceiverBalance = (recipient.wallet.balance ?? 0) + data.amount;

      if (newSenderBalance < 0) {
        toast.error({ title: "Insufficient Balance" });
        return;
      }

      // Sender Transaction
      const payloadSender: Omit<WalletTx, "id"> = {
        channel: "P2P Transfer",
        amount: data.amount,
        balanceAfter: newSenderBalance,
        date: serverTimestamp() as unknown as Timestamp,
        createdAt: new Date().toISOString(),
        currency: u.currency,
        symbol: u.symbol,
        email: u.email,
        fullName: u.fullName,
        status: "Approved",
        title: "Transfer Out",
        type: "transfer_out",
        userID: u.userID,
        counterparty: recipient.fullName,
      };

      // Receiver Transaction
      const payloadReceiver: Omit<WalletTx, "id"> = {
        ...payloadSender,
        balanceAfter: newReceiverBalance,
        status: "Approved",
        title: "Transfer In",
        type: "transfer_in",
        userID: recipient.userID,
        email: recipient.email,
        fullName: recipient.fullName,
        currency: recipient.currency,
        symbol: recipient.symbol,
      };

      // Execute both operations
      await addDocToCollection({ collections: "transactions", document: payloadSender });
      await addDocToCollection({ collections: "transactions", document: payloadReceiver });

      // Update balances
      await updateDocument({
        collections: "users",
        document: {
          id: u.id,
          wallet: { ...u.wallet, balance: newSenderBalance },
        },
      });

      await updateDocument({
        collections: "users",
        document: {
          id: recipient.id,
          wallet: { ...recipient.wallet, balance: newReceiverBalance },
        },
      });

      toast.added({
        title: "Transfer Successful",
        description: `${formatMoney(data.amount, u.currency)} sent to ${recipient.fullName}`,
      });

      setDone(true);
    } catch (error: any) {
      console.error(error);
      toast.error({
        title: "Transfer Failed",
        description: error?.message || "Something went wrong",
      });
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-md text-center"
      >
        {/* Success UI */}
        <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-10 shadow-xl wallet-ring">
          <motion.span
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mx-auto grid size-16 place-items-center rounded-full border border-[var(--w-brand)]/40 text-[var(--w-brand)] shadow-lg"
            style={{ background: "var(--w-brand-soft)" }}
          >
            <CheckCircle2 className="size-8" strokeWidth={2} />
          </motion.span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
            {formatMoney(amount, u.currency)} sent
          </h1>
          <p className="mt-2 text-sm text-[var(--w-muted)]">
            New balance: {formatMoney(u.wallet.balance ?? 0 - amount, u.currency)}
          </p>
          <Link
            to="/wallet"
            className="mt-6 inline-block w-full rounded-[1.4rem] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] shadow-lg"
            style={{ background: "var(--w-brand)", color: "var(--w-brand-contrast)" }}
          >
            Back to Wallet
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
          {recipient && recipient?.token != u?.token && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[2rem] border border-[var(--w-brand)]/30 bg-[var(--w-brand-soft)] p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-brand)]">
                RECIPIENT FOUND
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
                  <p className="truncate font-extrabold">{recipient.fullName}</p>
                  <p className="truncate text-xs text-[var(--w-muted)]">{recipient.email}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
              SUMMARY
            </p>
            <h3 className="mt-1 text-2xl font-extrabold tracking-tight">
              {formatMoney(amount, u.currency, { withSymbol: true })}
            </h3>
            {/* Summary rows */}
          </div>
        </div>
      }
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <WInput
            label="Recipient token"
            placeholder="AET-XXXX-XXXX-XXXX"
            name="token"
            className="font-mono tracking-wider"
            icon={<KeyRound className="size-4" />}
            hint="Ask the recipient for their wallet token."
          />

          <WAmount name="amount" schema="transfer" currency={u.currency} />

          <WRow>
            <WSelect
              label="Purpose"
              placeholder="Select a purpose"
              value={purpose}
              onChange={(v) => {
                setPurpose(v);
                form.setValue("purpose", v);
              }}
              options={PURPOSES}
              name="purpose"
            />
          </WRow>

          <WTextarea
            label="Note (optional)"
            name="note"
            className="!text-base"
            placeholder="For the framing of the Marchand triptych…"
          />

          <WSubmit type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
            {/* <Send className="size-4" /> */}
            {/* Send {formatMoney(amount, u.currency)} */}
            Proceed
          </WSubmit>

          {/* {!form.formState.isValid && Object.keys(form.formState.errors).length > 0 && (
            <p className="text-center text-[11px] text-red-500">Please fix the errors above.</p>
          )} */}
        </form>
      </FormProvider>
    </FormPage>
  );
}
