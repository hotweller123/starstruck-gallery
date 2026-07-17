import { Collections } from "@/hooks/useDoc";
import { toast } from "@/lib/useToast";
import { db } from "@/services/firebase";
import { collection, doc, getDoc, getDocs, query, QueryConstraint } from "firebase/firestore";

/**
 * One-time fetch (Promise-based) for a collection.
 * Returns a plain array of documents.
 * This is what TanStack Query expects from queryFn.
 *
 * IMPORTANT: Do NOT use onSnapshot here. onSnapshot returns an unsubscribe function,
 * which was causing `data` to be a function instead of an array.
 */
const fetchCollection = async <T>({
  collectionName,
  options = [],
}: {
  collectionName: keyof Collections;
  options?: QueryConstraint[];
}): Promise<T[]> => {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...options);

    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as T[];

    console.log(data);
    return data;
  } catch (error: any) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    toast.error({
      title: "Error loading data",
      description: error.message || "Failed to load collection",
      position: "top",
    });
    throw error;
  }
};

/**
 * One-time fetch for a single document.
 * Returns the document data or null.
 */
const fetchDocument = async <T>({
  collectionName,
  id,
}: {
  collectionName: keyof Collections;
  id: string;
}): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error: any) {
    console.error(`Error fetching document ${collectionName}/${id}:`, error);
    toast.error({
      title: "Error loading document",
      description: error.message || "Failed to load document",
      position: "top",
    });
    throw error;
  }
};

export { fetchCollection, fetchDocument };
