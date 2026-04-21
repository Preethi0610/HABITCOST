import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkJGrn_4KueogZN9qiEbxxxak7gGWlAns",
  authDomain: "habitcost-da085.firebaseapp.com",
  projectId: "habitcost-da085",
  storageBucket: "habitcost-da085.firebasestorage.app",
  messagingSenderId: "1003170453709",
  appId: "1:1003170453709:android:5d04c50ad2282299707184",
};

let app;
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    auth = getAuth(app);
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
