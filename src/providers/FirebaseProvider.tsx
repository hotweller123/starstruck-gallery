import React, { createContext, useContext, ReactNode } from "react";
import { useFirebaseQueryCollection } from "@/queries/firebasequeries";
import { useFirebaseDataHook } from "@/hooks/useFirebaseData";
import { WalletAccount, WalletTx } from "@/types";

interface FirebaseData {
  transactions: WalletTx[];
  users: WalletAccount[];
  // deposits: any[];
  // withdrawals: any[];
  // transfers: any[];
  isLoading: boolean;
  queries: any;
}

const FirebaseContext = createContext<FirebaseData | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }): ReactNode {
  // Safe here because this runs inside QueryClientProvider
  const data = useFirebaseDataHook();

  return (
    <FirebaseContext.Provider value={data as FirebaseData}>{children}</FirebaseContext.Provider>
  );
}

export function useFirebaseData() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebaseData must be used inside FirebaseProvider");
  }
  return context;
}

// You can also import and use this hook directly anywhere (as long as inside QueryClientProvider):
// import { useFirebaseData } from "@/hooks/useFirebaseData";
