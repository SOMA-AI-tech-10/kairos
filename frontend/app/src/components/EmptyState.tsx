import { StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/theme";
import { PrimaryButton } from "./PrimaryButton";

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, actionLabel, onAction }: Props) {
  return (
    <View style={styles.empty}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction ? (
        <PrimaryButton title={actionLabel} variant="secondary" onPress={onAction} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    gap: 14,
    alignItems: "stretch",
    justifyContent: "center",
    padding: 18,
    borderRadius: 20,
    backgroundColor: colors.mist,
  },
  title: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
    textAlign: "center",
  },
});
