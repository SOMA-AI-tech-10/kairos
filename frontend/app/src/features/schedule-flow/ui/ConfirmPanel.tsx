import { Check } from "lucide-react-native";
import { View } from "react-native";

import { AgentBubble } from "../../../components/AgentBubble";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ScheduleSummaryCard } from "../../../components/ScheduleSummaryCard";
import type { ScheduleCandidate } from "../../../types/schedule";
import { EditCandidateForm } from "./EditCandidateForm";
import { styles } from "./scheduleFlow.style";

type Props = {
  canConfirm: boolean;
  candidate: ScheduleCandidate;
  saving: boolean;
  save: () => void;
  setCandidate: (candidate: ScheduleCandidate) => void;
};

export function ConfirmPanel({
  canConfirm,
  candidate,
  saving,
  save,
  setCandidate,
}: Props) {
  return (
    <View style={styles.agentPanel}>
      <AgentBubble>아래 내용으로 등록할까요?</AgentBubble>
      <ScheduleSummaryCard schedule={candidate} />
      <EditCandidateForm candidate={candidate} onChange={setCandidate} />
      <View style={styles.actions}>
        <PrimaryButton
          title="수정 완료"
          variant="secondary"
          disabled={!canConfirm || saving}
        />
        <PrimaryButton
          title="등록하기"
          icon={Check}
          loading={saving}
          disabled={!canConfirm}
          onPress={save}
        />
      </View>
    </View>
  );
}
