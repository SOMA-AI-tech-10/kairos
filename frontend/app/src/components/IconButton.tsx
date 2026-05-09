import type { LucideProps } from "lucide-react-native";
import type { ComponentType } from "react";
import { Pressable, StyleSheet } from "react-native";

import { colors } from "../constants/theme";

type Props = {
  icon: ComponentType<LucideProps>;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function IconButton({ icon: Icon, label, onPress, disabled }: Props) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Icon color={colors.ink} size={20} strokeWidth={2.3} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pressed: {
    backgroundColor: colors.indigo50,
  },
  disabled: {
    opacity: 0.45,
  },
});
