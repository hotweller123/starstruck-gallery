import { AuctionLot } from "@/data/auctions";
import { toast } from "@/lib/useToast";
import { db } from "@/services/firebase";
import { WalletAccount, WalletTx } from "@/types";
import { addDoc, collection, updateDoc, doc, deleteDoc } from "firebase/firestore";

export interface Collections {
  users: WalletAccount;
  transactions: WalletTx;
  auctions: AuctionLot;
}

// type CollectionKey<T extends keyof Collections> = Collections[T];

export interface CreateDoc<T extends keyof Collections> {
  collections: T;
  document: Omit<Collections[T], "id">;
}

export default function useDoc() {
  const addDocToCollection = async <T extends keyof Collections>({
    collections,
    document,
  }: CreateDoc<T>) => {
    try {
      const colref = collection(db, collections);
      const addDocument = await addDoc(colref, document);

      const currentDoc = doc(colref, addDocument.id);
      await updateDoc(currentDoc, {
        id: addDocument.id,
        ...(collections == "auctions"
          ? {
              lotNumber: addDocument.id,
            }
          : {}),
      });

      return { ...document, id: addDocument.id };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const updateDocument = async <T extends keyof Collections>({
    collections,
    document,
  }: {
    collections: T;
    document: Partial<Collections[T]> & { id: string };
  }) => {
    const colref = collection(db, collections);
    const currentDoc = doc(colref, document.id);

    try {
      await updateDoc(currentDoc, document);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteDocument = async ({
    collectionName,
    id,
    message,
  }: {
    collectionName: keyof Collections;
    id: string;
    message?: string;
  }) => {
    const colref = collection(db, collectionName);
    const currentDoc = doc(colref, id);

    await deleteDoc(currentDoc)
      .then(() =>
        toast.reserved({
          title: message || "Deleted Successfullly",
        }),
      )
      .catch((err) =>
        toast.error({
          title: err.message,
        }),
      );
  };

  return {
    addDocToCollection,
    updateDocument,
    deleteDocument,
  };
}
