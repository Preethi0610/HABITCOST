import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setHabits([]); setLoading(false); return; }

    const q = query(
      collection(db, "users", user.uid, "habits"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setHabits(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return unsub;
  }, [user]);

  const addHabit = useCallback(async (habit) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "habits"), {
        ...habit,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("addHabit error:", e);
      throw e;
    }
  }, [user]);

  const updateHabit = useCallback(async (id, updates) => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid, "habits", id);
      await updateDoc(ref, updates);
    } catch (e) {
      console.error("updateHabit error:", e);
      throw e;
    }
  }, [user]);

  const deleteHabit = useCallback(async (id) => {
    if (!user) return;
    try {
      console.log("Deleting habit:", id, "for user:", user.uid);
      const ref = doc(db, "users", user.uid, "habits", id);
      await deleteDoc(ref);
      console.log("Deleted successfully");
    } catch (e) {
      console.error("deleteHabit error:", e.code, e.message);
      throw e;
    }
  }, [user]);

  const addPreset = useCallback(async (preset) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "habits"), {
        ...preset,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("addPreset error:", e);
      throw e;
    }
  }, [user]);

  return { habits, loading, addHabit, updateHabit, deleteHabit, addPreset };
};
