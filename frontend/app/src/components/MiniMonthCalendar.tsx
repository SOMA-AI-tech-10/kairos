import { Pressable, Text, View } from "react-native";

import type { DateKey } from "../utils/dates";
import { buildMonthCells, todayKey } from "../utils/dates";
import { styles } from "./MiniMonthCalendar.style";

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
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  );

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
        {weeks.map((week, index) => (
          <View key={`week-${index}`} style={styles.week}>
            {week.map((cell) => {
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
        ))}
      </View>
    </View>
  );
}
