import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { getValueAsType, motion } from "motion/react";
import {
  ArrowUpFromLine,
  Building2,
  CheckCircle2,
  CpuIcon,
  DecimalsArrowLeftIcon,
  Globe,
  Hash,
  Network,
  RadarIcon,
  User,
} from "lucide-react";
import { FormPage, WAmount, WInput, WSelect, WSubmit, WRow } from "@/components/wallet/FormPage";
import { FormProvider, useForm } from "react-hook-form";
import { useAuthStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WalletTx } from "@/types";
import { toast } from "@/lib/useToast";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { WalletLoader } from "@/components/wallet";
import { formatMoney } from "@/utils";
import useDoc from "@/hooks/useDoc";

export const Route = createFileRoute("/wallet/withdraw")({
  component: WithdrawPage,
  head: () => ({ meta: [{ title: "Withdraw — EmberPay" }] }),
});

export interface WithdrawalSchema {
  amount: number;
}

const SPEEDS = [
  { value: "instant", label: "Instant · 1% fee" },
  { value: "standard", label: "Standard · 1–2 days · free" },
];

const CHANNELS = [
  { value: "crypto", label: "Crypto" },
  { value: "bank", label: "Bank" },
];

const COUNTRIES = [
  { value: "Portugal", label: "Portugal" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
];

const forBank = {
  country: z.string().min(1, { message: "Select A Country" }),
  holder: z.string().min(1, { message: "Account Holder is required" }),
  iban: z.string().min(1, { message: "IBAN is required" }),
  swift: z.string().min(1, { message: "Swift Code is required" }),
  reference: z.string().min(1, { message: "Reference is required" }),
};

const forCrypto = {
  network: z.string().min(1, { message: "Wallet Network is required" }),
  address: z.string().min(40, { message: "Wallet Address Should Be At Least 40 Characters" }),
};

function WithdrawPage() {
  const { user, isAuthHydrated, loading } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      isAuthHydrated: s.isAuthHydrated,
      loading: s.loading,
    })),
  );

  if (!user || loading || !isAuthHydrated) {
    return <WalletLoader fullscreen showSkeleton={false} message="Preparing Withdrawals..." />;
  }

  const { addDocToCollection, updateDocument } = useDoc();
  const [channel, setChannel] = useState("crypto");
  const [country, setCountry] = useState("");
  const [bank, setBank] = useState("");

  const [done, setDone] = useState<number | string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const withdrawalSchema = z.object({
    amount: z
      .number()
      .positive("Enter an amount")
      .max(1_000_0000, { message: "Amount Must Be Less Than 10,000,000" }),
    name: z.string().min(1, { message: "Name is required" }),
    ...(channel == "crypto" ? { ...forCrypto } : { ...forBank }),
  });

  const formControl = useForm({
    resolver: zodResolver(withdrawalSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      name: "",
      ...(channel == "crypto"
        ? {
            network: "",
            address: "",
          }
        : {
            country: "",
            iban: "",
            swift: "",
            reference: "",
            holder: "",
          }),
    },
  });

  const amount = formControl.watch("amount");
  const submit = formControl.handleSubmit(
    async (data) => {
      if (user?.wallet.balance < amount) {
        toast.error({
          title: "Insufficient Balance",
        });
        return;
      }
      const balanceAfter = Math.max(0, user?.wallet.balance - amount);

      try {
        const payload: Omit<WalletTx, "id"> = {
          channel,
          amount,
          balanceAfter,
          date: serverTimestamp() as unknown as Timestamp,
          createdAt: new Date().toISOString(),
          currency: user?.currency,
          symbol: user?.symbol,
          email: user?.email,
          fullName: user?.fullName,
          status: "Pending",
          title: "Withdrawal",
          type: "withdraw",
          userID: user?.userID,
          counterparty: "counterparty",
          note: "Withdrawal note",
          details: {
            name: formControl.getValues("name"),
            ...(channel == "crypto"
              ? {
                  network: (formControl.getValues("network") as string) || "",
                  address: (formControl.getValues("address") as string) || "",
                }
              : {
                  country: (formControl.getValues("country") as string) || "",
                  iban: (formControl.getValues("iban") as string) || "",
                  swift: (formControl.getValues("swift") as string) || "",
                  reference: (formControl.getValues("reference") as string) || "",
                  holder: (formControl.getValues("holder") as string) || "",
                }),
          },
        };

        await addDocToCollection({
          collections: "transactions",
          document: payload,
        });

        await updateDocument({
          collections: "users",
          document: {
            id: user?.userID,
            wallet: {
              bidBalance: user?.wallet?.bidBalance,
              balance: balanceAfter,
            },
          },
        });

        setDone(
          formatMoney(amount, user?.currency, {
            withSymbol: true,
            decimals: 2,
          }),
        );

        toast.success({
          title: "Success",
          description: "Your Withdrawal is in process",
          position: "bottom-left",
        });
      } catch (error) {
        toast.error({
          title: "Error Message",
          description: error?.message,
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

  if (done !== null) {
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
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
            {formatMoney(amount, user?.currency, {
              withSymbol: true,
              decimals: 2,
            })}{" "}
            withdrawn
          </h1>
          <p className="mt-2 text-sm text-[var(--w-muted)]">
            New balance{" "}
            {formatMoney(user?.wallet?.balance, user?.currency, {
              withSymbol: true,
              decimals: 2,
            })}
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

  // const fee = speed === "instant" ? Math.round(amount * 0.01 * 100) / 100 : 0;

  return (
    <FormPage
      eyebrow="Cash out"
      title="Withdraw"
      subtitle={`Available · ${formatMoney(user?.wallet.balance, user?.currency)}`}
      icon={<ArrowUpFromLine className="size-6" strokeWidth={2.2} />}
      aside={
        <div className="sticky top-28 rounded-[2rem] border border-[var(--w-border)] bg-[var(--w-surface)] p-6 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--w-muted)]">
            Summary
          </p>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--w-fg)]">
            {`${user?.symbol} ${amount.toLocaleString()}`}
          </h3>
          <dl className="mt-5 flex flex-col gap-3 text-sm">
            <Row
              label="Destination"
              value={`${(formControl.watch("name") || "N/A") + ","} ${country}`}
            />
            {/* <Row label="Speed" value={speed === "instant" ? "Instant" : "Standard"} /> */}
            {/* <Row label="Fee" value={formatMoney(fee)} /> */}
            <div className="border-t border-[var(--w-border)] pt-3">
              {/* <Row label="They receive" value={formatMoney(amount - fee)} bold /> */}
            </div>
          </dl>
        </div>
      }
    >
      <FormProvider {...formControl}>
        <form onSubmit={submit} className="flex flex-col gap-5">
          <WAmount schema="withdraw" name="amount" currency={user?.currency} />

          <WSelect
            name="channel"
            label="Channel"
            value={channel}
            onChange={setChannel}
            options={CHANNELS}
          />

          <div className="rounded-[1.5rem] border border-[var(--w-border)] bg-[var(--w-bg-2)] p-5">
            <div className="flex items-center gap-3">
              <Building2 className="size-5 text-[var(--w-brand)]" strokeWidth={2} />
              <p className="text-sm font-extrabold text-[var(--w-fg)] capitalize">
                {channel} Method
              </p>
            </div>
            {channel == "bank" && (
              <>
                <div className="mt-4 grid gap-3">
                  <WRow>
                    <WSelect
                      label="Country"
                      name="country"
                      onChange={(v) => {
                        setCountry(v);
                        console.log(v);
                        formControl.setValue("country", v);
                      }}
                      value={country}
                      options={COUNTRIES}
                    />
                    <WInput
                      label="Bank name"
                      name="name"
                      schema="withdraw"
                      icon={<Globe className="size-4" />}
                    />
                  </WRow>
                  <WInput
                    label="Account holder"
                    name="holder"
                    schema="withdraw"
                    icon={<User className="size-4" />}
                  />
                  <WRow>
                    <WInput
                      label="IBAN / Account"
                      name="iban"
                      schema="withdraw"
                      icon={<Hash className="size-4" />}
                      className="font-mono"
                    />
                    <WInput
                      label="SWIFT / BIC"
                      name="swift"
                      schema="withdraw"
                      className="font-mono"
                      icon={<RadarIcon className="size-4" />}
                    />
                  </WRow>
                  <WInput
                    label="Reference"
                    name="reference"
                    schema="withdraw"
                    hint="Shown on your bank statement."
                    icon={<DecimalsArrowLeftIcon className="size-4" />}
                  />
                </div>
              </>
            )}
            {channel == "crypto" && (
              <>
                <div className="space-y-2 mt-2">
                  <WRow>
                    <WInput
                      label="Name"
                      name="name"
                      schema="withdraw"
                      icon={<Hash className="size-4" />}
                      className="font-mono"
                    />
                    <WInput
                      label="Network"
                      name="network"
                      schema="withdraw"
                      className="font-mono"
                      icon={<Network className="size-4" />}
                    />
                  </WRow>
                  <WInput
                    label="Address"
                    name="address"
                    schema="withdraw"
                    hint="Your Valid Wallet Address"
                    icon={<CpuIcon className="size-4" />}
                  />
                </div>
              </>
            )}
          </div>

          {error && (
            <p className="rounded-xl border border-[var(--w-danger)]/40 bg-[var(--w-danger)]/10 px-3 py-2 text-xs font-medium text-[var(--w-danger)] animate__animated animate__headShake">
              {error}
            </p>
          )}

          <WSubmit type="submit">Withdraw {formatMoney(amount, user?.currency)}</WSubmit>
        </form>
      </FormProvider>
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
