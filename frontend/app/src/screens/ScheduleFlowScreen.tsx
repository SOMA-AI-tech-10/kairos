import { useNavigation, useRoute } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { X } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { AgentBubble } from "../components/AgentBubble";
import { AgentTag } from "../components/AgentTag";
import { IconButton } from "../components/IconButton";
import { useScheduleFlow } from "../features/schedule-flow/model/useScheduleFlow";
import {
  AnalyzingPanel,
  ConfirmPanel,
  DonePanel,
  FailedPanel,
  IdlePanel,
  NeedsInputPanel,
} from "../features/schedule-flow/ui";
import { styles } from "../features/schedule-flow/ui/scheduleFlow.style";
import type { RootStackParamList } from "../navigation/types";
import { toDateKey } from "../utils/dates";

type Props = NativeStackScreenProps<RootStackParamList, "ScheduleFlow">;

export function ScheduleFlowScreen() {
  const route = useRoute<Props["route"]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const flow = useScheduleFlow({ initialText: route.params?.initialText ?? "" });

  const goCalendar = () => {
    if (!flow.savedSchedule) {
      return;
    }
    navigation.navigate("MainTabs", {
      screen: "Calendar",
      params: {
        selectedDate: toDateKey(flow.savedSchedule.start_at),
        freshScheduleId: flow.savedSchedule.id,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.topBar}>
        <IconButton
          icon={X}
          label="닫기"
          onPress={() => navigation.navigate("MainTabs")}
        />
        <AgentTag label="Kairos · ScheduleFlow" />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {flow.originalText ? (
          <AgentBubble from="user">{flow.originalText}</AgentBubble>
        ) : null}

        {flow.status === "idle" ? (
          <IdlePanel
            inputText={flow.inputText}
            setInputText={flow.setInputText}
            submitIdle={flow.submitIdle}
          />
        ) : null}

        {flow.status === "analyzing" ? (
          <AnalyzingPanel candidate={flow.candidate} />
        ) : null}

        {flow.status === "needsInput" ? (
          <NeedsInputPanel
            answer={flow.answer}
            candidate={flow.candidate}
            setAnswer={flow.setAnswer}
            submitAnswer={flow.submitAnswer}
          />
        ) : null}

        {flow.status === "confirming" || flow.status === "saving" ? (
          <ConfirmPanel
            canConfirm={flow.canConfirm}
            candidate={flow.candidate}
            saving={flow.status === "saving"}
            save={flow.save}
            setCandidate={flow.setCandidate}
          />
        ) : null}

        {flow.status === "done" && flow.savedSchedule ? (
          <DonePanel
            goCalendar={goCalendar}
            notificationResult={flow.notificationResult}
            resetForAnother={flow.resetForAnother}
            savedSchedule={flow.savedSchedule}
          />
        ) : null}

        {flow.status === "failed" ? (
          <FailedPanel
            error={flow.error}
            retry={() => void flow.analyze(flow.inputText || flow.originalText)}
            goHome={() => navigation.navigate("MainTabs")}
          />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
