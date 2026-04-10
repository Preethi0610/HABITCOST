import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SHADOW, SPACING, FONTS } from "../constants/theme";

export default function StatCard({ label, value, subtext, color }) {
  return (
    <View style={[styles.card, SHADOW.small]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, color ? { color } : null]}>{value}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: "center",
    flex: 1,
    margin: SPACING.xs,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "500",
    marginBottom: 6,
  },
  value: {
    fontSize: FONTS.sizes.xl,
    fontWeight: "700",
    color: COLORS.primary,
  },
  subtext: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 4,
  },
});
