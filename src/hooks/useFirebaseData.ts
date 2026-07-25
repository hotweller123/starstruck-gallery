import { AuctionLot } from "@/data/auctions";
import { useFirebaseQueryCollection } from "@/queries/firebasequeries";
import { useAuthStore, useDataStore } from "@/store/zustand";
import { Bid, WalletAccount, WalletTx } from "@/types";
import { query, where } from "firebase/firestore";
import { useShallow } from "zustand/shallow";

/**
 * Convenience hook to fetch multiple Firebase collections at once.
 * Safe to use anywhere as long as you're inside <QueryClientProvider>.
 */
export function useFirebaseDataHook() {
  const { user } = useAuthStore();

  const transactions = useFirebaseQueryCollection(
    "transactions",
    user ? [where("userID", "==", user?.userID)] : [],
  );
  const users = useFirebaseQueryCollection("users");
  const auctions = useFirebaseQueryCollection("auctions");
  const bids = useFirebaseQueryCollection(
    "bids",
    user ? [where("userID", "==", user?.userID)] : [],
  );
  const { setState } = useDataStore(
    useShallow((state) => ({
      setState: state.setState,
    })),
  );

  const isLoading =
    transactions.isLoading || users.isLoading || auctions.isLoading || bids.isLoading;

  if (transactions.data && users.data) {
    setState({
      transactions: transactions.data as WalletTx[],
      users: users.data as WalletAccount[],
      auctions: auctions.data as AuctionLot[],
      bids: bids.data as Bid[],
    });
  }

  return {
    transactions: transactions.data ?? [],
    users: users.data ?? [],
    auctions: auctions.data ?? [],
    bids: bids.data ?? [],

    isLoading,
    // You can also expose the raw query objects if needed
    queries: {
      transactions,
      users,
      auctions,
      bids,
    },
  };
}
