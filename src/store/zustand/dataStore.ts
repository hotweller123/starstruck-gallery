import { AuctionLot } from "@/data/auctions";
import { AdminWallet, Bid, Listing, WalletAccount, WalletTx } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DataStore {
  transactions: WalletTx[];
  users: WalletAccount[];
  wallets: AdminWallet[];
  auctions: AuctionLot[];
  bids: Bid[];
  listings: Listing[];
  setState: (state: Partial<Omit<DataStore, "setState">>) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      users: [],
      auctions: [],
      bids: [],
      wallets: [],
      listings: [],
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
