import { makeToken } from "@/lib/wallet";
import { auth, db } from "@/services/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  namedQuery,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { WalletAccount } from "@/types";
import { getCurrencySymbol } from "@/utils";
import { useCallback, useEffect } from "react";
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
  const { setState } = useAuthStore(
    useShallow((state) => ({
      setState: state.setState,
    })),
  );

  const registerUser = async (user: AuthField) => {
    try {
      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(auth, user.email, user.password);

      const currentUser = doc(db, "users", uid);
      const acc: WalletAccount = {
        blocked: false,
        userID: uid,
        id: uid,
        role: "user",
        status: "active",
        currency: user.currency,
        category: "users",
        symbol: getCurrencySymbol(user.currency),
        email: user.email.trim(),
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

      console.log(acc);
      setState({
        user: acc,
        loggedIn: true,
      });

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
        const user = doc(db, "users", userLogin.user.uid);
        const currentUserDoc = await getDoc(user);
        if (currentUserDoc.exists()) {
          const props = currentUserDoc.data() as WalletAccount;
          setState({
            user: props,
            loggedIn: true,
          });
        } else
          setState({
            user: null,
            loggedIn: false,
          });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        throw new Error(message);
      }
    },
    [setState],
  );

  const logOut = useCallback(async () => {
    await signOut(auth)
      .then(() => {
        setState({
          user: null,
          loggedIn: false,
        });
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Register failed";
        throw new Error(message);
      });
  }, []);

  return {
    registerUser,
    loginUser,
    logOut,
  };
}
