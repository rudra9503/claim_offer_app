import { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { apiRequest } from "../api";
import { getDiscountPercent, formatDate, isExpired } from "../utils/offerHelpers";

export default function OfferDetails({ route }) {
  const { id } = route.params;

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOffer() {
      try {
        const data = await apiRequest(`/offers/${id}`);
        setOffer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOffer();
  }, [id]);

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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const expired = isExpired(offer.expiryDate);
  const soldOut = offer.availableQuantity !== undefined && offer.availableQuantity <= 0;
  const canClaim = !expired && !soldOut;

  let buttonText = "Claim Offer";
  if (expired) buttonText = "Offer Expired";
  else if (soldOut) buttonText = "Sold Out";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: offer.image }}
        style={[styles.image, expired && styles.fadedImage]}
        resizeMode="cover"
      />

      <View style={styles.body}>
        <Text style={styles.title}>{offer.title}</Text>
        <Text style={styles.muted}>
          {offer.merchant?.storeName} · {offer.merchant?.location}
        </Text>

        <Text style={styles.product}>{offer.productName}</Text>
        <Text style={styles.description}>{offer.description}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>₹{offer.originalPrice}</Text>
          <Text style={styles.price}>₹{offer.offerPrice}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {getDiscountPercent(offer.originalPrice, offer.offerPrice)}% OFF
            </Text>
          </View>
        </View>

        <Text style={styles.info}>Starts: {formatDate(offer.startDate)}</Text>
        <Text style={styles.info}>Expires: {formatDate(offer.expiryDate)}</Text>
        {offer.availableQuantity !== undefined && (
          <Text style={styles.info}>Available: {offer.availableQuantity}</Text>
        )}

        {expired && (
          <Text style={styles.expiredBox}>
            This offer has expired and can no longer be claimed.
          </Text>
        )}
        {!expired && soldOut && (
          <Text style={styles.soldOutBox}>This offer is sold out.</Text>
        )}

        {offer.terms ? (
          <View style={styles.terms}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Text style={styles.termsText}>{offer.terms}</Text>
          </View>
        ) : null}

        <Pressable
          disabled={!canClaim}
          style={[styles.button, !canClaim && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { paddingBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  errorText: { color: "#dc2626", textAlign: "center" },
  image: { width: "100%", height: 220 },
  fadedImage: { opacity: 0.4 },
  body: { padding: 16, gap: 8 },
  title: { fontSize: 24, fontWeight: "bold" },
  muted: { fontSize: 14, color: "#6b7280" },
  product: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  description: { fontSize: 14, color: "#374151" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  oldPrice: { fontSize: 16, color: "#9ca3af", textDecorationLine: "line-through" },
  price: { fontSize: 24, fontWeight: "bold" },
  badge: { backgroundColor: "#dcfce7", borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: "#15803d", fontSize: 13, fontWeight: "600" },
  info: { fontSize: 14, color: "#374151" },
  expiredBox: {
    backgroundColor: "#fef2f2", color: "#b91c1c", padding: 12,
    borderRadius: 6, fontWeight: "600", marginTop: 4,
  },
  soldOutBox: {
    backgroundColor: "#fefce8", color: "#854d0e", padding: 12,
    borderRadius: 6, fontWeight: "600", marginTop: 4,
  },
  terms: { marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  termsText: { fontSize: 13, color: "#4b5563" },
  button: { backgroundColor: "#2563eb", borderRadius: 6, paddingVertical: 14, marginTop: 16 },
  buttonDisabled: { backgroundColor: "#d1d5db" },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" },
});