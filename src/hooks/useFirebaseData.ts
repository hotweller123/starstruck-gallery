import { AuctionLot } from "@/data/auctions";
import { useFirebaseQueryCollection } from "@/queries/firebasequeries";
import { useDataStore } from "@/store/zustand";
import { WalletAccount, WalletTx } from "@/types";
import { useShallow } from "zustand/shallow";

/**
 * Convenience hook to fetch multiple Firebase collections at once.
 * Safe to use anywhere as long as you're inside <QueryClientProvider>.
 */
export function useFirebaseDataHook() {
  const transactions = useFirebaseQueryCollection("transactions");
  const users = useFirebaseQueryCollection("users");
  const auctions = useFirebaseQueryCollection("auctions");
  const { setState } = useDataStore(
    useShallow((state) => ({
      setState: state.setState,
    })),
  );

  const isLoading = transactions.isLoading || users.isLoading;

  if (transactions.data && users.data) {
    setState({
      transactions: transactions.data as WalletTx[],
      users: users.data as WalletAccount[],
      auctions: auctions.data as AuctionLot[],
    });
  }

  return {
    transactions: transactions.data ?? [],
    users: users.data ?? [],
    auctions: auctions.data ?? [],

    isLoading,
    // You can also expose the raw query objects if needed
    queries: {
      transactions,
      users,
      auctions,
    },
  };
}
