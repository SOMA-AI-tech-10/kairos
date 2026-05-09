import { Text, View } from "react-native";

import { ScheduleSummaryCard } from "../../../components/ScheduleSummaryCard";
import { ThinkingDots } from "../../../components/ThinkingDots";
import type { ScheduleCandidate } from "../../../types/schedule";
import { styles } from "./scheduleFlow.style";

type Props = {
  candidate: ScheduleCandidate;
};

export function AnalyzingPanel({ candidate }: Props) {
  return (
    <View style={styles.agentPanel}>
      <Text style={styles.agentTitle}>Kairos · 입력 분석 중</Text>
      <ThinkingDots />
      <ScheduleSummaryCard schedule={candidate} />
    </View>
  );
}
