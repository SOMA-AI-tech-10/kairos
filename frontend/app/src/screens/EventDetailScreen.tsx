import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Bell, CalendarDays, ChevronLeft, Clock, MapPin } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { listSchedules } from "../api/schedules";
import { AgentTag } from "../components/AgentTag";
import { EmptyState } from "../components/EmptyState";
import { ErrorNotice } from "../components/ErrorNotice";
import { IconButton } from "../components/IconButton";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../constants/theme";
import type { RootStackParamList } from "../navigation/types";
import type { Schedule } from "../types/schedule";
import { formatDate, formatTimeRange } from "../utils/dates";
import { reminderText } from "../utils/scheduleGuards";

type Props = NativeStackScreenProps<RootStackParamList, "EventDetail">;

export function EventDetailScreen() {
  const route = useRoute<Props["route"]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const schedules = await listSchedules();
      setSchedule(
        schedules.find((item) => item.id === route.params.scheduleId) ?? null,
      );
    } catch {
      setError("일정을 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  }, [route.params.scheduleId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <IconButton icon={ChevronLeft} label="뒤로" onPress={() => navigation.goBack()} />
        <AgentTag label="Kairos가 등록" />
      </View>

      {error ? <ErrorNotice message={error} /> : null}
      {!loading && !schedule ? (
        <EmptyState
          title="일정을 찾을 수 없어요."
          actionLabel="캘린더로 돌아가기"
          onAction={() => navigation.navigate("MainTabs", { screen: "Calendar" })}
        />
      ) : null}

      {schedule ? (
        <View style={styles.card}>
          <Text style={styles.title}>{schedule.title}</Text>
          <DetailRow icon={CalendarDays} label={formatDate(schedule.start_at)} />
          <DetailRow icon={Clock} label={formatTimeRange(schedule)} />
          <DetailRow icon={MapPin} label={schedule.location || "장소 없음"} />
          <DetailRow icon={Bell} label={reminderText(schedule.reminder_minutes)} />
          {schedule.original_text ? (
            <View style={styles.originalBox}>
              <Text style={styles.originalLabel}>원래 입력</Text>
              <Text style={styles.originalText}>{schedule.original_text}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  );
}

type DetailIcon = React.ComponentProps<typeof Bell>;

function DetailRow({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<DetailIcon>;
  label: string;
}) {
  return (
    <View style={styles.row}>
      <Icon color={colors.indigo} size={19} strokeWidth={2.3} />
      <Text style={styles.rowText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    gap: 18,
    padding: 20,
    paddingTop: 58,
    paddingBottom: 36,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    gap: 18,
    borderRadius: 24,
    padding: 20,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line2,
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowText: {
    flex: 1,
    color: colors.ink2,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
  },
  originalBox: {
    gap: 8,
    borderRadius: 18,
    padding: 14,
    backgroundColor: colors.cream2,
  },
  originalLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
  },
  originalText: {
    color: colors.ink2,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
});
