import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDate, isExpired } from "../utils/offerHelpers";

const STATUS_COLORS = {
  Claimed: { bg: "#dbeafe", text: "#1d4ed8" },
  Redeemed: { bg: "#dcfce7", text: "#15803d" },
  Expired: { bg: "#fee2e2", text: "#b91c1c" },
};

// A claim that is still "Claimed" but whose offer has expired shows as Expired
function getStatus(claim) {
  if (claim.status === "Claimed" && claim.offer && isExpired(claim.offer.expiryDate)) {
    return "Expired";
  }
  return claim.status;
}

export default function MyClaims({ navigation }) {
  const { isLoggedIn, logout } = useAuth();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadClaims() {
    setError("");
    try {
      const data = await apiRequest("/my-claims");
      setClaims(data);
    } catch (err) {
      setError(err.message);
      if (err.status === 401) {
        await logout(); // token missing or expired
      }
    }
  }

  // Runs every time this tab comes into view (and when login state changes)
  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        setClaims([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      loadClaims().finally(() => setLoading(false));
    }, [isLoggedIn])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await loadClaims();
    setRefreshing(false);
  }

  // 1. Logged out
  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Log in to see your claimed offers.</Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Create an account</Text>
        </Pressable>
      </View>
    );
  }

  // 2. First load
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 3. Logged in: list
  return (
    <FlatList
      data={claims}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListHeaderComponent={
        <View>
          <Pressable style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      }
      ListEmptyComponent={
        !error ? <Text style={styles.message}>You haven't claimed any offers yet.</Text> : null
      }
      renderItem={({ item }) => {
        const status = getStatus(item);
        const colors = STATUS_COLORS[status] || { bg: "#f3f4f6", text: "#374151" };
        return (
          <View style={styles.card}>
            <Text style={styles.title}>{item.offer?.title}</Text>
            <Text style={styles.muted}>{item.offer?.merchant?.storeName}</Text>
            <Text style={styles.muted}>
              Claimed on {formatDate(item.claimDate || item.createdAt)}
            </Text>

            <View style={styles.row}>
              <Text style={styles.code}>{item.claimCode}</Text>
              <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                <Text style={[styles.badgeText, { color: colors.text }]}>{status}</Text>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 14 },
  message: { color: "#6b7280", textAlign: "center", fontSize: 15 },
  link: { color: "#2563eb" },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 6, paddingVertical: 12, paddingHorizontal: 40 },
  primaryButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  list: { padding: 16, flexGrow: 1 },
  logoutButton: {
    alignSelf: "flex-end", borderWidth: 1, borderColor: "#d1d5db",
    borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14, marginBottom: 12,
  },
  logoutText: { color: "#dc2626", fontWeight: "500" },
  errorText: { color: "#dc2626", marginBottom: 12 },
  card: {
    backgroundColor: "#fff", borderRadius: 8, borderWidth: 1,
    borderColor: "#e5e7eb", padding: 14, marginBottom: 12, gap: 3,
  },
  title: { fontSize: 17, fontWeight: "600" },
  muted: { fontSize: 14, color: "#6b7280" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  code: {
    backgroundColor: "#f3f4f6", borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10,
    fontSize: 15, fontWeight: "bold", letterSpacing: 1,
  },
  badge: { borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10 },
  badgeText: { fontSize: 12, fontWeight: "600" },
});