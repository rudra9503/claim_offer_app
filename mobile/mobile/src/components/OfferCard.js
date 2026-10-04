import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { getDiscountPercent, formatDate, isExpired } from "../utils/offerHelpers";

export default function OfferCard({ offer, onPress }) {
  const expired = isExpired(offer.expiryDate);
  const soldOut = offer.availableQuantity !== undefined && offer.availableQuantity <= 0;

  return (
    <View style={styles.card}>
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

        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>₹{offer.originalPrice}</Text>
          <Text style={styles.price}>₹{offer.offerPrice}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {getDiscountPercent(offer.originalPrice, offer.offerPrice)}% OFF
            </Text>
          </View>
        </View>

        <Text style={expired ? styles.expiredText : styles.muted}>
          {expired ? "Expired" : `Valid till ${formatDate(offer.expiryDate)}`}
        </Text>
        {!expired && soldOut && <Text style={styles.soldOutText}>Sold out</Text>}

        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{expired ? "View (Expired)" : "View Offer"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: 16,
  },
  image: { width: "100%", height: 160 },
  fadedImage: { opacity: 0.4 },
  body: { padding: 14, gap: 4 },
  title: { fontSize: 18, fontWeight: "600" },
  muted: { fontSize: 14, color: "#6b7280" },
  product: { fontSize: 14 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  oldPrice: { color: "#9ca3af", textDecorationLine: "line-through" },
  price: { fontSize: 18, fontWeight: "bold" },
  badge: { backgroundColor: "#dcfce7", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: "#15803d", fontSize: 12, fontWeight: "600" },
  expiredText: { fontSize: 14, color: "#dc2626", fontWeight: "600" },
  soldOutText: { fontSize: 14, color: "#a16207", fontWeight: "600" },
  button: { backgroundColor: "#2563eb", borderRadius: 6, paddingVertical: 10, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});