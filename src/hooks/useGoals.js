import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import {
  collection, doc, addDoc, deleteDoc, updateDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setGoals([]); setLoading(false); return; }
    const q = query(
      collection(db, "users", user.uid, "goals"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setGoals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (e) => { console.error("goals error:", e); setLoading(false); });
    return unsub;
  }, [user]);

  const addGoal = useCallback(async (goal) => {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "goals"), {
      ...goal,
      splitPct: 0,
      createdAt: serverTimestamp(),
    });
  }, [user]);

  const deleteGoal = useCallback(async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "goals", id));
  }, [user]);

  const updateSplits = useCallback(async (splits) => {
    if (!user) return;
    const updates = splits.map(({ id, splitPct }) =>
      updateDoc(doc(db, "users", user.uid, "goals", id), { splitPct })
    );
    await Promise.all(updates);
  }, [user]);

  return { goals, loading, addGoal, deleteGoal, updateSplits };
};
