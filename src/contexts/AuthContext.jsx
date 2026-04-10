import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [onboardingDone, setOnboardingDone] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, "users", u.uid, "profile", "info"));
          if (snap.exists()) {
            setUserName(snap.data().name || u.displayName || "");
            setOnboardingDone(snap.data().onboardingDone === true);
          } else {
            setUserName(u.displayName || "");
            setOnboardingDone(false);
          }
        } catch (e) {
          console.log("Profile fetch error:", e);
          setOnboardingDone(true);
        }
      } else {
        setUserName("");
        setOnboardingDone(true);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signup = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, "users", cred.user.uid, "profile", "info"), {
      name,
      email,
      onboardingDone: false,
      createdAt: new Date().toISOString(),
    });
    setUserName(name);
    setOnboardingDone(false);
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const completeOnboarding = () => setOnboardingDone(true);

  return (
    <AuthContext.Provider value={{
      user, userName, loading,
      onboardingDone, completeOnboarding,
      signup, login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
