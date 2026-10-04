import { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { apiRequest } from "../api";
import OfferCard from "../components/OfferCard";

export default function OfferList({navigation}) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await apiRequest("/offers");
        setOffers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={offers}
      keyExtractor={(item) => item._id}
    //   renderItem={({ item }) => <OfferCard offer={item} />}
    renderItem={({ item }) => (
        <OfferCard offer={item} onPress={() => navigation.navigate("OfferDetails", { id: item._id })}/>
)}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.muted}>No offers available.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  list: { padding: 16 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  muted: { color: "#6b7280" },
  error: { color: "#dc2626", textAlign: "center" },
});