import {
  Utensils, Car, Tv, Heart, ShoppingBag, Smartphone, Package,
} from "lucide-react-native";

export const CATEGORIES = [
  { name: "Food",          icon: "Utensils",    color: "#E94560" },
  { name: "Transport",     icon: "Car",         color: "#3498DB" },
  { name: "Entertainment", icon: "Tv",          color: "#9B59B6" },
  { name: "Health",        icon: "Heart",       color: "#2ECC71" },
  { name: "Shopping",      icon: "ShoppingBag", color: "#E67E22" },
  { name: "Subscriptions", icon: "Smartphone",  color: "#F5A623" },
  { name: "Other",         icon: "Package",     color: "#ADB5BD" },
];

export const CATEGORY_ICONS = {
  Utensils, Car, Tv, Heart, ShoppingBag, Smartphone, Package,
};

export const getCategoryMeta = (name) =>
  CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1];
