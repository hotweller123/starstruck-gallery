import { AuctionLot } from "@/data/auctions";
import { AdminWallet, WalletAccount, WalletTx } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DataStore {
  transactions: WalletTx[];
  users: WalletAccount[];
  wallets: AdminWallet[];
  auctions: AuctionLot[];
  setState: (state: Partial<Omit<DataStore, "setState">>) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      users: [],
      auctions: [],
      wallets: Array.from({ length: 3 }).map((_, i) => ({
        address: "fsadfsdfsfasdfasfsagsafdgib;l;",
        id: `${i}`,
        image: "asdhfofhosdhbauodsfb;nsfdsa",
        name: "Ethereum",
        network: `TRC ${i + 21}`,
      })),
      setState: (state) => {
        set((stateValues) => ({
          ...stateValues,
          ...state,
        }));
      },
    }),
    {
      name: "_dataStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
