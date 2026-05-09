import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { listSchedules } from "../api/schedules";
import { EmptyState } from "../components/EmptyState";
import { ErrorNotice } from "../components/ErrorNotice";
import { IconButton } from "../components/IconButton";
import { MiniMonthCalendar } from "../components/MiniMonthCalendar";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScheduleRow } from "../components/ScheduleRow";
import { colors } from "../constants/theme";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import type { Schedule } from "../types/schedule";
import {
  addMonths,
  type DateKey,
  formatDate,
  groupSchedulesByDate,
  keyToLocalDate,
  todayKey,
} from "../utils/dates";

type CalendarRoute = BottomTabScreenProps<MainTabParamList, "Calendar">["route"];
type CalendarNavigation = CompositeNavigationProp<
  BottomTabScreenProps<MainTabParamList, "Calendar">["navigation"],
  NativeStackNavigationProp<RootStackParamList>
>;

export function CalendarScreen() {
  const route = useRoute<CalendarRoute>();
  const navigation = useNavigation<CalendarNavigation>();
  const initialDate = (route.params?.selectedDate ?? todayKey()) as DateKey;
  const [selectedDate, setSelectedDate] = useState<DateKey>(initialDate);
  const [monthDate, setMonthDate] = useState(() => keyToLocalDate(initialDate));
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSchedules(await listSchedules());
    } catch {
      setError("캘린더 일정을 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const nextDate = route.params?.selectedDate;
      if (nextDate) {
        setSelectedDate(nextDate as DateKey);
        setMonthDate(keyToLocalDate(nextDate));
      }
      void load();
    }, [load, route.params?.selectedDate]),
  );

  const grouped = useMemo(() => groupSchedulesByDate(schedules), [schedules]);
  const countsByDate = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(grouped).map(([key, value]) => [key, value.length]),
      ),
    [grouped],
  );
  const selectedSchedules: Schedule[] = grouped[selectedDate] ?? [];
  const freshScheduleId = route.params?.freshScheduleId;
  const monthName = englishMonths[monthDate.getMonth()];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.year}>{monthDate.getFullYear()}</Text>
          <Text style={styles.month}>
            {monthDate.getMonth() + 1}월 {monthName}
          </Text>
        </View>
        <View style={styles.monthControls}>
          <IconButton
            icon={ChevronLeft}
            label="이전 달"
            onPress={() => setMonthDate((date) => addMonths(date, -1))}
          />
          <IconButton
            icon={ChevronRight}
            label="다음 달"
            onPress={() => setMonthDate((date) => addMonths(date, 1))}
          />
        </View>
      </View>

      {error ? <ErrorNotice message={error} /> : null}
      <MiniMonthCalendar
        monthDate={monthDate}
        selectedDate={selectedDate}
        countsByDate={countsByDate}
        onSelectDate={setSelectedDate}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>{formatDate(`${selectedDate}T00:00:00+09:00`)}</Text>
        <Text style={styles.summaryCount}>{selectedSchedules.length}개 일정</Text>
      </View>

      <View style={styles.list}>
        {selectedSchedules.length ? (
          selectedSchedules.map((schedule) => (
            <ScheduleRow
              key={schedule.id}
              schedule={schedule}
              fresh={schedule.id === freshScheduleId}
              onPress={() =>
                navigation.navigate("EventDetail", { scheduleId: schedule.id })
              }
            />
          ))
        ) : (
          <EmptyState
            title="이 날은 등록된 일정이 없어요."
            actionLabel="일정 만들기"
            onAction={() => navigation.navigate("ScheduleFlow")}
          />
        )}
      </View>

      <PrimaryButton
        title="일정 만들기"
        icon={Plus}
        onPress={() => navigation.navigate("ScheduleFlow")}
      />
    </ScrollView>
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
    paddingTop: 64,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  year: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900",
  },
  month: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "900",
  },
  monthControls: {
    flexDirection: "row",
    gap: 8,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTitle: {
    flex: 1,
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
  },
  summaryCount: {
    color: colors.indigo,
    fontSize: 14,
    fontWeight: "900",
  },
  list: {
    gap: 10,
  },
});

const englishMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
