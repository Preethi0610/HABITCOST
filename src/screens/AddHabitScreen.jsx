import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, Alert,
} from "react-native";
import { COLORS, SPACING, FONTS, SHADOW } from "../constants/theme";
import { CATEGORIES, CATEGORY_ICONS } from "../data/categories";
import { useHabits } from "../hooks/useHabits";

const FREQUENCIES = ["daily", "weekly", "monthly"];

export default function AddHabitScreen({ navigation, route }) {
  const editingHabit = route?.params?.habit;
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState(editingHabit?.name || "");
  const [cost, setCost] = useState(editingHabit?.cost ? String(editingHabit.cost) : "");
  const [frequency, setFrequency] = useState(editingHabit?.frequency || "monthly");
  const [category, setCategory] = useState(editingHabit?.category || "Food");
  const isEditing = !!editingHabit;

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Missing name", "Please enter a habit name.");
    if (!cost || isNaN(parseFloat(cost)) || parseFloat(cost) <= 0)
      return Alert.alert("Invalid cost", "Please enter a valid cost greater than 0.");
    const data = {
      name: name.trim(),
      cost: parseFloat(parseFloat(cost).toFixed(2)),
      frequency,
      category,
    };
    try {
      if (isEditing) {
        await updateHabit(editingHabit.id, data);
      } else {
        await addHabit(data);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Could not save habit. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? "Edit Habit" : "New Habit"}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          style={[styles.input, SHADOW.small]}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Morning Coffee"
          placeholderTextColor={COLORS.gray}
        />

        <Text style={styles.label}>Cost per occurrence</Text>
        <TextInput
          style={[styles.input, SHADOW.small]}
          value={cost}
          onChangeText={setCost}
          placeholder="e.g. 5.50"
          placeholderTextColor={COLORS.gray}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Frequency</Text>
        <View style={styles.chips}>
          {FREQUENCIES.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, frequency === f && styles.chipActive]}
              onPress={() => setFrequency(f)}
            >
              <Text style={[styles.chipText, frequency === f && styles.chipTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.icon];
            const isSelected = category === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.catChip,
                  { borderColor: cat.color },
                  isSelected && { backgroundColor: cat.color },
                ]}
                onPress={() => setCategory(cat.name)}
              >
                {IconComponent && (
                  <IconComponent
                    size={14}
                    color={isSelected ? COLORS.white : cat.color}
                    strokeWidth={2}
                  />
                )}
                <Text style={[
                  styles.catText,
                  { color: isSelected ? COLORS.white : cat.color },
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", padding: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: "700", color: COLORS.white },
  cancel: { fontSize: FONTS.sizes.md, color: COLORS.gray },
  save: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.gold },
  form: { padding: SPACING.md, gap: 4 },
  label: {
    fontSize: FONTS.sizes.sm, fontWeight: "600", color: COLORS.darkGray,
    marginTop: SPACING.md, marginBottom: SPACING.xs,
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.white, borderRadius: 12,
    padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.dark,
  },
  chips: { flexDirection: "row", gap: SPACING.sm },
  chip: {
    flex: 1, padding: SPACING.sm, borderRadius: 10,
    borderWidth: 2, borderColor: COLORS.lightGray,
    alignItems: "center", backgroundColor: COLORS.white,
  },
  chipActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accent },
  chipText: { fontWeight: "600", color: COLORS.darkGray, fontSize: FONTS.sizes.sm },
  chipTextActive: { color: COLORS.white },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  catChip: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: 20, borderWidth: 2,
    backgroundColor: COLORS.white, gap: 6,
  },
  catText: { fontSize: FONTS.sizes.sm, fontWeight: "600" },
});
