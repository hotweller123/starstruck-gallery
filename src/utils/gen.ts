import { Collections } from "@/hooks/useDoc";
import { toast, useToast } from "@/lib/useToast";
import { appwriteConfig } from "@/services/appwrite";
import { useDataStore } from "@/store/zustand";
import { clsx, type ClassValue } from "clsx";
import { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { twMerge } from "tailwind-merge";
import z from "zod";
import { Client, Storage, ID } from "appwrite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Scrolls the clicked element into the center of its scrollable parent container.
 * Works reliably on both desktop (mouse) and mobile (touch).
 *
 * Usage:
 *   <button onClick={scrollToCenter}>Click me</button>
 *   // or
 *   <div onClick={(e) => scrollToCenter(e)}>Click</div>
 */
export function scrollToCenter(
  event: ReactMouseEvent<HTMLElement> | ReactTouchEvent<HTMLElement> | MouseEvent | TouchEvent,
  options?: {
    behavior?: ScrollBehavior;
    /** Vertical alignment */
    block?: ScrollLogicalPosition;
    /** Horizontal alignment - 'center' is what you usually want */
    inline?: ScrollLogicalPosition;
  },
) {
  const target = (event.currentTarget || event.target) as HTMLElement | null;
  if (!target) return;

  target.scrollIntoView({
    behavior: options?.behavior ?? "smooth",
    block: options?.block ?? "nearest",
    inline: options?.inline ?? "center",
  });
}

/**
 * @deprecated Use `scrollToCenter` instead.
 * Kept for backward compatibility.
 */
export function moveCenter(event: any, _category?: any) {
  scrollToCenter(event);
}

/**
 * Alternative: Centers an element inside a specific scroll container.
 * Use this when the element is not a direct child or you need more control.
 */
export function scrollElementToCenter(
  element: HTMLElement,
  container?: HTMLElement,
  options?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  },
) {
  if (!element) return;

  if (container) {
    // Manual calculation for precise control inside a specific container
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const isHorizontal = container.scrollWidth > container.clientWidth;

    if (isHorizontal) {
      const scrollLeft =
        container.scrollLeft +
        elementRect.left -
        containerRect.left -
        containerRect.width / 2 +
        elementRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: options?.behavior ?? "smooth",
      });
    } else {
      const scrollTop =
        container.scrollTop +
        elementRect.top -
        containerRect.top -
        containerRect.height / 2 +
        elementRect.height / 2;

      container.scrollTo({
        top: scrollTop,
        behavior: options?.behavior ?? "smooth",
      });
    }
  } else {
    // Simple case - use native scrollIntoView
    element.scrollIntoView({
      behavior: options?.behavior ?? "smooth",
      block: options?.block ?? "center",
      inline: options?.inline ?? "center",
    });
  }
}

export const copyClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.info({
      title: "Text Copied To Clipboard",
      position: "bottom-left",
    });
  });
};

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .max(128, "Password is too long");

export const getNum = (num: number) => {
  return num.toLocaleString();
};

export const setNum = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  const checkNum = value.split(",").join("");
  const convertNum = parseInt(checkNum);
};

// Demo-only hash. Clearly labelled in UI as not production-grade.
function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36) + s.length.toString(36);
}

export function makeToken(): string {
  const part = () =>
    Math.random()
      .toString(36)
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase()
      .padEnd(4, "X");
  return `AET-${part()}-${part()}-${part()}`;
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function findObj<T extends { id: string }>({
  id,
  prop,
  collection,
}: {
  id: string;
  prop: keyof T;
  collection: keyof Collections;
}): T | undefined {
  const storeCollection = useDataStore.getState()[collection as keyof Collections] as T[];
  const obj = storeCollection.find((s) => s[prop] == id) as T;
  return obj;
}

export function getUserName(email: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    toast.warning({
      title: "Error Message",
      description: "Email is invalid",
      position: "top-right",
    });
    return "invalidemail";
  }

  const index = email.indexOf("@");
  const username = email.slice(0, index);

  return username;
}

export async function photoFN(file: File) {
  const { endpoint, project_id, str_id } = appwriteConfig;

  try {
    const client = new Client().setEndpoint(endpoint).setProject(project_id);

    if (!client) throw new Error("Error File Creation");

    const uniqueID = ID.unique();

    const storage = new Storage(client);
    // Create a new file
    const createFileFN = await storage.createFile(str_id, uniqueID, file);
    const url = storage.getFileView(str_id, uniqueID);
    return url;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function handleWalletBalance({
  balance,
  bidBalance,
  bidAmount,
  userID,
}: {
  balance: number;
  bidBalance: number;
  bidAmount: number;
  userID: string;
}) {
  // if(balance > 0) add this condition?
  try {
    let modBalance;
    if (bidBalance == 0) {
      modBalance = balance - bidAmount;
    } else if (bidBalance > 0 && bidAmount > bidBalance) {
      const amount = bidAmount - bidBalance;
      modBalance = balance - amount;
    } else if (bidBalance > 0 && bidAmount < bidBalance) {
      const amount = bidBalance - bidAmount;
      modBalance = balance + amount;
    } else {
      modBalance = 0;
    }

    const currentUserDoc = doc(db, "users", userID);
    await updateDoc(currentUserDoc, {
      wallet: {
        balance: modBalance,
        bidBalance: bidAmount,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
