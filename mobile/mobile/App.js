import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { API_URL } from "./src/config";

export default function App() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOffers() {
      try {
        const response = await fetch(`${API_URL}/offers`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setOffers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>GOLO Offers</Text>

      {loading && <ActivityIndicator size="large" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {offers.map((offer) => (
        <Text key={offer._id} style={styles.item}>
          {offer.title} ({offer.merchant?.storeName})
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 64 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  item: { fontSize: 16, marginBottom: 8 },
  error: { color: "red" },
});