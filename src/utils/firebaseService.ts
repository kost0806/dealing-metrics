import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { DamageEntry } from '../types';

const COLLECTION_NAME = 'damageEntries';

/**
 * Save damage entry to Firestore
 */
export const saveDamageEntry = async (
  userId: string,
  userName: string,
  damages: number[]
): Promise<string> => {
  const entry: Omit<DamageEntry, 'id'> = {
    userId,
    userName,
    damages,
    timestamp: Date.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), entry);
  return docRef.id;
};

/**
 * Get all damage entries
 */
export const getAllDamageEntries = async (): Promise<DamageEntry[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as DamageEntry[];
};

/**
 * Get damage entries for a specific user
 */
export const getUserDamageEntries = async (userId: string): Promise<DamageEntry[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as DamageEntry[];
};

/**
 * Update damage entry
 */
export const updateDamageEntry = async (
  entryId: string,
  damages: number[]
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, entryId);
  await updateDoc(docRef, {
    damages,
    timestamp: Date.now(),
  });
};

/**
 * Delete damage entry
 */
export const deleteDamageEntry = async (entryId: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, entryId);
  await deleteDoc(docRef);
};

/**
 * Get total damages for all users (for percentile calculation)
 */
export const getAllUserTotals = async (): Promise<number[]> => {
  const entries = await getAllDamageEntries();
  return entries.map(entry =>
    entry.damages.reduce((sum, damage) => sum + damage, 0)
  );
};
