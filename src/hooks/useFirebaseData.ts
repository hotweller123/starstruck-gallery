import { AuctionLot } from "@/data/auctions";
import { useFirebaseQueryCollection } from "@/queries/firebasequeries";
import { useAuthStore, useDataStore } from "@/store/zustand";
import { AdminWallet, Bid, Listing, WalletAccount, WalletTx } from "@/types";
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
    user?.role == "user" ? [where("userID", "==", user?.userID)] : [],
  );
  const users = useFirebaseQueryCollection("users");
  const auctions = useFirebaseQueryCollection("auctions");
  const bids = useFirebaseQueryCollection(
    "bids",
    user?.role == "user" ? [where("userID", "==", user?.userID)] : [],
  );
  const listings = useFirebaseQueryCollection(
    "listings",
    user?.role == "user" ? [where("userID", "==", user?.userID)] : [],
  );
  const wallets = useFirebaseQueryCollection(
    "wallets",
    // user?.role == "user" ? [where("userID", "==", user?.userID)] : [],
  );
  const { setState } = useDataStore(
    useShallow((state) => ({
      setState: state.setState,
    })),
  );

  const isLoading =
    transactions.isLoading ||
    users.isLoading ||
    auctions.isLoading ||
    bids.isLoading ||
    listings.isLoading ||
    wallets.isLoading;

  if (transactions.data) {
    setState({
      transactions: transactions.data as WalletTx[],
    });
  }

  if (users.data) {
    setState({
      users: users.data as WalletAccount[],
    });
  }

  if (auctions.data) {
    setState({
      auctions: auctions.data as AuctionLot[],
    });
  }

  if (bids.data) {
    setState({
      bids: bids.data as Bid[],
    });
  }

  if (listings.data) {
    setState({
      listings: listings.data as Listing[],
    });
  }

  if (wallets.data) {
    setState({
      wallets: wallets.data as AdminWallet[],
    });
  }

  // const dataMappings = [
  //   { key: "transactions", data: transactions.data, type: "WalletTx[]" },
  //   { key: "users", data: users.data, type: "WalletAccount[]" },
  //   { key: "auctions", data: auctions.data, type: "AuctionLot[]" },
  //   { key: "bids", data: bids.data, type: "Bid[]" },
  //   { key: "listings", data: listings.data, type: "Listing[]" },
  //   { key: "wallets", data: wallets.data, type: "AdminWallet[]" },
  // ];

  // dataMappings.forEach(({ key, data, type }) => {
  //   if (data) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       [key]: data as any, // Replace `any` with the appropriate type if needed
  //     }));
  //   }
  // });

  return {
    transactions: transactions.data ?? [],
    users: users.data ?? [],
    auctions: auctions.data ?? [],
    bids: bids.data ?? [],
    listings: listings.data ?? [],
    wallets: wallets.data ?? [],

    isLoading,
    // You can also expose the raw query objects if needed
    queries: {
      transactions,
      users,
      auctions,
      bids,
      listings,
      wallets,
    },
  };
}
