import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getCategoryMeta, CATEGORY_ICONS } from "../data/categories";

export default function CategoryBadge({ category, small = false }) {
  const meta = getCategoryMeta(category);
  const IconComponent = CATEGORY_ICONS[meta.icon];
  const iconSize = small ? 10 : 13;

  return (
    <View style={[
      styles.badge,
      { backgroundColor: meta.color + "22" },
      small && styles.small,
    ]}>
      {IconComponent && (
        <IconComponent size={iconSize} color={meta.color} strokeWidth={2} />
      )}
      <Text style={[
        styles.text,
        { color: meta.color },
        small && styles.smallText,
      ]}>
        {category}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: "flex-start", gap: 4,
  },
  text: { fontSize: 12, fontWeight: "600" },
  small: { paddingHorizontal: 7, paddingVertical: 2 },
  smallText: { fontSize: 10 },
});
