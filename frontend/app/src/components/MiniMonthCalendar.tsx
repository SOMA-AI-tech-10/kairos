import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/theme";
import type { DateKey } from "../utils/dates";
import { buildMonthCells, todayKey } from "../utils/dates";

type Props = {
  monthDate: Date;
  selectedDate: DateKey;
  countsByDate: Record<string, number>;
  onSelectDate: (date: DateKey) => void;
};

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export function MiniMonthCalendar({
  monthDate,
  selectedDate,
  countsByDate,
  onSelectDate,
}: Props) {
  const today = todayKey();
  const cells = buildMonthCells(monthDate);

  return (
    <View style={styles.calendar}>
      <View style={styles.weekRow}>
        {weekdays.map((day) => (
          <Text key={day} style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((cell) => {
          const selected = cell.key === selectedDate;
          const isToday = cell.key === today;
          const count = Math.min(countsByDate[cell.key] ?? 0, 3);
          return (
            <Pressable
              key={cell.key}
              accessibilityRole="button"
              onPress={() => onSelectDate(cell.key)}
              style={styles.cell}
            >
              <View
                style={[
                  styles.dayCircle,
                  selected && styles.selectedCircle,
                  isToday && !selected && styles.todayCircle,
                ]}
              >
                <Text
                  style={[
                    styles.day,
                    !cell.inMonth && styles.outsideDay,
                    selected && styles.selectedDay,
                  ]}
                >
                  {cell.day}
                </Text>
              </View>
              <View style={styles.dots}>
                {Array.from({ length: count }).map((_, index) => (
                  <View key={index} style={styles.dot} />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 0.86,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircle: {
    backgroundColor: colors.ink,
  },
  todayCircle: {
    borderWidth: 1.5,
    borderColor: colors.indigo,
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
