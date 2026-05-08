import { Bell, MapPin } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/theme";
import type { Schedule } from "../types/schedule";
import { formatTime } from "../utils/dates";

type Props = {
  schedule: Schedule;
  onPress?: () => void;
  fresh?: boolean;
};

export function ScheduleRow({ schedule, onPress, fresh }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text style={styles.time}>{formatTime(schedule.start_at)}</Text>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {schedule.title}
          </Text>
          {fresh ? <Text style={styles.badge}>방금 등록</Text> : null}
        </View>
        <View style={styles.meta}>
          {schedule.location ? (
            <View style={styles.metaItem}>
              <MapPin color={colors.muted} size={13} strokeWidth={2.2} />
              <Text style={styles.metaText} numberOfLines={1}>
                {schedule.location}
              </Text>
            </View>
          ) : null}
          <View style={styles.metaItem}>
            <Bell color={colors.muted} size={13} strokeWidth={2.2} />
            <Text style={styles.metaText}>{schedule.reminder_minutes}분 전</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line2,
  },
  pressed: {
    backgroundColor: colors.indigo50,
  },
  time: {
    width: 72,
    color: colors.indigo,
    fontSize: 14,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  body: {
    flex: 1,
    gap: 7,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    fontWeight: "800",
  },
  badge: {
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: colors.indigo,
    backgroundColor: colors.indigo50,
    fontSize: 11,
    fontWeight: "900",
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaItem: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
});
