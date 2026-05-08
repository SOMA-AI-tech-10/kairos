import { Bot } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/theme";

type Props = {
  label?: string;
};

export function AgentTag({ label = "Kairos" }: Props) {
  return (
    <View style={styles.tag}>
      <Bot color={colors.indigo} size={15} strokeWidth={2.5} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.indigo50,
  },
  label: {
    color: colors.indigo,
    fontSize: 12,
    fontWeight: "800",
  },
});
