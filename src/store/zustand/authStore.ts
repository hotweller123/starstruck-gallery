import { WalletAccount } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type StoreKey = keyof AuthStore;

interface AuthStore {
  user: WalletAccount | null;
  loggedIn: boolean;
  loading: boolean;
  setState: (state: Partial<AuthStore>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      loggedIn: false,
      loading: false,
      setState: (state) => {
        set((stateValues) => ({
          ...stateValues,
          ...state,
        }));
      },
    }),
    {
      name: "authStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
