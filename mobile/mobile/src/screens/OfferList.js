import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../api";
import OfferCard from "../components/OfferCard";

export default function OfferList({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true); // true only until the first load finishes
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadOffers() {
    setError("");
    try {
      const data = await apiRequest("/offers");
      setOffers(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // Runs every time this tab comes into view, so quantities stay up to date
  useFocusEffect(
    useCallback(() => {
      loadOffers().finally(() => setLoading(false));
    }, [])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await loadOffers();
    setRefreshing(false);
  }

  async function handleRetry() {
    setLoading(true);
    await loadOffers();
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Failed and nothing to show: error with a Retry button
  if (error && offers.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={offers}
      keyExtractor={(item) => item._id}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      renderItem={({ item }) => (
        <OfferCard
          offer={item}
          onPress={() => navigation.navigate("OfferDetails", { id: item._id })}
        />
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.muted}>No offers available.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 14 },
  list: { padding: 16, },
  muted: { color: "#6b7280", textAlign: "center" },
  error: { color: "#dc2626", textAlign: "center" },
  retryButton: { backgroundColor: "#2563eb", borderRadius: 6, paddingVertical: 10, paddingHorizontal: 32 },
  retryText: { color: "#fff", fontWeight: "600" },
});