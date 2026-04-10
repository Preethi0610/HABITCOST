import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "LKR", symbol: "₨", name: "Sri Lankan Rupee" },
];

const CurrencyContext = createContext({});
export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }) {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState(CURRENCIES[0]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid, "profile", "settings"));
        if (snap.exists() && snap.data().currency) {
          const found = CURRENCIES.find((c) => c.code === snap.data().currency);
          if (found) setCurrencyState(found);
        }
      } catch (e) {}
    })();
  }, [user]);

  const setCurrency = async (cur) => {
    setCurrencyState(cur);
    if (!user) return;
    await setDoc(doc(db, "users", user.uid, "profile", "settings"), { currency: cur.code }, { merge: true });
  };

  const format = (amount, decimals = 0) => {
    if (isNaN(amount)) return `${currency.symbol}0`;
    return `${currency.symbol}${parseFloat(amount).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const formatCompact = (amount) => {
    if (amount >= 1000000) return `${currency.symbol}${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${currency.symbol}${(amount / 1000).toFixed(1)}k`;
    return format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, formatCompact, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}
