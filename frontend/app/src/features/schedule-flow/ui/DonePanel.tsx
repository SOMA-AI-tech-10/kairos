import { CalendarDays, RotateCcw } from "lucide-react-native";
import { Text, View } from "react-native";

import { AgentBubble } from "../../../components/AgentBubble";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ScheduleSummaryCard } from "../../../components/ScheduleSummaryCard";
import type { Schedule } from "../../../types/schedule";
import {
  notificationMessage,
  type NotificationScheduleResult,
} from "../../../utils/notifications";
import { toCandidate } from "../model/scheduleFlowModel";
import { styles } from "./scheduleFlow.style";

type Props = {
  goCalendar: () => void;
  notificationResult: NotificationScheduleResult | null;
  resetForAnother: () => void;
  savedSchedule: Schedule;
};

export function DonePanel({
  goCalendar,
  notificationResult,
  resetForAnother,
  savedSchedule,
}: Props) {
  return (
    <View style={styles.agentPanel}>
      <AgentBubble>등록했어요.</AgentBubble>
      <ScheduleSummaryCard schedule={toCandidate(savedSchedule)} />
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
        onPress={resetForAnother}
      />
    </View>
  );
}
