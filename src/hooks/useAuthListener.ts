import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { useAuthStore } from "@/store/zustand";
import type { WalletAccount } from "@/types";
import { useShallow } from "zustand/shallow";
import { saveUserDataLocally } from "@/routes/__root";

/**
 * Best-practice Firebase auth listener for wallet.
 *
 * - Listens once via onAuthStateChanged
 * - On login: fetches the Firestore user doc using the UID
 * - Sets the user into useAuthStore via setUser (handles loading + hydrated)
 * - On logout or no doc: clears the user
 * - Handles the initial "still checking" state correctly
 */
export function useAuthListener() {
  const { setUser, setLoading } = useAuthStore(
    useShallow((s) => ({
      setUser: s.setUser,
      setLoading: s.setLoading,
    })),
  );

  useEffect(() => {
    // Mark that we started the auth resolution
    setLoading(true, false);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // Signed out
        setUser(null);
        return;
      }

      try {
        // Fetch the authoritative user document from Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = { id: userSnap.id, ...userSnap.data() } as WalletAccount;

          // Optional: keep some fields fresh from Auth if you want
          // userData.email = firebaseUser.email ?? userData.email;

          setUser(userData);
        } else {
          // User exists in Auth but no Firestore profile yet (edge case)
          console.warn("[auth] No Firestore user doc for uid:", firebaseUser.uid);
          setUser(null);
        }
      } catch (error) {
        console.error("[auth] Failed to fetch user document:", error);
        // Fail safe: don't keep a stale user if we can't load their data
        setUser(null);
      }
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [setUser, setLoading]);
}
