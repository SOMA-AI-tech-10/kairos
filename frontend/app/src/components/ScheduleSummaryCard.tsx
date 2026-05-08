import { Bell, CalendarDays, Clock, MapPin } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/theme";
import type { ScheduleCandidate } from "../types/schedule";
import { formatDate, formatTime } from "../utils/dates";
import { reminderText } from "../utils/scheduleGuards";

type Props = {
  schedule: ScheduleCandidate;
};

export function ScheduleSummaryCard({ schedule }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{schedule.title || "제목 없음"}</Text>
      <InfoRow
        icon={CalendarDays}
        label={schedule.start_at ? formatDate(schedule.start_at) : "날짜 필요"}
      />
      <InfoRow
        icon={Clock}
        label={schedule.start_at ? formatTime(schedule.start_at) : "시간 필요"}
      />
      <InfoRow icon={MapPin} label={schedule.location || "장소 없음"} />
      <InfoRow icon={Bell} label={reminderText(schedule.reminder_minutes)} />
    </View>
  );
}

type IconProps = React.ComponentProps<typeof Bell>;

function InfoRow({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<IconProps>;
  label: string;
}) {
  return (
    <View style={styles.row}>
      <Icon color={colors.muted} size={17} strokeWidth={2.2} />
      <Text style={styles.rowText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    borderRadius: 22,
    padding: 18,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line2,
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900",
  },
  row: {
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowText: {
    flex: 1,
    color: colors.ink2,
    fontSize: 15,
    fontWeight: "700",
  },
});
