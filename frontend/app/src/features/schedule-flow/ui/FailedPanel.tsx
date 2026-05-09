import { Home, RotateCcw } from "lucide-react-native";
import { View } from "react-native";

import { ErrorNotice } from "../../../components/ErrorNotice";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { styles } from "./scheduleFlow.style";

type Props = {
  error: string | null;
  retry: () => void;
  goHome: () => void;
};

export function FailedPanel({ error, retry, goHome }: Props) {
  return (
    <View style={styles.agentPanel}>
      {error ? <ErrorNotice message={error} /> : null}
      <PrimaryButton title="다시 시도" icon={RotateCcw} onPress={retry} />
      <PrimaryButton
        title="홈으로"
        variant="secondary"
        icon={Home}
        onPress={goHome}
      />
    </View>
  );
}
