import { toast } from "@/lib/useToast";
import { db } from "@/services/firebase";
import { collection, onSnapshot, query, QueryConstraint } from "firebase/firestore";

const fetchCollection = async <T>({
  collectionName,
  options = [],
}: {
  collectionName: string;
  options?: QueryConstraint[];
}) => {
  const colref = collection(db, collectionName);

  const q = query(colref, ...options);

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      return data;
    },
    (error) => {
      console.error(`Error in ${collectionName}:`, error);
      toast.error(`Error in ${collectionName}: ${error}`);
    },
  );
};

export { fetchCollection };
