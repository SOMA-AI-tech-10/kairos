import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Send } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { listSchedules } from "../api/schedules";
import { Chip } from "../components/Chip";
import { EmptyState } from "../components/EmptyState";
import { ErrorNotice } from "../components/ErrorNotice";
import { KLogo } from "../components/KLogo";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScheduleRow } from "../components/ScheduleRow";
import { colors, shadow } from "../constants/theme";
import type { RootStackParamList } from "../navigation/types";
import type { Schedule } from "../types/schedule";
import { formatDate, toDateKey, todayKey } from "../utils/dates";

const suggestions = [
  "이번 주 토요일 오후 6시에 홍대에서 친구 만나. 1시간 전에 알려줘.",
  "내일 병원 가는 거 알림 맞춰줘.",
  "다음 주 월요일 오전 10시 회의",
];

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [text, setText] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSchedules(await listSchedules());
    } catch {
      setError("오늘 일정을 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const todaySchedules = useMemo(
    () => schedules.filter((schedule) => toDateKey(schedule.start_at) === todayKey()),
    [schedules],
  );

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    navigation.navigate("ScheduleFlow", { initialText: trimmed });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <KLogo />
        <View style={styles.headerText}>
          <Text style={styles.date}>{formatDate(new Date().toISOString())}</Text>
          <Text style={styles.title}>무엇을 기억할까요?</Text>
        </View>
      </View>

      <View style={[styles.inputCard, shadow]}>
        <TextInput
          multiline
          value={text}
          onChangeText={setText}
          placeholder="예: 금요일 자정까지 과제 제출"
          placeholderTextColor={colors.muted2}
          style={styles.input}
          textAlignVertical="top"
        />
        <View style={styles.chipWrap}>
          {suggestions.map((item) => (
            <Chip key={item} label={item} onPress={() => setText(item)} />
          ))}
        </View>
        <PrimaryButton
          title="분석하기"
          icon={Send}
          disabled={!text.trim()}
          onPress={submit}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>오늘 일정</Text>
        <Text style={styles.count}>{todaySchedules.length}개</Text>
      </View>
      {error ? <ErrorNotice message={error} /> : null}
      <View style={styles.list}>
        {todaySchedules.length ? (
          todaySchedules.map((schedule) => (
            <ScheduleRow
              key={schedule.id}
              schedule={schedule}
              onPress={() =>
                navigation.navigate("EventDetail", { scheduleId: schedule.id })
              }
            />
          ))
        ) : (
          <EmptyState title="오늘 등록된 일정이 없어요." />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    gap: 22,
    padding: 20,
    paddingTop: 64,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerText: {
    flex: 1,
  },
  date: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
  },
  inputCard: {
    gap: 16,
    borderRadius: 24,
    padding: 18,
    backgroundColor: colors.paper,
  },
  input: {
    minHeight: 112,
    color: colors.ink,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
  },
  count: {
    color: colors.indigo,
    fontSize: 14,
    fontWeight: "900",
  },
  list: {
    gap: 10,
  },
});
