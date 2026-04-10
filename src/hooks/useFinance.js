import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const useFinance = () => {
  const { user } = useAuth();
  const [monthlyGoalSavings, setMonthlyGoalSavings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid, "profile", "finance"));
        if (snap.exists()) {
          setMonthlyGoalSavings(snap.data().monthlyGoalSavings || 0);
        }
      } catch (e) {
        console.error("finance load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const updateFinance = useCallback(async (amount) => {
    if (!user) return;
    setMonthlyGoalSavings(amount);
    await setDoc(
      doc(db, "users", user.uid, "profile", "finance"),
      { monthlyGoalSavings: amount, updatedAt: new Date().toISOString() },
      { merge: true }
    );
  }, [user]);

  return { monthlyGoalSavings, loading, updateFinance };
};
