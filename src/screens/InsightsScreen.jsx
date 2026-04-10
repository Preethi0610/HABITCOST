import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, SafeAreaView } from "react-native";
import { Clock, TrendingUp, DollarSign } from "lucide-react-native";
import { useHabits } from "../hooks/useHabits";
import { useInsights } from "../hooks/useInsights";
import { useCurrency } from "../contexts/CurrencyContext";
import StatCard from "../components/StatCard";
import ScreenHeader from "../components/ScreenHeader";
import { COLORS, SPACING, FONTS, SHADOW } from "../constants/theme";
import { formatHours } from "../utils/formatters";

export default function InsightsScreen({ navigation }) {
  const { habits } = useHabits();
  const { format, formatCompact } = useCurrency();
  const [wage, setWage] = useState("");
  const wageNum = parseFloat(wage) || 0;
  const { totalMonthly, totalYearly, timeCostHours, tenYearTotal, investmentFV } = useInsights(habits, wageNum);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Insights" subtitle="The full picture of your spending" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <StatCard label="Monthly" value={format(totalMonthly)} color={COLORS.accent} emoji="📅" />
          <StatCard label="Yearly" value={format(totalYearly)} color={COLORS.gold} emoji="📆" />
        </View>

        <View style={[styles.card, SHADOW.medium]}>
          <View style={styles.cardTitleRow}>
            <Clock size={16} color={COLORS.accent} strokeWidth={2} />
            <Text style={styles.cardTitle}>Time Cost</Text>
          </View>
          <Text style={styles.cardDesc}>How many hours do you work each year just to pay for your habits?</Text>
          <View style={styles.wageRow}>
            <Text style={styles.wageLabel}>Your hourly wage</Text>
            <View style={styles.wageInputWrap}>
              <TextInput style={styles.wageInput} value={wage} onChangeText={setWage}
                placeholder="25" placeholderTextColor={COLORS.gray} keyboardType="decimal-pad" />
            </View>
          </View>
          {wageNum > 0 ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultValue}>{formatHours(timeCostHours)}</Text>
              <Text style={styles.resultLabel}>worked per year to fund habits</Text>
              <Text style={styles.resultSub}>That's {Math.round(timeCostHours / 8)} workdays</Text>
            </View>
          ) : <Text style={styles.hint}>Enter your wage to see time cost</Text>}
        </View>

        <View style={[styles.card, SHADOW.medium]}>
          <View style={styles.cardTitleRow}>
            <TrendingUp size={16} color={COLORS.gold} strokeWidth={2} />
            <Text style={styles.cardTitle}>10-Year Projection</Text>
          </View>
          <Text style={styles.cardDesc}>If your habits stay the same, here's where your money goes.</Text>
          <View style={styles.resultBox}>
            <Text style={[styles.resultValue, { color: COLORS.accent }]}>{formatCompact(tenYearTotal)}</Text>
            <Text style={styles.resultLabel}>spent on habits over 10 years</Text>
          </View>
        </View>

        <View style={[styles.card, SHADOW.medium]}>
          <View style={styles.cardTitleRow}>
            <DollarSign size={16} color={COLORS.green} strokeWidth={2} />
            <Text style={styles.cardTitle}>What If You Invested It?</Text>
          </View>
          <Text style={styles.cardDesc}>If you invested your monthly habit spend at 7% annual return over 10 years:</Text>
          <View style={styles.resultBox}>
            <Text style={[styles.resultValue, { color: COLORS.green }]}>{formatCompact(investmentFV)}</Text>
            <Text style={styles.resultLabel}>future value in 10 years</Text>
            <Text style={styles.resultSub}>vs {formatCompact(tenYearTotal)} simply spent</Text>
          </View>
          <Text style={styles.disclaimer}>* Based on {format(totalMonthly)}/mo at 7% p.a.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  row: { flexDirection: "row", marginBottom: SPACING.sm },
  card: { backgroundColor: COLORS.cardBg, borderRadius: 20, padding: SPACING.md, marginBottom: SPACING.md },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.dark },
  cardDesc: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, lineHeight: 20, marginBottom: SPACING.md },
  wageRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.sm },
  wageLabel: { fontSize: FONTS.sizes.sm, color: COLORS.dark, fontWeight: "600" },
  wageInputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.lightGray, borderRadius: 10, paddingHorizontal: SPACING.sm },
  wageInput: { fontSize: FONTS.sizes.md, color: COLORS.dark, width: 80, padding: SPACING.sm },
  resultBox: { backgroundColor: COLORS.light, borderRadius: 14, padding: SPACING.md, alignItems: "center", marginTop: SPACING.sm },
  resultValue: { fontSize: FONTS.sizes.xxxl, fontWeight: "800", color: COLORS.primary },
  resultLabel: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, marginTop: 4 },
  resultSub: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  hint: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: "center", padding: SPACING.md },
  disclaimer: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: SPACING.sm, fontStyle: "italic" },
});
