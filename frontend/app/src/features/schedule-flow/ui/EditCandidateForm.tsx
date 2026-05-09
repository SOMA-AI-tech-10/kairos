import { Text, TextInput, View } from "react-native";

import type { ScheduleCandidate } from "../../../types/schedule";
import { styles } from "./scheduleFlow.style";

type Props = {
  candidate: ScheduleCandidate;
  onChange: (candidate: ScheduleCandidate) => void;
};

export function EditCandidateForm({ candidate, onChange }: Props) {
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

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "number-pad";
};

function Field({ label, value, onChangeText, keyboardType }: FieldProps) {
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
