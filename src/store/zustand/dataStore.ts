import { AuctionLot } from "@/data/auctions";
import { AdminWallet, Bid, WalletAccount, WalletTx } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DataStore {
  transactions: WalletTx[];
  users: WalletAccount[];
  wallets: AdminWallet[];
  auctions: AuctionLot[];
  bids: Bid[];
  setState: (state: Partial<Omit<DataStore, "setState">>) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      users: [],
      auctions: [],
      bids: [],
      wallets: Array.from({ length: 3 }).map((_, i) => ({
        address: "fsadfsdfsfasdfasfsagsafdgib;l;",
        id: `${i}`,
        image: "asdhfofhosdhbauodsfb;nsfdsa",
        name: "Ethereum",
        network: `TRC ${i + 21}`,
        memo: "This is the memo of the admin wallet",
        isDefault: false,
        createdAt: new Date().toISOString(),
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
