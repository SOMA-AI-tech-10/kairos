import { StyleSheet, View } from "react-native";

import { colors } from "../constants/theme";

export function ThinkingDots() {
  return (
    <View style={styles.row} accessibilityLabel="분석 중">
      <View style={styles.dot} />
      <View style={[styles.dot, styles.middle]} />
      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 5,
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.indigo,
    opacity: 0.55,
  },
  middle: {
    opacity: 0.85,
  },
});
