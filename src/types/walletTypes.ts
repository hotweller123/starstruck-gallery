import { Timestamp } from "firebase/firestore";

export type TxType =
  | "deposit"
  | "withdraw"
  | "transfer_out"
  | "transfer_in"
  | "purchase"
  | "bid_hold"
  | "bid_release"
  | "sale";

export interface AdminWallet {
  name: string;
  network: string;
  address: string;
  image: string;
  id: string;
}

export interface WalletAccount {
  id: string;
  userID: string;
  email: string;
  fullName: string;
  userName: string;
  password: string;
  currency: string;
  symbol: string;
  token: string;
  category?: string;
  wallet: {
    bidBalance: number;
    balance: number;
  };
  blocked: boolean;
  status: "active" | "pending" | "suspended";
  role: "user" | "admin";
  createdAt: Timestamp | string;
  joinedDate: string;
}

export type TransactionStatus = "Approved" | "Pending" | "On Hold" | "Failed";

export interface WalletTx {
  id: string;
  userID: string;
  type: TxType;
  amount: number; // always positive; sign derived from type
  balanceAfter: number;
  note?: string;
  counterparty?: string;
  createdAt: string;
  date: Timestamp;

  //note: todo...turn the optional to mandatory
  title: string;
  fullName: string;
  email: string;
  status: TransactionStatus;
  channel: string;
  currency: string;
  symbol: string;
  details?: Record<string, string>;
}

export interface NotificationType {
  id: string;
  userID: string;
  kind: TxType;
  title: string;
  body: string;
  time: string | number;
  unread: boolean;
  timeStamp?: string;
}

export interface State {
  accounts: WalletAccount[];
  currentAccountId: string | null;
  transactions: WalletTx[];
}

export interface Result {
  ok: boolean;
  error?: string;
}
