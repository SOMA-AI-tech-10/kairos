import { AlertCircle } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/theme";

type Props = {
  message: string;
};

export function ErrorNotice({ message }: Props) {
  return (
    <View style={styles.notice}>
      <AlertCircle color={colors.danger} size={18} strokeWidth={2.5} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.pink50,
    borderWidth: 1,
    borderColor: colors.pink100,
  },
  text: {
    flex: 1,
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
});
