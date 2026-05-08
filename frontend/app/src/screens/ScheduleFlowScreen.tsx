import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CalendarDays, Check, Home, RotateCcw, X } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { analyzeSchedule, createSchedule } from "../api/schedules";
import { AgentBubble } from "../components/AgentBubble";
import { AgentTag } from "../components/AgentTag";
import { Chip } from "../components/Chip";
import { ErrorNotice } from "../components/ErrorNotice";
import { IconButton } from "../components/IconButton";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScheduleSummaryCard } from "../components/ScheduleSummaryCard";
import { ThinkingDots } from "../components/ThinkingDots";
import { colors } from "../constants/theme";
import type { RootStackParamList } from "../navigation/types";
import type { Schedule, ScheduleCandidate } from "../types/schedule";
import { toDateKey } from "../utils/dates";
import {
  buildSchedulePayload,
  composeInput,
  getFollowUpQuestion,
  isReadyToConfirm,
} from "../utils/scheduleGuards";
import {
  notificationMessage,
  scheduleLocalNotification,
  type NotificationScheduleResult,
} from "../utils/notifications";

type Props = NativeStackScreenProps<RootStackParamList, "ScheduleFlow">;

type FlowStatus =
  | "idle"
  | "analyzing"
  | "needsInput"
  | "confirming"
  | "saving"
  | "done"
  | "failed";

const emptyCandidate: ScheduleCandidate = {
  title: null,
  start_at: null,
  end_at: null,
  location: null,
  reminder_minutes: null,
};

const quickReplies = ["오전 10시", "오후 3시", "이번 주 토요일 오후 6시"];

export function ScheduleFlowScreen() {
  const route = useRoute<Props["route"]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const initialText = route.params?.initialText ?? "";
  const [status, setStatus] = useState<FlowStatus>(initialText ? "analyzing" : "idle");
  const [originalText, setOriginalText] = useState(initialText);
  const [inputText, setInputText] = useState(initialText);
  const [answer, setAnswer] = useState("");
  const [candidate, setCandidate] = useState<ScheduleCandidate>(emptyCandidate);
  const [error, setError] = useState<string | null>(null);
  const [savedSchedule, setSavedSchedule] = useState<Schedule | null>(null);
  const [notificationResult, setNotificationResult] =
    useState<NotificationScheduleResult | null>(null);
  const started = useRef(false);
  const runId = useRef<string>(newRunId());

  const transition = useCallback(
    (next: FlowStatus, reason?: string) => {
      console.info("[kairos:schedule-flow]", {
        workflowRunId: runId.current,
        originalText,
        from: status,
        to: next,
        reason,
      });
      setStatus(next);
    },
    [originalText, status],
  );

  const analyze = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < 2) {
        setError("일정으로 등록할 내용을 조금 더 자세히 입력해주세요.");
        transition("failed", "input_guardrail");
        return;
      }

      setError(null);
      transition("analyzing");
      try {
        const response = await analyzeSchedule(trimmed);
        const nextCandidate = normalizeCandidate(response.schedule);
        setCandidate(nextCandidate);
        if (isReadyToConfirm(nextCandidate)) {
          transition("confirming", "candidate_ready");
        } else {
          transition("needsInput", "missing_required_fields");
        }
      } catch (err) {
        console.warn("[kairos:schedule-flow] analyze failed", err);
        setError("일정 분석 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
        transition("failed", "analyze_error");
      }
    },
    [transition],
  );

  useEffect(() => {
    if (initialText && !started.current) {
      started.current = true;
      void analyze(initialText);
    }
  }, [analyze, initialText]);

  const canConfirm = useMemo(() => isReadyToConfirm(candidate), [candidate]);

  const submitIdle = () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      return;
    }
    runId.current = newRunId();
    setOriginalText(trimmed);
    setSavedSchedule(null);
    setNotificationResult(null);
    void analyze(trimmed);
  };

  const submitAnswer = (value = answer) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    const composed = composeInput(originalText, trimmed);
    setInputText(composed);
    setAnswer("");
    void analyze(composed);
  };

  const save = async () => {
    if (status !== "confirming" || !canConfirm) {
      return;
    }

    transition("saving", "user_confirmed");
    try {
      const payload = buildSchedulePayload(candidate, originalText);
      const schedule = await createSchedule(payload);
      setSavedSchedule(schedule);
      const notification = await scheduleLocalNotification(schedule);
      setNotificationResult(notification);
      transition("done", "saved");
    } catch (err) {
      console.warn("[kairos:schedule-flow] save failed", err);
      setError("일정을 저장하지 못했어요. 네트워크 상태를 확인하고 다시 시도해주세요.");
      transition("failed", "save_error");
    }
  };

  const goCalendar = () => {
    if (!savedSchedule) {
      return;
    }
    navigation.navigate("MainTabs", {
      screen: "Calendar",
      params: {
        selectedDate: toDateKey(savedSchedule.start_at),
        freshScheduleId: savedSchedule.id,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.topBar}>
        <IconButton icon={X} label="닫기" onPress={() => navigation.navigate("MainTabs")} />
        <AgentTag label="Kairos · ScheduleFlow" />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {originalText ? <AgentBubble from="user">{originalText}</AgentBubble> : null}

        {status === "idle" ? (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>일정 입력</Text>
            <TextInput
              multiline
              value={inputText}
              onChangeText={setInputText}
              placeholder="일정을 자연스럽게 적어주세요."
              placeholderTextColor={colors.muted2}
              style={styles.textArea}
              textAlignVertical="top"
            />
            <PrimaryButton
              title="분석하기"
              disabled={!inputText.trim()}
              onPress={submitIdle}
            />
          </View>
        ) : null}

        {status === "analyzing" ? (
          <View style={styles.agentPanel}>
            <Text style={styles.agentTitle}>Kairos · 입력 분석 중</Text>
            <ThinkingDots />
            <ScheduleSummaryCard schedule={candidate} />
          </View>
        ) : null}

        {status === "needsInput" ? (
          <View style={styles.agentPanel}>
            <AgentBubble>{getFollowUpQuestion(candidate)}</AgentBubble>
            <View style={styles.quickReplies}>
              {quickReplies.map((reply) => (
                <Chip
                  key={reply}
                  label={reply}
                  onPress={() => submitAnswer(reply)}
                />
              ))}
            </View>
            <TextInput
              value={answer}
              onChangeText={setAnswer}
              placeholder="추가 정보를 입력하세요."
              placeholderTextColor={colors.muted2}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={() => submitAnswer()}
            />
            <PrimaryButton
              title="답변 보내기"
              disabled={!answer.trim()}
              onPress={() => submitAnswer()}
            />
          </View>
        ) : null}

        {status === "confirming" || status === "saving" ? (
          <View style={styles.agentPanel}>
            <AgentBubble>아래 내용으로 등록할까요?</AgentBubble>
            <ScheduleSummaryCard schedule={candidate} />
            <EditCandidateForm candidate={candidate} onChange={setCandidate} />
            <View style={styles.actions}>
              <PrimaryButton
                title="수정 완료"
                variant="secondary"
                disabled={!canConfirm || status === "saving"}
              />
              <PrimaryButton
                title="등록하기"
                icon={Check}
                loading={status === "saving"}
                disabled={!canConfirm}
                onPress={save}
              />
            </View>
          </View>
        ) : null}

        {status === "done" && savedSchedule ? (
          <View style={styles.agentPanel}>
            <AgentBubble>등록했어요.</AgentBubble>
            <ScheduleSummaryCard
              schedule={{
                title: savedSchedule.title,
                start_at: savedSchedule.start_at,
                end_at: savedSchedule.end_at,
                location: savedSchedule.location,
                reminder_minutes: savedSchedule.reminder_minutes,
              }}
            />
            {notificationResult ? (
              <Text style={styles.doneText}>{notificationMessage(notificationResult)}</Text>
            ) : null}
            <PrimaryButton
              title="캘린더에서 보기"
              icon={CalendarDays}
              onPress={goCalendar}
            />
            <PrimaryButton
              title="일정 하나 더 만들기"
              variant="secondary"
              icon={RotateCcw}
              onPress={() => {
                runId.current = newRunId();
                setOriginalText("");
                setInputText("");
                setCandidate(emptyCandidate);
                setSavedSchedule(null);
                setNotificationResult(null);
                transition("idle", "create_another");
              }}
            />
          </View>
        ) : null}

        {status === "failed" ? (
          <View style={styles.agentPanel}>
            {error ? <ErrorNotice message={error} /> : null}
            <PrimaryButton
              title="다시 시도"
              icon={RotateCcw}
              onPress={() => void analyze(inputText || originalText)}
            />
            <PrimaryButton
              title="홈으로"
              variant="secondary"
              icon={Home}
              onPress={() => navigation.navigate("MainTabs")}
            />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function EditCandidateForm({
  candidate,
  onChange,
}: {
  candidate: ScheduleCandidate;
  onChange: (candidate: ScheduleCandidate) => void;
}) {
  const setField = (field: keyof ScheduleCandidate, value: string) => {
    onChange({
      ...candidate,
      [field]:
        field === "reminder_minutes"
          ? Number.parseInt(value, 10) || 0
          : value || null,
    });
  };

  return (
    <View style={styles.editForm}>
      <Field
        label="제목"
        value={candidate.title ?? ""}
        onChangeText={(value) => setField("title", value)}
      />
      <Field
        label="시작 일시"
        value={candidate.start_at ?? ""}
        onChangeText={(value) => setField("start_at", value)}
      />
      <Field
        label="장소"
        value={candidate.location ?? ""}
        onChangeText={(value) => setField("location", value)}
      />
      <Field
        label="알림 분"
        keyboardType="number-pad"
        value={String(candidate.reminder_minutes ?? 30)}
        onChangeText={(value) => setField("reminder_minutes", value)}
      />
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "number-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={styles.fieldInput}
      />
    </View>
  );
}

function normalizeCandidate(candidate: ScheduleCandidate): ScheduleCandidate {
  return {
    title: candidate.title,
    start_at: candidate.start_at,
    end_at: candidate.end_at,
    location: candidate.location,
    reminder_minutes:
      typeof candidate.reminder_minutes === "number"
        ? Math.max(0, candidate.reminder_minutes)
        : null,
  };
}

function newRunId() {
  return `schedule-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const styles = StyleSheet.create({
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
