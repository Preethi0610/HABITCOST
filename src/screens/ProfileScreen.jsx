import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView, TextInput,
  Modal, FlatList, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LogOut, ChevronDown, X, Settings, PiggyBank, TrendingUp, Check } from "lucide-react-native";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency, CURRENCIES } from "../contexts/CurrencyContext";
import { useFinance } from "../hooks/useFinance";
import { COLORS, SPACING, FONTS, SHADOW } from "../constants/theme";

const GREETINGS = [
  "hey {name}, long time.",
  "hey {name}! ready to glow up?",
  "hey {name}! let's check the bag",
  "hey {name}! back again, love the dedication",
  "hey {name}! no cap, let's fix these habits",
];

function getGreeting(name) {
  const index = name.length % GREETINGS.length;
  return GREETINGS[index].replace("{name}", name.toUpperCase());
}

export default function ProfileScreen({ navigation }) {
  const { user, userName, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { monthlyGoalSavings, updateFinance } = useFinance();

  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showSavingsEdit, setShowSavingsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [savingsInput, setSavingsInput] = useState("");

  const displayName = userName || user?.displayName || user?.email?.split("@")[0] || "you";
  const initials = displayName.substring(0, 2).toUpperCase();
  const greeting = getGreeting(displayName);

  const filtered = CURRENCIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveSavings = async () => {
    await updateFinance(parseFloat(savingsInput) || 0);
    setShowSavingsEdit(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={20} color={COLORS.gray} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.glowRing} />
        </View>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.subGreeting}>let's organize everything</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Goal savings */}
        <View style={[styles.section, SHADOW.small]}>
          <View style={styles.sectionTitleRow}>
            <TrendingUp size={16} color={COLORS.green} strokeWidth={2} />
            <Text style={styles.sectionTitle}>monthly goal savings</Text>
          </View>
          <Text style={styles.sectionDesc}>
            How much you set aside each month for your goals — separate from bills and expenses.
          </Text>
          <View style={styles.savingsDisplay}>
            <Text style={styles.savingsAmount}>
              {monthlyGoalSavings > 0
                ? `${currency.symbol}${monthlyGoalSavings.toLocaleString()} / month`
                : "Not set yet"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => { setSavingsInput(monthlyGoalSavings > 0 ? String(monthlyGoalSavings) : ""); setShowSavingsEdit(true); }}
          >
            <Text style={styles.editBtnText}>Edit Savings Amount</Text>
          </TouchableOpacity>
        </View>

        {/* Currency */}
        <View style={[styles.section, SHADOW.small]}>
          <View style={styles.sectionTitleRow}>
            <PiggyBank size={16} color={COLORS.gold} strokeWidth={2} />
            <Text style={styles.sectionTitle}>your currency</Text>
          </View>
          <Text style={styles.sectionDesc}>all amounts show in your currency</Text>
          <TouchableOpacity style={styles.currencyBtn} onPress={() => setShowCurrencyPicker(true)}>
            <Text style={styles.currencySymbol}>{currency.symbol}</Text>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyCode}>{currency.code}</Text>
              <Text style={styles.currencyName}>{currency.name}</Text>
            </View>
            <ChevronDown size={18} color={COLORS.gray} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={[styles.section, SHADOW.small]}>
          <View style={styles.sectionTitleRow}>
            <Settings size={16} color={COLORS.blue} strokeWidth={2} />
            <Text style={styles.sectionTitle}>account info</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>name</Text>
            <Text style={styles.infoValue}>{displayName}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.logoutBtn, SHADOW.small]} onPress={handleLogout}>
          <LogOut size={18} color={COLORS.accent} strokeWidth={2} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>HabitCost v1.0 · made with love</Text>
      </ScrollView>

      {/* Edit Savings Modal */}
      <Modal visible={showSavingsEdit} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Monthly Goal Savings</Text>
            <TouchableOpacity onPress={() => setShowSavingsEdit(false)}>
              <X size={20} color={COLORS.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalDesc}>
              How much do you want to set aside every month for your goals? This is separate from rent, bills, and groceries.
            </Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.amountSymbol}>{currency.symbol}</Text>
              <TextInput
                style={styles.amountInput}
                value={savingsInput}
                onChangeText={setSavingsInput}
                placeholder="e.g. 255"
                placeholderTextColor={COLORS.gray}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSavings}>
              <Check size={16} color={COLORS.white} strokeWidth={2} />
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Currency Modal */}
      <Modal visible={showCurrencyPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>pick your currency</Text>
            <TouchableOpacity onPress={() => { setShowCurrencyPicker(false); setSearch(""); }}>
              <X size={20} color={COLORS.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <View style={styles.searchWrap}>
            <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="search currency..." placeholderTextColor={COLORS.gray} />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.currencyItem, currency.code === item.code && styles.currencyItemActive]}
                onPress={() => { setCurrency(item); setShowCurrencyPicker(false); setSearch(""); }}
              >
                <Text style={styles.currencyItemSymbol}>{item.symbol}</Text>
                <View style={styles.currencyItemInfo}>
                  <Text style={styles.currencyItemCode}>{item.code}</Text>
                  <Text style={styles.currencyItemName}>{item.name}</Text>
                </View>
                {currency.code === item.code && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, paddingBottom: SPACING.xl, alignItems: "center" },
  closeBtn: { alignSelf: "flex-end", padding: 4, marginBottom: SPACING.md },
  avatarSection: { position: "relative", marginBottom: SPACING.md },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.accent, alignItems: "center", justifyContent: "center", zIndex: 2 },
  glowRing: { position: "absolute", width: 106, height: 106, borderRadius: 53, borderWidth: 2, borderColor: COLORS.gold + "55", top: -8, left: -8, zIndex: 1 },
  avatarText: { fontSize: 32, fontWeight: "800", color: COLORS.white },
  greeting: { fontSize: FONTS.sizes.lg, fontWeight: "800", color: COLORS.white, textAlign: "center", marginBottom: 4, letterSpacing: 0.5 },
  subGreeting: { fontSize: FONTS.sizes.sm, color: COLORS.gold, textAlign: "center", marginBottom: 8, fontWeight: "600" },
  email: { fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: "center" },
  content: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 40 },
  section: { backgroundColor: COLORS.cardBg, borderRadius: 20, padding: SPACING.md },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.dark },
  sectionDesc: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, marginBottom: SPACING.sm, lineHeight: 18 },
  savingsDisplay: { backgroundColor: COLORS.light, borderRadius: 12, padding: SPACING.md, alignItems: "center", marginBottom: SPACING.sm },
  savingsAmount: { fontSize: FONTS.sizes.xl, fontWeight: "800", color: COLORS.primary },
  editBtn: { backgroundColor: COLORS.light, borderRadius: 10, padding: SPACING.sm, alignItems: "center" },
  editBtnText: { fontSize: FONTS.sizes.sm, fontWeight: "600", color: COLORS.primary },
  currencyBtn: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: COLORS.light, borderRadius: 12, padding: SPACING.md },
  currencySymbol: { fontSize: FONTS.sizes.xl, fontWeight: "700", color: COLORS.primary, width: 30, textAlign: "center" },
  currencyInfo: { flex: 1 },
  currencyCode: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.dark },
  currencyName: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
  infoLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  infoValue: { fontSize: FONTS.sizes.sm, fontWeight: "600", color: COLORS.dark },
  logoutBtn: { backgroundColor: COLORS.cardBg, borderRadius: 20, padding: SPACING.md, flexDirection: "row", alignItems: "center", gap: 12 },
  logoutText: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.accent },
  version: { fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: "center", marginTop: SPACING.sm },
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.md, backgroundColor: COLORS.primary },
  modalTitle: { fontSize: FONTS.sizes.lg, fontWeight: "700", color: COLORS.white },
  modalContent: { padding: SPACING.md, gap: SPACING.md },
  modalDesc: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, lineHeight: 20 },
  amountInputRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.light, borderRadius: 12, paddingHorizontal: SPACING.md },
  amountSymbol: { fontSize: FONTS.sizes.xl, color: COLORS.darkGray, marginRight: 4 },
  amountInput: { flex: 1, fontSize: FONTS.sizes.xl, fontWeight: "700", color: COLORS.dark, padding: SPACING.md },
  saveBtn: { backgroundColor: COLORS.accent, borderRadius: 16, padding: SPACING.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  saveBtnText: { color: COLORS.white, fontWeight: "700", fontSize: FONTS.sizes.md },
  searchWrap: { padding: SPACING.md },
  searchInput: { backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.dark },
  currencyItem: { flexDirection: "row", alignItems: "center", padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray, gap: 12 },
  currencyItemActive: { backgroundColor: "#FFF9ED" },
  currencyItemSymbol: { fontSize: FONTS.sizes.lg, fontWeight: "700", color: COLORS.primary, width: 36, textAlign: "center" },
  currencyItemInfo: { flex: 1 },
  currencyItemCode: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.dark },
  currencyItemName: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  checkmark: { fontSize: FONTS.sizes.lg, color: COLORS.gold, fontWeight: "700" },
});
