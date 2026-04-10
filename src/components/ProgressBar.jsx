import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default function ProgressBar({ progress = 0, color = COLORS.accent, height = 8 }) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return (
    <View style={[styles.track, { height }]}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: "#E9ECEF", borderRadius: 999, overflow: "hidden", width: "100%" },
  fill: { borderRadius: 999 },
});
