import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConstraint } from "firebase/firestore";
import { fetchCollection } from "./";

const key = "aethrel_firebase_collection";

const emptyState = {
  users: [],
  deposits: [],
  withdrawals: [],
  transfers: [],
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
  getCollection: <T>(collection: string, options: QueryConstraint[] = []) =>
    queryOptions({
      queryKey: [collection],
      queryFn: () => fetchCollection<T>({ collectionName: collection, options }),
      enabled: !!collection,
      initialData: () => {
        const data = getLocalData();
        const collectionData = data[collection as CollectionKey];
        return collectionData.length > 0 ? collectionData : undefined;
      },
      staleTime: 1000 * 60 * 10, // 10 minutes
    }),
};

export function useFirebaseQuery(collection: string, options: QueryConstraint[]) {
  return useQuery(firebaseQuery.getCollection(collection, options));
}
