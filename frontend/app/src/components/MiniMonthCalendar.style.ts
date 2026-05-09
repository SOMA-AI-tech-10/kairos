import { StyleSheet } from "react-native";

import { colors } from "../constants/theme";

export const styles = StyleSheet.create({
  calendar: {
    borderRadius: 22,
    padding: 12,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line2,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
  },
  grid: {
    gap: 2,
  },
  week: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    minWidth: 0,
    aspectRatio: 0.86,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  selectedCircle: {
    backgroundColor: colors.ink,
    borderRadius: 17,
  },
  todayCircle: {
    borderWidth: 1.5,
    borderColor: colors.indigo,
    borderRadius: 17,
  },
  day: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  outsideDay: {
    color: colors.muted2,
  },
  selectedDay: {
    color: colors.paper,
  },
  dots: {
    height: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.indigo,
  },
});
