import React, { useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, Modal,
} from "react-native";
import { Zap, Trash2, Pencil, AlertTriangle } from "lucide-react-native";
import { useHabits } from "../hooks/useHabits";
import EmptyState from "../components/EmptyState";
import PresetPicker from "../components/PresetPicker";
import CategoryBadge from "../components/CategoryBadge";
import ScreenHeader from "../components/ScreenHeader";
import { COLORS, SPACING, FONTS, SHADOW } from "../constants/theme";
import { useCurrency } from "../contexts/CurrencyContext";
import { getMonthlyCost } from "../utils/calculations";

export default function HabitsScreen({ navigation }) {
  const { habits, deleteHabit, addPreset } = useHabits();
  const { format } = useCurrency();
  const [showPresets, setShowPresets] = useState(false);
  const [confirmHabit, setConfirmHabit] = useState(null);

  const handleDelete = async () => {
    if (!confirmHabit) return;
    try {
      await deleteHabit(confirmHabit.id);
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setConfirmHabit(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="My Habits"
        subtitle={`${habits.length} habit${habits.length !== 1 ? "s" : ""} tracked`}
        navigation={navigation}
        right={
          <TouchableOpacity style={styles.presetBtn} onPress={() => setShowPresets(true)}>
            <Zap size={14} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.presetBtnText}>Quick Add</Text>
          </TouchableOpacity>
        }
      />

      {habits.length === 0 ? (
        <EmptyState onAdd={() => navigation.navigate("AddHabit")} />
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const monthly = getMonthlyCost(item.cost, item.frequency);
            return (
              <View style={[styles.row, SHADOW.small]}>
                <View style={styles.rowContent}>
                  <Text style={styles.rowName}>{item.name}</Text>
                  <CategoryBadge category={item.category} small />
                  <Text style={styles.rowFreq}>
                    {format(item.cost, 2)} / {item.frequency}
                  </Text>
                </View>
                <Text style={styles.rowCost}>{format(monthly)}/mo</Text>
                <TouchableOpacity
                  style={styles.rowBtn}
                  onPress={() => navigation.navigate("AddHabit", { habit: item })}
                >
                  <Pencil size={16} color={COLORS.blue} strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rowBtn}
                  onPress={() => setConfirmHabit(item)}
                >
                  <Trash2 size={16} color={COLORS.accent} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            );
          }}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddHabit")}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <PresetPicker visible={showPresets} onSelect={addPreset} onClose={() => setShowPresets(false)} />

      {/* Custom Delete Confirm Modal */}
      <Modal visible={!!confirmHabit} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalIcon}>
              <AlertTriangle size={28} color={COLORS.accent} strokeWidth={2} />
            </View>
            <Text style={styles.modalTitle}>Delete Habit</Text>
            <Text style={styles.modalDesc}>
              Remove "{confirmHabit?.name}"? This cannot be undone.
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setConfirmHabit(null)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDelete}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  presetBtn: {
    backgroundColor: COLORS.gold, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm, borderRadius: 20,
    flexDirection: "row", alignItems: "center", gap: 6,
  },
  presetBtnText: { fontSize: FONTS.sizes.sm, fontWeight: "700", color: COLORS.primary },
  list: { padding: SPACING.sm, paddingBottom: 100 },
  row: {
    backgroundColor: COLORS.cardBg, borderRadius: 16,
    marginHorizontal: SPACING.md, marginVertical: SPACING.xs,
    flexDirection: "row", alignItems: "center",
    paddingVertical: SPACING.sm, paddingLeft: SPACING.md,
  },
  rowContent: { flex: 1, gap: 3 },
  rowName: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.dark },
  rowFreq: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  rowCost: {
    fontSize: FONTS.sizes.md, fontWeight: "700",
    color: COLORS.accent, marginRight: SPACING.sm,
  },
  rowBtn: {
    width: 44, height: 44,
    justifyContent: "center", alignItems: "center",
    borderLeftWidth: 1, borderLeftColor: COLORS.lightGray,
  },
  fab: {
    position: "absolute", bottom: 90, right: SPACING.lg,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: "center", alignItems: "center", elevation: 8,
  },
  fabText: { fontSize: 28, color: COLORS.white, lineHeight: 32 },
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", alignItems: "center",
    padding: SPACING.lg,
  },
  modal: {
    backgroundColor: COLORS.white, borderRadius: 24,
    padding: SPACING.lg, width: "100%",
    alignItems: "center", gap: SPACING.sm,
  },
  modalIcon: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#FFF0F3",
    justifyContent: "center", alignItems: "center",
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg, fontWeight: "700", color: COLORS.dark,
  },
  modalDesc: {
    fontSize: FONTS.sizes.sm, color: COLORS.darkGray,
    textAlign: "center", lineHeight: 20,
  },
  modalBtns: {
    flexDirection: "row", gap: SPACING.sm,
    width: "100%", marginTop: SPACING.sm,
  },
  cancelBtn: {
    flex: 1, padding: SPACING.md, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.lightGray,
    alignItems: "center",
  },
  cancelBtnText: { fontWeight: "600", color: COLORS.darkGray },
  deleteBtn: {
    flex: 1, padding: SPACING.md, borderRadius: 12,
    backgroundColor: COLORS.accent, alignItems: "center",
  },
  deleteBtnText: { fontWeight: "700", color: COLORS.white },
});
