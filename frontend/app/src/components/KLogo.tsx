import { View, Text, StyleSheet } from "react-native";

import { colors } from "../constants/theme";

export function KLogo() {
  return (
    <View style={styles.logo}>
      <Text style={styles.text}>K</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
  },
  text: {
    color: colors.paper,
    fontSize: 18,
    fontWeight: "800",
  },
});
