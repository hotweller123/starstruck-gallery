import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConstraint } from "firebase/firestore";
import { fetchCollection, fetchDocument } from "./";
import { Collections } from "@/hooks/useDoc";

const key = "aethrel_firebase_collection";
const userKey = "authStore";

const emptyState = {
  users: [],
  transactions: [],
};

type CollectionKey = keyof typeof emptyState;

export const saveLocalData = (data: typeof emptyState) => {
  if (typeof document == "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

export const getLocalData = (): typeof emptyState => {
  if (typeof document == "undefined") return emptyState;
  const getItem = localStorage.getItem(key);
  if (!getItem) return emptyState;
  return { ...emptyState, ...JSON.parse(getItem) };
};

const firebaseQuery = {
  getCollection: <T>(collection: keyof Collections, options: QueryConstraint[] = []) =>
    queryOptions({
      queryKey: [collection, ...options.map((o) => JSON.stringify(o))],
      queryFn: () => fetchCollection<T>({ collectionName: collection, options }),
      enabled: !!collection,
      initialData: () => {
        const data = getLocalData();
        const collectionData = data[collection as CollectionKey] ?? [];
        return collectionData.length > 0 ? collectionData : undefined;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),

  getDocument: (collection: keyof Collections, id: string) =>
    queryOptions({
      queryKey: [collection, id],
      queryFn: () => fetchDocument({ collectionName: collection, id }),
    }),
};

export function useFirebaseQueryCollection(
  collection: keyof Collections,
  options: QueryConstraint[] = [],
) {
  return useQuery(firebaseQuery.getCollection(collection, options));
}

export function useFirebaseQueryDocument(collection: keyof Collections, id: string) {
  return useQuery(firebaseQuery.getDocument(collection, id));
}
