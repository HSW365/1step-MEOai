import { Alert, Platform, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useState } from "react";

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const runAutomation = async () => {
    if (loading) return;
    setLoading(true);
    console.log("Run Automation triggered");

    const message =
      "Automation triggered.\n\n✔ Lead captured\n✔ Follow-up scheduled\n✔ Task logged\n\n(Backend connected next)";

    try {
      // Simulate network / background work so user sees feedback
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (Platform.OS === "web") {
        window.alert("1STEP MEOai\n\n" + message);
      } else {
        Alert.alert("1STEP MEOai", message);
      }
    } catch (e) {
      console.error("Automation failed", e);
      if (Platform.OS === "web") {
        window.alert("1STEP MEOai\n\nAutomation failed. See console for details.");
      } else {
        Alert.alert("1STEP MEOai", "Automation failed. See logs for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>1STEP MEOai</Text>

      <Text style={styles.subtitle}>
        AI-powered business automation platform
      </Text>

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={runAutomation}
        disabled={loading}
        accessibilityRole="button"
        accessibilityState={{ busy: loading }}
        accessibilityLabel="Run Automation"
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {loading && <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />}
          <Text style={styles.buttonText}>{loading ? "Running…" : "Run Automation"}</Text>
        </View>
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
