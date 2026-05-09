import type { LucideProps } from "lucide-react-native";
import type { ComponentType } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../constants/theme";

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  icon?: ComponentType<LucideProps>;
};

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  variant = "primary",
  icon: Icon,
}: Props) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.paper : colors.indigo} />
      ) : (
        <View style={styles.content}>
          {Icon ? (
            <Icon
              color={isPrimary ? colors.paper : colors.indigo}
              size={18}
              strokeWidth={2.4}
            />
          ) : null}
          <Text style={[styles.title, isPrimary && styles.primaryTitle]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primary: {
    backgroundColor: colors.indigo,
  },
  secondary: {
    backgroundColor: colors.indigo50,
    borderWidth: 1,
    borderColor: colors.indigo100,
  },
  danger: {
    backgroundColor: colors.pink50,
    borderWidth: 1,
    borderColor: colors.pink100,
  },
  pressed: {
    opacity: 0.86,
  },
  disabled: {
    opacity: 0.48,
  },
  title: {
    color: colors.indigo,
    fontSize: 16,
    fontWeight: "800",
  },
  primaryTitle: {
    color: colors.paper,
  },
});
