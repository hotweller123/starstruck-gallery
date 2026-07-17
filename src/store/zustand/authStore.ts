import { WalletAccount } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  user: WalletAccount | null;
  loggedIn: boolean;
  loading: boolean;
  /** True while we are still determining auth state (onAuth + Firestore fetch) */
  isAuthHydrated: boolean;
  setState: (state: Partial<AuthStore>) => void;
  /** Helper to set the authenticated user + loggedIn in one go */
  setUser: (user: WalletAccount | null) => void;
  /** Set only the loading flags */
  setLoading: (loading: boolean, isAuthHydrated?: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loggedIn: false,
      loading: true, // start true until listener resolves
      isAuthHydrated: false,
      setState: (state) => {
        set((stateValues) => ({
          ...stateValues,
          ...state,
        }));
      },
      setUser: (user) => {
        set({
          user,
          loggedIn: !!user,
          loading: false,
          isAuthHydrated: true,
        });
      },
      setLoading: (loading, isAuthHydrated) => {
        set((state) => ({
          ...state,
          loading,
          ...(isAuthHydrated !== undefined ? { isAuthHydrated } : {}),
        }));
      },
    }),
    {
      name: "authStore",
      storage: createJSONStorage(() => localStorage),
      // Only persist the user, not transient loading states
      partialize: (state) => ({ user: state.user, loggedIn: state.loggedIn }),
    },
  ),
);
