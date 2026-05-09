import { TextInput, View } from "react-native";

import { AgentBubble } from "../../../components/AgentBubble";
import { Chip } from "../../../components/Chip";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { colors } from "../../../constants/theme";
import type { ScheduleCandidate } from "../../../types/schedule";
import { getFollowUpQuestion } from "../../../utils/scheduleGuards";
import { quickReplies } from "../model/scheduleFlowModel";
import { styles } from "./scheduleFlow.style";

type Props = {
  answer: string;
  candidate: ScheduleCandidate;
  setAnswer: (value: string) => void;
  submitAnswer: (value?: string) => void;
};

export function NeedsInputPanel({
  answer,
  candidate,
  setAnswer,
  submitAnswer,
}: Props) {
  return (
    <View style={styles.agentPanel}>
      <AgentBubble>{getFollowUpQuestion(candidate)}</AgentBubble>
      <View style={styles.quickReplies}>
        {quickReplies.map((reply) => (
          <Chip key={reply} label={reply} onPress={() => submitAnswer(reply)} />
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
  );
}
