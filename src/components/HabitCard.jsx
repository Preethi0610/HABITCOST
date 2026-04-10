import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Trash2, Pencil } from "lucide-react-native";
import { COLORS, SHADOW, SPACING, FONTS } from "../constants/theme";
import CategoryBadge from "./CategoryBadge";
import { getMonthlyCost, getYearlyCost } from "../utils/calculations";
import { useCurrency } from "../contexts/CurrencyContext";

export default function HabitCard({ habit, onEdit, onDelete }) {
  const { format } = useCurrency();
  const monthly = getMonthlyCost(habit.cost, habit.frequency);
  const yearly = getYearlyCost(habit.cost, habit.frequency);

  const confirmDelete = () => {
    Alert.alert(
      "Delete Habit",
      `Remove "${habit.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(habit.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, SHADOW.small]}>

      {/* Left content */}
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.name}>{habit.name}</Text>
          <CategoryBadge category={habit.category} small />
        </View>
        <Text style={styles.freq}>
          {format(habit.cost, 2)} / {habit.frequency}
        </Text>
      </View>

      {/* Right: cost */}
      <View style={styles.costWrap}>
        <Text style={styles.monthly}>{format(monthly)}</Text>
        <Text style={styles.monthlyLabel}>/ mo</Text>
        <Text style={styles.yearly}>{format(yearly)} / yr</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(habit)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.actionBtn}
        >
          <Pencil size={18} color={COLORS.blue} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={confirmDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.actionBtn}
        >
          <Trash2 size={18} color={COLORS.accent} strokeWidth={2} />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    gap: 6,
  },
  top: { gap: 4 },
  name: {
    fontSize: FONTS.sizes.md,
    fontWeight: "700",
    color: COLORS.dark,
  },
  freq: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray,
  },
  costWrap: {
    alignItems: "flex-end",
    paddingRight: SPACING.md,
  },
  monthly: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "800",
    color: COLORS.accent,
  },
  monthlyLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray,
  },
  yearly: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  actions: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.lightGray,
    flexDirection: "column",
  },
  actionBtn: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
});
