import { useState } from "react";
import {
  View, Text, TextInput, Pressable, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet,
} from "react-native";
import { apiRequest } from "../api";

export default function Register({ navigation }) {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // update("email") returns a function that updates only that field
  function update(field) {
    return (text) => setForm({ ...form, [field]: text });
  }

  async function handleRegister() {
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          mobile: form.mobile.trim(),
          password: form.password,
        }),
      });
      navigation.replace("Login");
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
          <Text style={styles.title}>Create Account</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={form.name} onChangeText={update("name")} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={update("email")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={styles.input}
            value={form.mobile}
            onChangeText={update("mobile")}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={update("password")}
            secureTextEntry
            autoCapitalize="none"
          />

          <Pressable
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>{submitting ? "Creating..." : "Register"}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.replace("Login")}>
            <Text style={styles.link}>Already registered? Login</Text>
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