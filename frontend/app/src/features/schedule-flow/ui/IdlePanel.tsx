import { Text, TextInput, View } from "react-native";

import { PrimaryButton } from "../../../components/PrimaryButton";
import { colors } from "../../../constants/theme";
import { styles } from "./scheduleFlow.style";

type Props = {
  inputText: string;
  setInputText: (value: string) => void;
  submitIdle: () => void;
};

export function IdlePanel({ inputText, setInputText, submitIdle }: Props) {
  return (
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
  );
}
