import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { TrendingUp, List, Calendar } from "lucide-react-native";
import { useHabits } from "../hooks/useHabits";
import { useInsights } from "../hooks/useInsights";
import { useCurrency } from "../contexts/CurrencyContext";
import DonutChart from "../components/DonutChart";
import EmptyState from "../components/EmptyState";
import ScreenHeader from "../components/ScreenHeader";
import { COLORS, SPACING, FONTS, SHADOW } from "../constants/theme";
import { getMonthlyCost } from "../utils/calculations";

function StatCard({ label, value, subtext, color, icon }) {
  return (
    <View style={[styles.statCard, SHADOW.small]}>
      <View style={styles.statHeader}>
        {icon}
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtext ? <Text style={styles.statSubtext}>{subtext}</Text> : null}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { habits } = useHabits();
  const { format, formatCompact } = useCurrency();
  const { totalMonthly, totalYearly, tenYearTotal, categoryBreakdown, topHabits } = useInsights(habits);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Dashboard"
        subtitle="See what your habits really cost"
        navigation={navigation}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <StatCard label="THIS MONTH" value={format(totalMonthly)} color={COLORS.accent}
            icon={<Calendar size={14} color={COLORS.gray} strokeWidth={2} />} />
          <StatCard label="THIS YEAR" value={format(totalYearly)} color={COLORS.gold}
            icon={<Calendar size={14} color={COLORS.gray} strokeWidth={2} />} />
        </View>
        <View style={styles.row}>
          <StatCard label="10-YEAR" value={formatCompact(tenYearTotal)} color={COLORS.purple}
            subtext="if nothing changes"
            icon={<TrendingUp size={14} color={COLORS.gray} strokeWidth={2} />} />
          <StatCard label="HABITS" value={String(habits.length)} color={COLORS.dark}
            subtext="being tracked"
            icon={<List size={14} color={COLORS.gray} strokeWidth={2} />} />
        </View>

        {habits.length > 0 ? (
          <View style={[styles.card, SHADOW.medium]}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
            <DonutChart breakdown={categoryBreakdown} total={totalYearly} />
          </View>
        ) : (
          <EmptyState onAdd={() => navigation.navigate("AddHabit")} />
        )}

        {topHabits.length > 0 && (
          <View style={[styles.card, SHADOW.small]}>
            <Text style={styles.sectionTitle}>Most Expensive Habits</Text>
            {topHabits.map((h) => (
              <View key={h.id} style={styles.topRow}>
                <Text style={styles.topName}>{h.name}</Text>
                <Text style={styles.topCost}>
                  {format(getMonthlyCost(h.cost, h.frequency))} / mo
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={[styles.fab, SHADOW.large]} onPress={() => navigation.navigate("AddHabit")}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.md, paddingBottom: 100 },
  row: { flexDirection: "row", marginBottom: SPACING.sm },
  statCard: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: SPACING.md, flex: 1, margin: SPACING.xs },
  statHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  statLabel: { fontSize: 11, color: COLORS.gray, letterSpacing: 0.5, fontWeight: "500" },
  statValue: { fontSize: FONTS.sizes.xl, fontWeight: "700" },
  statSubtext: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 4 },
  card: { backgroundColor: COLORS.cardBg, borderRadius: 20, padding: SPACING.md, marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.dark, marginBottom: SPACING.md },
  topRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
  topName: { fontSize: FONTS.sizes.sm, color: COLORS.dark, flex: 1 },
  topCost: { fontSize: FONTS.sizes.sm, fontWeight: "700", color: COLORS.accent },
  fab: { position: "absolute", bottom: 90, right: SPACING.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.accent, justifyContent: "center", alignItems: "center" },
  fabText: { fontSize: 28, color: COLORS.white, lineHeight: 32 },
});
