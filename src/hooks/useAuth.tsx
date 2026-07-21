import { getUserName, makeToken } from "@/utils";
import { auth, db } from "@/services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";

import { WalletAccount } from "@/types";
import { getCurrencySymbol } from "@/utils";
import { useCallback, useState } from "react";
import { useAuthStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";

interface AuthField {
  fullName: string;
  email: string;
  password: string;
  currency: string;
}
/**
 * A custom hook for using firebase authentication function to register, login and check user authentication status
 * @param { fullName email password}
 */
export default function useAuth() {
  const { setUser } = useAuthStore(
    useShallow((state) => ({
      setUser: state.setUser,
    })),
  );

  const registerUser = async (user: AuthField) => {
    try {
      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(auth, user.email, user.password);

      const currentUser = doc(db, "users", uid);
      const acc: WalletAccount & { userName: string } = {
        blocked: false,
        userID: uid,
        id: uid,
        role: "user",
        status: "active",
        currency: "USD",
        category: "users",
        symbol: "$",
        email: user.email.trim(),
        userName: getUserName(user.email.trim()),
        fullName: user.fullName.trim(),
        password: user.password,
        token: makeToken(),
        wallet: {
          balance: 0,
          bidBalance: 0,
        },
        createdAt: serverTimestamp() as unknown as Timestamp,
        joinedDate: new Date().toISOString(),
      };

      // Use the canonical setter (also marks hydrated)
      setUser(acc);

      await setDoc(currentUser, acc);

      return {
        ...acc,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Register failed";
      throw new Error(message);
    }
  };

  const loginUser = useCallback(
    async (email: string, password: string) => {
      try {
        const userLogin = await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, "users", userLogin.user.uid);
        const currentUserDoc = await getDoc(userRef);
        if (currentUserDoc.exists()) {
          const props = { id: currentUserDoc.id, ...currentUserDoc.data() } as WalletAccount;
          // Canonical setter: updates user + loggedIn + clears loading + sets hydrated
          setUser(props);
        } else {
          setUser(null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        throw new Error(message);
      }
    },
    [setUser],
  );

  const logOut = useCallback(async () => {
    try {
      await signOut(auth);
      // This will also be caught by the root listener, but we clear immediately for snappy UX
      setUser(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign out failed";
      throw new Error(message);
    }
  }, [setUser]);

  return {
    registerUser,
    loginUser,
    logOut,
  };
}
