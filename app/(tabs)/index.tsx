import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const runAutomation = () => {
    const message =
      "Automation triggered.\n\n✔ Lead captured\n✔ Follow-up scheduled\n✔ Task logged\n\n(Backend connected next)";

    if (Platform.OS === "web") {
      window.alert("1STEP MEOai\n\n" + message);
    } else {
      Alert.alert("1STEP MEOai", message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>1STEP MEOai</Text>

      <Text style={styles.subtitle}>
        AI-powered business automation platform
      </Text>

      <Pressable style={styles.button} onPress={runAutomation}>
        <Text style={styles.buttonText}>Run Automation</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
