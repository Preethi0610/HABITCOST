import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingDown, ChevronRight, PiggyBank } from "lucide-react-native";
import { db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { COLORS, SPACING, FONTS, SHADOW } from "../constants/theme";

export default function OnboardingScreen({ onComplete }) {
  const { user } = useAuth();
  const { currency } = useCurrency();
  const [savings, setSavings] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", user.uid, "profile", "finance"),
        { monthlyGoalSavings: parseFloat(savings) || 0, updatedAt: new Date().toISOString() },
        { merge: true }
      );
      await setDoc(
        doc(db, "users", user.uid, "profile", "info"),
        { onboardingDone: true },
        { merge: true }
      );
      onComplete();
    } catch (e) {
      console.error("onboarding error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.gradient}>

        <View style={styles.logoRow}>
          <TrendingDown size={20} color={COLORS.gold} strokeWidth={2} />
          <Text style={styles.logoText}>HabitCost</Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.content}>
          <View style={[styles.card, SHADOW.large]}>
            <View style={styles.iconWrap}>
              <PiggyBank size={32} color={COLORS.gold} strokeWidth={1.5} />
            </View>

            <Text style={styles.stepTitle}>One quick question</Text>
            <Text style={styles.stepDesc}>
              How much do you want to set aside each month for your future goals?
            </Text>
            <Text style={styles.stepHint}>
              This is separate from rent, bills, and groceries — just what you dedicate to saving for things you want.
            </Text>

            <View style={styles.inputRow}>
              <Text style={styles.inputSymbol}>{currency.symbol}</Text>
              <TextInput
                style={styles.input}
                value={savings}
                onChangeText={setSavings}
                placeholder="e.g. 200"
                placeholderTextColor={COLORS.gray}
                keyboardType="decimal-pad"
                autoFocus
              />
              <Text style={styles.inputSuffix}>/ month</Text>
            </View>

            <TouchableOpacity
              style={[styles.nextBtn, loading && styles.nextBtnDisabled]}
              onPress={handleFinish}
              disabled={loading}
            >
              <Text style={styles.nextBtnText}>
                {loading ? "Setting up..." : "Let's go!"}
              </Text>
              <ChevronRight size={18} color={COLORS.white} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setSavings("0"); handleFinish(); }} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  gradient: { flex: 1, padding: SPACING.lg },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: SPACING.xl },
  logoText: { fontSize: FONTS.sizes.md, color: COLORS.gold, fontWeight: "700" },
  content: { flex: 1, justifyContent: "center" },
  card: { backgroundColor: COLORS.white, borderRadius: 24, padding: SPACING.lg, gap: SPACING.sm },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.light, justifyContent: "center", alignItems: "center", alignSelf: "center", marginBottom: SPACING.xs },
  stepTitle: { fontSize: FONTS.sizes.xl, fontWeight: "800", color: COLORS.dark, textAlign: "center" },
  stepDesc: { fontSize: FONTS.sizes.md, color: COLORS.dark, textAlign: "center", lineHeight: 22 },
  stepHint: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: "center", lineHeight: 20, fontStyle: "italic" },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.light, borderRadius: 14, paddingHorizontal: SPACING.md, marginTop: SPACING.sm },
  inputSymbol: { fontSize: FONTS.sizes.xxl, color: COLORS.darkGray, marginRight: 4 },
  input: { flex: 1, fontSize: FONTS.sizes.xxl, fontWeight: "700", color: COLORS.dark, padding: SPACING.md },
  inputSuffix: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  nextBtn: { backgroundColor: COLORS.accent, borderRadius: 14, padding: SPACING.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: SPACING.sm },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { color: COLORS.white, fontWeight: "700", fontSize: FONTS.sizes.md },
  skipBtn: { alignItems: "center", padding: SPACING.sm },
  skipText: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
});
