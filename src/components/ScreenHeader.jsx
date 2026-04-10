import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingDown } from "lucide-react-native";
import { useAuth } from "../contexts/AuthContext";
import { COLORS, SPACING, FONTS } from "../constants/theme";

export default function ScreenHeader({ title, subtitle, right, navigation }) {
  const { user } = useAuth();

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "?";

  return (
    <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.header}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.logoRow}>
            <TrendingDown size={16} color={COLORS.gold} strokeWidth={2} />
            <Text style={styles.logoText}>HabitCost</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.rightWrap}>
          {right}
          {navigation && (
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { padding: SPACING.lg, paddingBottom: SPACING.lg },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  left: { gap: 2, flex: 1 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  logoText: { fontSize: FONTS.sizes.sm, color: COLORS.gold, fontWeight: "700", letterSpacing: 0.5 },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: "800", color: COLORS.white },
  subtitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginTop: 2 },
  rightWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.accent,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: FONTS.sizes.sm, fontWeight: "800", color: COLORS.white },
});
