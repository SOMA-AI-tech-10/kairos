import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../constants/theme";

type Props = {
  label: string;
  onPress?: () => void;
  selected?: boolean;
};

export function Chip({ label, onPress, selected }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
  },
  selected: {
    backgroundColor: colors.indigo,
    borderColor: colors.indigo,
  },
  pressed: {
    opacity: 0.78,
  },
  label: {
    color: colors.ink2,
    fontSize: 14,
    fontWeight: "700",
  },
  selectedLabel: {
    color: colors.paper,
  },
});
