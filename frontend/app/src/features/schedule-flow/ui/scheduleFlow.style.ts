import { StyleSheet } from "react-native";

import { colors } from "../../../constants/theme";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  topBar: {
    paddingTop: 58,
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 36,
  },
  panel: {
    gap: 14,
    borderRadius: 22,
    padding: 16,
    backgroundColor: colors.paper,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
  },
  agentPanel: {
    gap: 14,
  },
  agentTitle: {
    color: colors.indigo,
    fontSize: 15,
    fontWeight: "900",
  },
  textArea: {
    minHeight: 120,
    borderRadius: 18,
    padding: 14,
    backgroundColor: colors.cream2,
    color: colors.ink,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
  },
  quickReplies: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  input: {
    minHeight: 50,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 16,
    fontWeight: "700",
  },
  actions: {
    gap: 10,
  },
  doneText: {
    color: colors.success,
    fontSize: 15,
    fontWeight: "800",
  },
  editForm: {
    gap: 10,
    borderRadius: 20,
    padding: 14,
    backgroundColor: colors.indigo50,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
  },
  fieldInput: {
    minHeight: 44,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: colors.paper,
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
  },
});
