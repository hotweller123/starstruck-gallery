import useAuth from "@/hooks/useAuth";
import { useFirebaseData } from "@/providers/FirebaseProvider";
import { useFirebaseQueryDocument } from "@/queries";
import { getLocalUserData } from "@/routes/__root";
import { useAuthStore } from "@/store/zustand";
import { Result, State, TxType, WalletAccount, WalletTx } from "@/types";
import { useEffect, useState, type ReactNode } from "react";
import { useShallow } from "zustand/shallow";

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

// const Ctx = createContext()

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(empty);
  const [hydrated, setHydrated] = useState(false);
  const [id, setId] = useState("");
  const { setUser } = useAuthStore(
    useShallow((state) => ({
      setUser: state.setState,
    })),
  );

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

  return <>{children}</>;
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
