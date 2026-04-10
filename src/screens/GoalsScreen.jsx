import { AlertTriangle, Plus, SlidersHorizontal, Target, Trash2, TrendingUp, X, Zap } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProgressBar from "../components/ProgressBar";
import ScreenHeader from "../components/ScreenHeader";
import { COLORS, FONTS, SHADOW, SPACING } from "../constants/theme";
import { useCurrency } from "../contexts/CurrencyContext";
import { GOALS, GOAL_ICONS } from "../data/goals";
import { useFinance } from "../hooks/useFinance";
import { useGoals } from "../hooks/useGoals";
import { useHabits } from "../hooks/useHabits";
import { useInsights } from "../hooks/useInsights";
import { formatMonths } from "../utils/formatters";

function GoalCard({ goal, monthlySavings, habitMonthly, format, onDelete }) {
  const IconComponent = GOAL_ICONS[goal.icon] || Target;

  // Timeline 1 — based on goal savings only
  const splitSavings = (monthlySavings * (goal.splitPct || 0)) / 100;
  const monthsNormal = splitSavings > 0 ? Math.ceil(goal.cost / splitSavings) : null;

  // Timeline 2 — if habits are cut, that money added to savings
  const withHabits = splitSavings + habitMonthly;
  const monthsFaster = withHabits > 0 ? Math.ceil(goal.cost / withHabits) : null;

  const monthsSaved = monthsNormal && monthsFaster ? monthsNormal - monthsFaster : 0;

  const progress = goal.cost > 0 && splitSavings > 0
    ? Math.min(splitSavings / goal.cost, 1) : 0;

  return (
    <View style={[styles.goalCard, SHADOW.small]}>
      {/* Header */}
      <View style={styles.goalCardHeader}>
        <View style={styles.goalCardLeft}>
          <View style={styles.goalIconWrap}>
            <IconComponent size={20} color={COLORS.accent} strokeWidth={1.5} />
          </View>
          <View>
            <Text style={styles.goalCardName}>{goal.name}</Text>
            <Text style={styles.goalCardCost}>{format(goal.cost)}</Text>
          </View>
        </View>
        <View style={styles.goalCardRight}>
          {goal.splitPct > 0 && (
            <View style={styles.splitBadge}>
              <Text style={styles.splitBadgeText}>{goal.splitPct}%</Text>
            </View>
          )}
          <TouchableOpacity style={styles.goalDeleteBtn} onPress={() => onDelete(goal)}>
            <Trash2 size={16} color={COLORS.gray} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {splitSavings > 0 ? (
        <>
          {/* Progress bar */}
          <ProgressBar progress={progress} color={COLORS.gold} height={8} />
          <Text style={styles.savingsNote}>{format(splitSavings)}/mo going to this goal</Text>

          {/* Two timelines */}
          <View style={styles.timelinesRow}>

            {/* Timeline 1 — current savings */}
            <View style={styles.timelineCard}>
              <Text style={styles.timelineLabel}>At current savings</Text>
              <Text style={styles.timelineValue}>
                {monthsNormal ? formatMonths(monthsNormal) : "—"}
              </Text>
              <Text style={styles.timelineSub}>{format(splitSavings)}/mo</Text>
            </View>

            {/* Arrow */}
            <View style={styles.timelineArrow}>
              <Zap size={16} color={COLORS.gold} strokeWidth={2} />
            </View>

            {/* Timeline 2 — if habits cut */}
            <View style={[styles.timelineCard, styles.timelineCardFaster]}>
              <Text style={[styles.timelineLabel, { color: COLORS.green }]}>Cut habits too</Text>
              <Text style={[styles.timelineValue, { color: COLORS.green }]}>
                {monthsFaster ? formatMonths(monthsFaster) : "—"}
              </Text>
              <Text style={styles.timelineSub}>+{format(habitMonthly)}/mo</Text>
            </View>

          </View>

          {/* Months saved callout */}
          {monthsSaved > 0 && (
            <View style={styles.callout}>
              <Zap size={12} color={COLORS.gold} strokeWidth={2} />
              <Text style={styles.calloutText}>
                Cut habits → reach this goal <Text style={styles.calloutBold}>{monthsSaved} month{monthsSaved > 1 ? "s" : ""} faster</Text>
              </Text>
            </View>
          )}

          {habitMonthly === 0 && (
            <Text style={styles.noHabitsNote}>Add habits to see how cutting them speeds up your goal</Text>
          )}
        </>
      ) : monthlySavings > 0 ? (
        <Text style={styles.goalNoSplit}>Set split % to see timeline</Text>
      ) : (
        <Text style={styles.goalNoSplit}>Set monthly savings in Profile to see timeline</Text>
      )}
    </View>
  );
}

export default function GoalsScreen({ navigation }) {
  const { goals, addGoal, deleteGoal, updateSplits } = useGoals();
  const { monthlyGoalSavings, updateFinance } = useFinance();
  const { habits } = useHabits();
  const { totalMonthly: habitMonthly } = useInsights(habits);
  const { format, currency } = useCurrency();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [goalAmount, setGoalAmount] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCost, setCustomCost] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [confirmGoal, setConfirmGoal] = useState(null);
  const [savingsInput, setSavingsInput] = useState("");
  const [splits, setSplits] = useState([]);

  useEffect(() => {
    if (goals.length === 0) return;
    setSplits(goals.map((g) => ({ id: g.id, name: g.name, splitPct: g.splitPct || 0, icon: g.icon })));
  }, [goals]);

  const totalSplit = splits.reduce((s, g) => s + (g.splitPct || 0), 0);
  const splitValid = totalSplit === 100;

  const canSave = isCustom
    ? customName.trim() && parseFloat(customCost) > 0
    : selectedPreset && parseFloat(goalAmount) > 0;

  const handleSaveGoal = async () => {
    if (!canSave) return;
    const newGoal = isCustom
      ? { name: customName.trim(), cost: parseFloat(customCost), icon: "Target" }
      : { name: selectedPreset.name, cost: parseFloat(goalAmount), icon: selectedPreset.icon };
    await addGoal(newGoal);
    setShowAddModal(false);
    setSelectedPreset(null); setGoalAmount(""); setCustomName(""); setCustomCost(""); setIsCustom(false);
  };

  const handleDeleteGoal = async () => {
    if (!confirmGoal) return;
    await deleteGoal(confirmGoal.id);
    setConfirmGoal(null);
  };

  const handleSaveSplit = async () => {
    await updateSplits(splits);
    setShowSplitModal(false);
  };

  const handleSaveSavings = async () => {
    await updateFinance(parseFloat(savingsInput) || 0);
    setShowSavingsModal(false);
  };

  const updateSplitPct = (id, val) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setSplits((prev) => prev.map((g) => g.id === id ? { ...g, splitPct: num } : g));
  };

  const distributeEqually = () => {
    const equal = Math.floor(100 / splits.length);
    const remainder = 100 - equal * splits.length;
    setSplits((prev) => prev.map((g, i) => ({ ...g, splitPct: i === 0 ? equal + remainder : equal })));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Goals" subtitle="Track what you're saving toward" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}>

        {/* Monthly savings banner */}
        <TouchableOpacity
          style={[styles.savingsBanner, SHADOW.small]}
          onPress={() => { setSavingsInput(monthlyGoalSavings > 0 ? String(monthlyGoalSavings) : ""); setShowSavingsModal(true); }}
        >
          <View style={styles.savingsBannerLeft}>
            <TrendingUp size={18} color={monthlyGoalSavings > 0 ? COLORS.green : COLORS.gray} strokeWidth={2} />
            <View>
              <Text style={styles.savingsBannerLabel}>Monthly Goal Savings</Text>
              <Text style={[styles.savingsBannerValue, { color: monthlyGoalSavings > 0 ? COLORS.green : COLORS.gray }]}>
                {monthlyGoalSavings > 0 ? `${format(monthlyGoalSavings)} / month` : "Tap to set amount"}
              </Text>
            </View>
          </View>
          <Text style={styles.savingsEditBtn}>Edit</Text>
        </TouchableOpacity>

        {/* Habit spend info */}
        {habitMonthly > 0 && (
          <View style={styles.habitBanner}>
            <Zap size={14} color={COLORS.gold} strokeWidth={2} />
            <Text style={styles.habitBannerText}>
              You spend {format(habitMonthly)}/mo on habits. Cutting them could speed up every goal.
            </Text>
          </View>
        )}

        {/* Split button */}
        {goals.length >= 2 && (
          <TouchableOpacity
            style={[styles.splitBtn, SHADOW.small, !splitValid && styles.splitBtnWarning]}
            onPress={() => setShowSplitModal(true)}
          >
            <SlidersHorizontal size={16} color={splitValid ? COLORS.primary : COLORS.gold} strokeWidth={2} />
            <Text style={[styles.splitBtnText, !splitValid && styles.splitBtnTextWarning]}>
              {splitValid ? `Split set ${totalSplit}% allocated` : `Set how to split your savings (${totalSplit}% of 100%)`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Goals */}
        {goals.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>My Goals</Text>
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                monthlySavings={monthlyGoalSavings}
                habitMonthly={habitMonthly}
                format={format}
                onDelete={(g) => setConfirmGoal(g)}
              />
            ))}
          </>
        )}

        {/* Empty state */}
        {goals.length === 0 && (
          <View style={[styles.emptyCard, SHADOW.small]}>
            <Target size={40} color={COLORS.lightGray} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptyDesc}>Add a goal to see how long it takes to save up — and how cutting habits speeds it up.</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.addBtn, SHADOW.small]} onPress={() => {
          setSelectedPreset(null); setGoalAmount(""); setCustomName(""); setCustomCost(""); setIsCustom(false); setShowAddModal(true);
        }}>
          <Plus size={18} color={COLORS.white} strokeWidth={2} />
          <Text style={styles.addBtnText}>Add a Goal</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Savings Modal */}
      <Modal visible={showSavingsModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Monthly Goal Savings</Text>
            <TouchableOpacity onPress={() => setShowSavingsModal(false)}>
              <X size={20} color={COLORS.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalDesc}>How much do you set aside each month just for goals?</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.amountSymbol}>{currency.symbol}</Text>
              <TextInput style={styles.amountInput} value={savingsInput} onChangeText={setSavingsInput}
                placeholder="e.g. 255" placeholderTextColor={COLORS.gray} keyboardType="decimal-pad" autoFocus />
            </View>
            <Text style={styles.modalHint}>Separate from rent, bills, groceries — just goal savings.</Text>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSavings}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Split Modal */}
      <Modal visible={showSplitModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Split Your Savings</Text>
            <TouchableOpacity onPress={() => setShowSplitModal(false)}>
              <X size={20} color={COLORS.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalDesc}>
              You save {format(monthlyGoalSavings)}/month. Decide how to split it. Must total 100%.
            </Text>
            <TouchableOpacity style={styles.equalBtn} onPress={distributeEqually}>
              <Text style={styles.equalBtnText}>Split equally</Text>
            </TouchableOpacity>
            {splits.map((goal) => {
              const IconComponent = GOAL_ICONS[goal.icon] || Target;
              const monthly = (monthlyGoalSavings * (goal.splitPct || 0)) / 100;
              return (
                <View key={goal.id} style={[styles.splitRow, SHADOW.small]}>
                  <View style={styles.splitRowLeft}>
                    <IconComponent size={18} color={COLORS.accent} strokeWidth={1.5} />
                    <View>
                      <Text style={styles.splitGoalName}>{goal.name}</Text>
                      {monthly > 0 && <Text style={styles.splitMonthly}>{format(monthly)}/mo</Text>}
                    </View>
                  </View>
                  <View style={styles.splitInputWrap}>
                    <TextInput
                      style={styles.splitInput}
                      value={String(goal.splitPct || "")}
                      onChangeText={(v) => updateSplitPct(goal.id, v)}
                      keyboardType="number-pad"
                      maxLength={3}
                    />
                    <Text style={styles.splitPctSign}>%</Text>
                  </View>
                </View>
              );
            })}
            <View style={[styles.totalRow, { backgroundColor: splitValid ? "#EAFAF1" : "#FFF9ED" }]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={[styles.totalValue, { color: splitValid ? COLORS.green : COLORS.gold }]}>
                {totalSplit}% {splitValid ? "✓" : `(${100 - totalSplit} remaining)`}
              </Text>
            </View>
            <TouchableOpacity style={[styles.saveBtn, !splitValid && styles.saveBtnDisabled]} onPress={handleSaveSplit} disabled={!splitValid}>
              <Text style={styles.saveBtnText}>Save Split</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add Goal Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add a Goal</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={20} color={COLORS.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.toggle}>
              <TouchableOpacity style={[styles.toggleBtn, !isCustom && styles.toggleBtnActive]} onPress={() => setIsCustom(false)}>
                <Text style={[styles.toggleBtnText, !isCustom && styles.toggleBtnTextActive]}>Pick a Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, isCustom && styles.toggleBtnActive]} onPress={() => setIsCustom(true)}>
                <Text style={[styles.toggleBtnText, isCustom && styles.toggleBtnTextActive]}>Custom Goal</Text>
              </TouchableOpacity>
            </View>
            {!isCustom && (
              <>
                <Text style={styles.inputLabel}>Select a goal</Text>
                <View style={styles.presetGrid}>
                  {GOALS.map((goal) => {
                    const IconComponent = GOAL_ICONS[goal.icon];
                    const isActive = selectedPreset?.name === goal.name;
                    return (
                      <TouchableOpacity key={goal.name} style={[styles.presetChip, isActive && styles.presetChipActive]} onPress={() => setSelectedPreset(isActive ? null : goal)}>
                        {IconComponent && <IconComponent size={22} color={isActive ? COLORS.gold : COLORS.darkGray} strokeWidth={1.5} />}
                        <Text style={[styles.presetName, isActive && styles.presetNameActive]}>{goal.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {selectedPreset && (
                  <>
                    <Text style={styles.inputLabel}>How much does your {selectedPreset.name} cost?</Text>
                    <View style={styles.amountInputRow}>
                      <Text style={styles.amountSymbol}>{currency.symbol}</Text>
                      <TextInput style={styles.amountInput} value={goalAmount} onChangeText={setGoalAmount} placeholder="e.g. 1299" placeholderTextColor={COLORS.gray} keyboardType="decimal-pad" autoFocus />
                    </View>
                  </>
                )}
              </>
            )}
            {isCustom && (
              <>
                <Text style={styles.inputLabel}>Goal name</Text>
                <TextInput style={styles.input} value={customName} onChangeText={setCustomName} placeholder="e.g. Dream Vacation" placeholderTextColor={COLORS.gray} />
                <Text style={styles.inputLabel}>Amount ({currency.symbol})</Text>
                <View style={styles.amountInputRow}>
                  <Text style={styles.amountSymbol}>{currency.symbol}</Text>
                  <TextInput style={styles.amountInput} value={customCost} onChangeText={setCustomCost} placeholder="e.g. 2500" placeholderTextColor={COLORS.gray} keyboardType="decimal-pad" />
                </View>
              </>
            )}
            <TouchableOpacity style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]} onPress={handleSaveGoal} disabled={!canSave}>
              <Plus size={16} color={COLORS.white} strokeWidth={2} />
              <Text style={styles.saveBtnText}>Add to My Goals</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Delete confirm */}
      <Modal visible={!!confirmGoal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.confirmModal}>
            <View style={styles.confirmIcon}>
              <AlertTriangle size={28} color={COLORS.accent} strokeWidth={2} />
            </View>
            <Text style={styles.confirmTitle}>Remove Goal</Text>
            <Text style={styles.confirmDesc}>Remove "{confirmGoal?.name}" from your goals?</Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity style={styles.confirmCancel} onPress={() => setConfirmGoal(null)}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDelete} onPress={handleDeleteGoal}>
                <Text style={styles.confirmDeleteText}>Remove</Text>
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
  content: { padding: SPACING.md, paddingBottom: 60, gap: SPACING.sm },
  savingsBanner: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: SPACING.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  savingsBannerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  savingsBannerLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.5 },
  savingsBannerValue: { fontSize: FONTS.sizes.md, fontWeight: "700" },
  savingsEditBtn: { fontSize: FONTS.sizes.sm, color: COLORS.accent, fontWeight: "700" },
  habitBanner: { backgroundColor: "#FFF9ED", borderRadius: 12, padding: SPACING.md, flexDirection: "row", alignItems: "center", gap: 8 },
  habitBannerText: { fontSize: FONTS.sizes.sm, color: COLORS.dark, flex: 1, lineHeight: 18 },
  habitBannerBold: { fontWeight: "700", color: COLORS.gold },
  splitBtn: { backgroundColor: COLORS.cardBg, borderRadius: 12, padding: SPACING.md, flexDirection: "row", alignItems: "center", gap: 10 },
  splitBtnWarning: { backgroundColor: "#FFF9ED" },
  splitBtnText: { fontSize: FONTS.sizes.sm, fontWeight: "600", color: COLORS.primary, flex: 1 },
  splitBtnTextWarning: { color: COLORS.gold },
  sectionLabel: { fontSize: FONTS.sizes.sm, fontWeight: "700", color: COLORS.darkGray, textTransform: "uppercase", letterSpacing: 0.5 },
  goalCard: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: SPACING.md, gap: SPACING.sm },
  goalCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  goalCardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  goalIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF0F3", justifyContent: "center", alignItems: "center" },
  goalCardName: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.dark },
  goalCardCost: { fontSize: FONTS.sizes.sm, color: COLORS.accent, fontWeight: "600" },
  goalCardRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  splitBadge: { backgroundColor: COLORS.gold + "22", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  splitBadgeText: { fontSize: FONTS.sizes.xs, fontWeight: "700", color: COLORS.gold },
  goalDeleteBtn: { padding: 6 },
  savingsNote: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  timelinesRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginTop: SPACING.xs },
  timelineCard: {
    flex: 1, backgroundColor: COLORS.light,
    borderRadius: 12, padding: SPACING.sm, alignItems: "center", gap: 2,
  },
  timelineCardFaster: { backgroundColor: "#EAFAF1" },
  timelineLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: "center" },
  timelineValue: { fontSize: FONTS.sizes.md, fontWeight: "800", color: COLORS.primary, textAlign: "center" },
  timelineSub: { fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: "center" },
  timelineArrow: { alignItems: "center" },
  callout: {
    backgroundColor: "#FFF9ED", borderRadius: 10,
    padding: SPACING.sm, flexDirection: "row",
    alignItems: "center", gap: 6,
  },
  calloutText: { fontSize: FONTS.sizes.xs, color: COLORS.dark, flex: 1, lineHeight: 16 },
  calloutBold: { fontWeight: "700", color: COLORS.gold },
  noHabitsNote: { fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: "center" },
  goalNoSplit: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  emptyCard: { backgroundColor: COLORS.cardBg, borderRadius: 20, padding: SPACING.xl, alignItems: "center", gap: SPACING.sm },
  emptyTitle: { fontSize: FONTS.sizes.lg, fontWeight: "700", color: COLORS.dark },
  emptyDesc: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, textAlign: "center", lineHeight: 20 },
  addBtn: { backgroundColor: COLORS.accent, borderRadius: 16, padding: SPACING.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  addBtnText: { color: COLORS.white, fontWeight: "700", fontSize: FONTS.sizes.md },
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.md, backgroundColor: COLORS.primary },
  modalTitle: { fontSize: FONTS.sizes.lg, fontWeight: "700", color: COLORS.white },
  modalContent: { padding: SPACING.md, paddingBottom: 40, gap: SPACING.sm },
  modalDesc: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, lineHeight: 20 },
  modalHint: { fontSize: FONTS.sizes.xs, color: COLORS.gray, fontStyle: "italic" },
  amountInputRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.light, borderRadius: 12, paddingHorizontal: SPACING.md },
  amountSymbol: { fontSize: FONTS.sizes.xl, color: COLORS.darkGray, marginRight: 4 },
  amountInput: { flex: 1, fontSize: FONTS.sizes.xl, fontWeight: "700", color: COLORS.dark, padding: SPACING.md },
  equalBtn: { backgroundColor: COLORS.light, borderRadius: 10, padding: SPACING.sm, alignItems: "center" },
  equalBtnText: { fontSize: FONTS.sizes.sm, fontWeight: "600", color: COLORS.primary },
  splitRow: { backgroundColor: COLORS.cardBg, borderRadius: 14, padding: SPACING.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  splitRowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  splitGoalName: { fontSize: FONTS.sizes.md, fontWeight: "600", color: COLORS.dark },
  splitMonthly: { fontSize: FONTS.sizes.xs, color: COLORS.green, fontWeight: "600" },
  splitInputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.light, borderRadius: 10, paddingHorizontal: SPACING.sm },
  splitInput: { fontSize: FONTS.sizes.xl, fontWeight: "700", color: COLORS.primary, width: 52, textAlign: "center", padding: SPACING.sm },
  splitPctSign: { fontSize: FONTS.sizes.md, color: COLORS.darkGray, fontWeight: "600" },
  totalRow: { borderRadius: 12, padding: SPACING.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.dark },
  totalValue: { fontSize: FONTS.sizes.md, fontWeight: "700" },
  toggle: { flexDirection: "row", backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 4 },
  toggleBtn: { flex: 1, padding: SPACING.sm, borderRadius: 10, alignItems: "center" },
  toggleBtnActive: { backgroundColor: COLORS.white },
  toggleBtnText: { fontSize: FONTS.sizes.sm, fontWeight: "600", color: COLORS.gray },
  toggleBtnTextActive: { color: COLORS.primary },
  inputLabel: { fontSize: FONTS.sizes.xs, fontWeight: "600", color: COLORS.darkGray, textTransform: "uppercase", letterSpacing: 0.5 },
  presetGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  presetChip: { backgroundColor: COLORS.cardBg, borderRadius: 12, padding: SPACING.sm, alignItems: "center", width: "30%", borderWidth: 2, borderColor: "transparent", gap: 4 },
  presetChipActive: { borderColor: COLORS.gold, backgroundColor: "#FFF9ED" },
  presetName: { fontSize: FONTS.sizes.xs, fontWeight: "600", color: COLORS.dark, textAlign: "center" },
  presetNameActive: { color: COLORS.primary },
  input: { backgroundColor: COLORS.light, borderRadius: 12, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.dark },
  saveBtn: { backgroundColor: COLORS.accent, borderRadius: 16, padding: SPACING.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: SPACING.sm },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: COLORS.white, fontWeight: "700", fontSize: FONTS.sizes.md },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: SPACING.lg },
  confirmModal: { backgroundColor: COLORS.white, borderRadius: 24, padding: SPACING.lg, width: "100%", alignItems: "center", gap: SPACING.sm },
  confirmIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFF0F3", justifyContent: "center", alignItems: "center" },
  confirmTitle: { fontSize: FONTS.sizes.lg, fontWeight: "700", color: COLORS.dark },
  confirmDesc: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, textAlign: "center" },
  confirmBtns: { flexDirection: "row", gap: SPACING.sm, width: "100%", marginTop: SPACING.sm },
  confirmCancel: { flex: 1, padding: SPACING.md, borderRadius: 12, borderWidth: 1, borderColor: COLORS.lightGray, alignItems: "center" },
  confirmCancelText: { fontWeight: "600", color: COLORS.darkGray },
  confirmDelete: { flex: 1, padding: SPACING.md, borderRadius: 12, backgroundColor: COLORS.accent, alignItems: "center" },
  confirmDeleteText: { fontWeight: "700", color: COLORS.white },
});
