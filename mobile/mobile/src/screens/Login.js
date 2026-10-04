import { useState } from "react";
import {
  View, Text, TextInput, Pressable, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet,
} from "react-native";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  async function handleLogin() {
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      // Same response handling as the web app
      const user = data.user || data.customer || { name: data.name, email: data.email };
      await login(data.token, user);

      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Tabs");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Pressable
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>{submitting ? "Logging in..." : "Login"}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.replace("Register")}>
            <Text style={styles.link}>New here? Create an account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { padding: 16 },
  card: {
    backgroundColor: "#fff", borderRadius: 8, borderWidth: 1,
    borderColor: "#e5e7eb", padding: 20, gap: 6,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  error: {
    backgroundColor: "#fef2f2", color: "#b91c1c", padding: 10,
    borderRadius: 6, fontSize: 14, marginBottom: 6,
  },
  label: { fontSize: 14, fontWeight: "500", marginTop: 6 },
  input: {
    borderWidth: 1, borderColor: "#d1d5db", borderRadius: 6,
    padding: 10, fontSize: 16,
  },
  button: { backgroundColor: "#2563eb", borderRadius: 6, paddingVertical: 12, marginTop: 16 },
  buttonDisabled: { backgroundColor: "#d1d5db" },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" },
  link: { color: "#2563eb", textAlign: "center", marginTop: 14 },
});