import { StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/theme";

type Props = {
  children: string;
  from?: "agent" | "user";
};

export function AgentBubble({ children, from = "agent" }: Props) {
  const isUser = from === "user";
  return (
    <View style={[styles.wrapper, isUser && styles.userWrapper]}>
      <View style={[styles.bubble, isUser ? styles.user : styles.agent]}>
        <Text style={[styles.text, isUser && styles.userText]}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "flex-start",
  },
  userWrapper: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "88%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  agent: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 8,
  },
  user: {
    backgroundColor: colors.indigo,
    borderTopRightRadius: 8,
  },
  text: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
  },
  userText: {
    color: colors.paper,
  },
});
