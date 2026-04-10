import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { CATEGORY_COLORS, COLORS, FONTS } from "../constants/theme";
import { formatCompact } from "../utils/formatters";

export default function DonutChart({ breakdown, total }) {
  const entries = Object.entries(breakdown).filter(([, v]) => v > 0);

  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Add habits to see breakdown</Text>
      </View>
    );
  }

  const data = entries.map(([cat, val]) => ({
    x: cat,
    y: parseFloat(val.toFixed(2)),
    color: CATEGORY_COLORS[cat] || COLORS.gray,
  }));

  const totalVal = data.reduce((s, d) => s + d.y, 0);

  return (
    <View style={styles.container}>
      {/* Simple bar-based chart that works on all platforms */}
      <View style={styles.centerCard}>
        <Text style={styles.centerValue}>{formatCompact(total)}</Text>
        <Text style={styles.centerLabel}>per year</Text>
      </View>

      <View style={styles.bars}>
        {data.map((d) => (
          <View key={d.x} style={styles.barRow}>
            <View style={styles.barLabelRow}>
              <View style={[styles.dot, { backgroundColor: d.color }]} />
              <Text style={styles.barLabel}>{d.x}</Text>
              <Text style={styles.barValue}>{formatCompact(d.y)}</Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.round((d.y / totalVal) * 100)}%`,
                    backgroundColor: d.color,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  empty: { height: 120, justifyContent: "center", alignItems: "center" },
  emptyText: { color: COLORS.gray, fontSize: FONTS.sizes.sm },
  centerCard: {
    backgroundColor: COLORS.light,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  centerValue: { fontSize: FONTS.sizes.xxl, fontWeight: "800", color: COLORS.primary },
  centerLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  bars: { gap: 12 },
  barRow: { gap: 6 },
  barLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  barLabel: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.dark, fontWeight: "500" },
  barValue: { fontSize: FONTS.sizes.sm, fontWeight: "700", color: COLORS.darkGray },
  barTrack: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: { height: 8, borderRadius: 999 },
});
