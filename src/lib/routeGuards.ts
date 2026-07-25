import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/zustand";
import { Timestamp } from "firebase/firestore";

export const requireAuth = async () => {
  try {
    const user = await useAuthStore.getState().user; // Assume getUser fetches the user
    if (user && user.createdAt instanceof Timestamp) {
      user.createdAt = user.createdAt.toDate().toISOString(); // Convert Timestamp to string
    }
    return { user };
  } catch {
    throw redirect({ to: "/connect" });
  }
};

export const requireAdmin = async () => {
  const { user } = await requireAuth();
  if (user?.role?.includes("admin")) return { user };
  throw redirect({ to: "/wallet" });
};
