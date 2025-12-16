import { StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Dashboard</Text>

      <Text style={styles.text}>
        • CRM automation{"\n"}
        • AI follow-ups{"\n"}
        • Task execution{"\n"}
        • Client reporting{"\n"}
      </Text>

      <Text style={styles.note}>
        This module is customizable per business.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    color: "#b0b0b0",
    fontSize: 16,
    lineHeight: 26,
  },
  note: {
    color: "#777",
    marginTop: 30,
    fontSize: 14,
  },
});

