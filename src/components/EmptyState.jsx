import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PlusCircle } from "lucide-react-native";
import { COLORS, FONTS, SPACING } from "../constants/theme";

export default function EmptyState({ onAdd }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <PlusCircle size={32} color={COLORS.accent} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>No habits yet</Text>
      <Text style={styles.subtitle}>
        Add your first habit to see how much it's really costing you.
      </Text>
      {onAdd && (
        <TouchableOpacity style={styles.button} onPress={onAdd}>
          <Text style={styles.buttonText}>+ Add a Habit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF0F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  title: { fontSize: FONTS.sizes.xl, fontWeight: "700", color: COLORS.dark, marginBottom: SPACING.sm },
  subtitle: { fontSize: FONTS.sizes.md, color: COLORS.darkGray, textAlign: "center", lineHeight: 22, marginBottom: SPACING.lg },
  button: { backgroundColor: COLORS.accent, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: 30 },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: FONTS.sizes.md },
});
