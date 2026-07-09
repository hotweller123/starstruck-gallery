import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type TxType =
  | "deposit"
  | "withdraw"
  | "transfer_out"
  | "transfer_in"
  | "purchase"
  | "bid_hold"
  | "bid_release"
  | "sale";

export interface WalletAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  token: string;
  balance: number;
  createdAt: string;
}

export interface WalletTx {
  id: string;
  accountId: string;
  type: TxType;
  amount: number; // always positive; sign derived from type
  balanceAfter: number;
  note?: string;
  counterparty?: string;
  createdAt: string;
}

interface State {
  accounts: WalletAccount[];
  currentAccountId: string | null;
  transactions: WalletTx[];
}

interface Result {
  ok: boolean;
  error?: string;
}

interface Wallet extends State {
  currentAccount: WalletAccount | null;
  signedIn: boolean;
  register: (input: { name: string; email: string; password: string }) => Result;
  signIn: (input: { email: string; password: string }) => Result;
  signOut: () => void;
  deposit: (amount: number, note?: string) => Result;
  withdraw: (amount: number, note?: string) => Result;
  transfer: (toToken: string, amount: number, note?: string) => Result;
  // Used by the site (requires a connected wallet account, debits its balance)
  debitAccount: (accountId: string, amount: number, type: TxType, note?: string) => Result;
  creditAccount: (accountId: string, amount: number, type: TxType, note?: string) => Result;
  getAccount: (id: string | null) => WalletAccount | null;
  getAccountByToken: (token: string) => WalletAccount | null;
  txsFor: (accountId: string) => WalletTx[];
  regenerateToken: () => Result;
}

const Ctx = createContext<Wallet | null>(null);
const KEY = "aethelred.wallet.v1";
const empty: State = { accounts: [], currentAccountId: null, transactions: [] };

function load(): State {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

// Demo-only hash. Clearly labelled in UI as not production-grade.
function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36) + s.length.toString(36);
}

function makeToken(): string {
  const part = () =>
    Math.random()
      .toString(36)
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase()
      .padEnd(4, "X");
  return `AET-${part()}-${part()}-${part()}`;
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const currentAccount = state.accounts.find((a) => a.id === state.currentAccountId) ?? null;

  const pushTx = (
    s: State,
    accountId: string,
    type: TxType,
    amount: number,
    balanceAfter: number,
    note?: string,
    counterparty?: string,
  ): WalletTx => ({
    id: uid(),
    accountId,
    type,
    amount,
    balanceAfter,
    note,
    counterparty,
    createdAt: new Date().toISOString(),
  });

  const value: Wallet = {
    ...state,
    currentAccount,
    signedIn: !!currentAccount,

    register: ({ name, email, password }) => {
      const e = email.trim().toLowerCase();
      if (!name.trim() || !e || password.length < 6)
        return { ok: false, error: "Fill all fields. Password ≥ 6 chars." };
      if (state.accounts.some((a) => a.email === e))
        return { ok: false, error: "An account with that email exists." };
      const acc: WalletAccount = {
        id: uid(),
        email: e,
        name: name.trim(),
        passwordHash: password,
        token: makeToken(),
        balance: 0,
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({
        ...s,
        accounts: [...s.accounts, acc],
        currentAccountId: acc.id,
      }));
      return { ok: true };
    },

    signIn: ({ email, password }) => {
      const e = email.trim().toLowerCase();
      const acc = state.accounts.find((a) => a.email === e);
      if (!acc || acc.passwordHash !== password)
        return { ok: false, error: "Invalid email or password." };
      setState((s) => ({ ...s, currentAccountId: acc.id }));
      return { ok: true };
    },

    signOut: () => setState((s) => ({ ...s, currentAccountId: null })),

    deposit: (amount, note) => {
      if (!currentAccount) return { ok: false, error: "Sign in first." };
      if (amount <= 0) return { ok: false, error: "Amount must be positive." };
      setState((s) => {
        const acc = s.accounts.find((a) => a.id === currentAccount.id);
        if (!acc) return s;
        const newBal = acc.balance + amount;
        return {
          ...s,
          accounts: s.accounts.map((a) => (a.id === acc.id ? { ...a, balance: newBal } : a)),
          transactions: [
            pushTx(s, acc.id, "deposit", amount, newBal, note ?? "Card deposit"),
            ...s.transactions,
          ],
        };
      });
      return { ok: true };
    },

    withdraw: (amount, note) => {
      if (!currentAccount) return { ok: false, error: "Sign in first." };
      if (amount <= 0) return { ok: false, error: "Amount must be positive." };
      if (currentAccount.balance < amount) return { ok: false, error: "Insufficient funds." };
      setState((s) => {
        const acc = s.accounts.find((a) => a.id === currentAccount.id);
        if (!acc) return s;
        const newBal = acc.balance - amount;
        return {
          ...s,
          accounts: s.accounts.map((a) => (a.id === acc.id ? { ...a, balance: newBal } : a)),
          transactions: [
            pushTx(s, acc.id, "withdraw", amount, newBal, note ?? "Bank withdrawal"),
            ...s.transactions,
          ],
        };
      });
      return { ok: true };
    },

    transfer: (toToken, amount, note) => {
      if (!currentAccount) return { ok: false, error: "Sign in first." };
      if (amount <= 0) return { ok: false, error: "Amount must be positive." };
      const to = state.accounts.find((a) => a.token === toToken.trim().toUpperCase());
      if (!to) return { ok: false, error: "Recipient token not found." };
      if (to.id === currentAccount.id) return { ok: false, error: "Can't transfer to yourself." };
      if (currentAccount.balance < amount) return { ok: false, error: "Insufficient funds." };
      setState((s) => {
        const from = s.accounts.find((a) => a.id === currentAccount.id);
        const recipient = s.accounts.find((a) => a.id === to.id);
        if (!from || !recipient) return s;
        const fromBal = from.balance - amount;
        const toBal = recipient.balance + amount;
        return {
          ...s,
          accounts: s.accounts.map((a) =>
            a.id === from.id
              ? { ...a, balance: fromBal }
              : a.id === recipient.id
                ? { ...a, balance: toBal }
                : a,
          ),
          transactions: [
            pushTx(s, from.id, "transfer_out", amount, fromBal, note, recipient.name),
            pushTx(s, recipient.id, "transfer_in", amount, toBal, note, from.name),
            ...s.transactions,
          ],
        };
      });
      return { ok: true };
    },

    debitAccount: (accountId, amount, type, note) => {
      const acc = state.accounts.find((a) => a.id === accountId);
      if (!acc) return { ok: false, error: "Wallet not found." };
      if (acc.balance < amount) return { ok: false, error: "Insufficient wallet balance." };
      setState((s) => {
        const a = s.accounts.find((x) => x.id === accountId);
        if (!a) return s;
        const newBal = a.balance - amount;
        return {
          ...s,
          accounts: s.accounts.map((x) => (x.id === a.id ? { ...x, balance: newBal } : x)),
          transactions: [pushTx(s, a.id, type, amount, newBal, note), ...s.transactions],
        };
      });
      return { ok: true };
    },

    creditAccount: (accountId, amount, type, note) => {
      const acc = state.accounts.find((a) => a.id === accountId);
      if (!acc) return { ok: false, error: "Wallet not found." };
      setState((s) => {
        const a = s.accounts.find((x) => x.id === accountId);
        if (!a) return s;
        const newBal = a.balance + amount;
        return {
          ...s,
          accounts: s.accounts.map((x) => (x.id === a.id ? { ...x, balance: newBal } : x)),
          transactions: [pushTx(s, a.id, type, amount, newBal, note), ...s.transactions],
        };
      });
      return { ok: true };
    },

    getAccount: (id) => (id ? (state.accounts.find((a) => a.id === id) ?? null) : null),
    getAccountByToken: (token) =>
      state.accounts.find((a) => a.token === token.trim().toUpperCase()) ?? null,
    txsFor: (accountId) => state.transactions.filter((t) => t.accountId === accountId),

    regenerateToken: () => {
      if (!currentAccount) return { ok: false, error: "Sign in first." };
      setState((s) => ({
        ...s,
        accounts: s.accounts.map((a) =>
          a.id === currentAccount.id ? { ...a, token: makeToken() } : a,
        ),
      }));
      return { ok: true };
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWallet() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export const TX_LABEL: Record<TxType, string> = {
  deposit: "Deposit",
  withdraw: "Withdrawal",
  transfer_out: "Sent",
  transfer_in: "Received",
  purchase: "Purchase",
  bid_hold: "Bid placed",
  bid_release: "Bid released",
  sale: "Sale",
};

export function txSign(type: TxType): 1 | -1 {
  return type === "deposit" || type === "transfer_in" || type === "bid_release" || type === "sale"
    ? 1
    : -1;
}
