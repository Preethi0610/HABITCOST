import React from "react";
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { PRESETS } from "../data/presets";
import { COLORS, FONTS, SPACING, SHADOW } from "../constants/theme";
import CategoryBadge from "./CategoryBadge";
import { formatCurrency } from "../utils/formatters";

export default function PresetPicker({ visible, onSelect, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Quick Add</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Tap a common habit to add it instantly</Text>
        <FlatList data={PRESETS} keyExtractor={(_, i) => String(i)} contentContainerStyle={{ padding: SPACING.md }}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.item, SHADOW.small]} onPress={() => { onSelect(item); onClose(); }} activeOpacity={0.7}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <CategoryBadge category={item.category} small />
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemCost}>{formatCurrency(item.cost, 2)}</Text>
                <Text style={styles.itemFreq}>/ {item.frequency}</Text>
              </View>
            </TouchableOpacity>
          )} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.md, backgroundColor: COLORS.primary },
  title: { fontSize: FONTS.sizes.lg, fontWeight: "700", color: COLORS.white },
  close: { fontSize: 18, color: COLORS.white, paddingHorizontal: SPACING.sm },
  subtitle: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, padding: SPACING.md, paddingBottom: 0 },
  item: { backgroundColor: COLORS.cardBg, borderRadius: 14, padding: SPACING.md, marginBottom: SPACING.sm, flexDirection: "row", alignItems: "center" },
  itemLeft: { flex: 1, gap: 4 },
  itemName: { fontSize: FONTS.sizes.md, fontWeight: "600", color: COLORS.dark },
  itemRight: { alignItems: "flex-end" },
  itemCost: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.accent },
  itemFreq: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
});
