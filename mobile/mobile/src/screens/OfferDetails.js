import { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { getDiscountPercent, formatDate, isExpired } from "../utils/offerHelpers";

export default function OfferDetails({ route, navigation }) {
  const { id } = route.params;
  const { isLoggedIn, logout } = useAuth();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [claiming, setClaiming] = useState(false);
  const [claimCode, setClaimCode] = useState("");
  const [claimError, setClaimError] = useState("");
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

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

  async function handleClaim() {
    // Not logged in: go to Login, which returns here afterwards
    if (!isLoggedIn) {
      navigation.navigate("Login");
      return;
    }

    setClaimError("");
    setClaimCode("");
    setClaiming(true);
    try {
      const data = await apiRequest(`/offers/${id}/claim`, { method: "POST" });
      // Same assumption as the web app: code is in data.claim.claimCode or data.claimCode
      setClaimCode(data.claim?.claimCode || data.claimCode || "");

      // Refresh the offer so the available quantity updates
      try {
        const updated = await apiRequest(`/offers/${id}`);
        setOffer(updated);
      } catch {
        // the claim already succeeded, so ignore a refresh failure
      }
    } catch (err) {
      setClaimError(err.message);
      if (err.status === 409 || /already/i.test(err.message)) {
        setAlreadyClaimed(true);
      }
      if (err.status === 401) {
        // Token missing or expired: clear it so the user can log in again
        await logout();
      }
    } finally {
      setClaiming(false);
    }
  }

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
  const claimedNow = claimCode !== "";
  const canClaim = !expired && !soldOut && !claiming && !claimedNow && !alreadyClaimed;

  let buttonText = "Claim Offer";
  if (expired) buttonText = "Offer Expired";
  else if (claimedNow) buttonText = "Claimed";
  else if (alreadyClaimed) buttonText = "Already Claimed";
  else if (soldOut) buttonText = "Sold Out";
  else if (claiming) buttonText = "Claiming...";
  else if (!isLoggedIn) buttonText = "Login to Claim";

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
        {!expired && soldOut && !claimedNow && (
          <Text style={styles.soldOutBox}>This offer is sold out.</Text>
        )}

        {offer.terms ? (
          <View style={styles.terms}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Text style={styles.termsText}>{offer.terms}</Text>
          </View>
        ) : null}

        {claimError ? <Text style={styles.claimErrorBox}>{claimError}</Text> : null}

        {claimedNow ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Offer claimed successfully!</Text>
            <Text style={styles.successLabel}>Your claim code:</Text>
            <Text style={styles.code}>{claimCode}</Text>
            <Pressable onPress={() => navigation.navigate("Tabs", { screen: "MyClaims" })}>
              <Text style={styles.link}>View my claims →</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          onPress={handleClaim}
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
  claimErrorBox: {
    backgroundColor: "#fef2f2", color: "#b91c1c", padding: 12,
    borderRadius: 6, fontSize: 14, fontWeight: "600",
  },
  successBox: {
    backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", borderWidth: 1,
    borderRadius: 6, padding: 14, gap: 4,
  },
  successTitle: { color: "#166534", fontWeight: "600" },
  successLabel: { color: "#4b5563", fontSize: 13 },
  code: { fontSize: 26, fontWeight: "bold", letterSpacing: 2, color: "#15803d" },
  link: { color: "#2563eb", marginTop: 6 },
  button: { backgroundColor: "#2563eb", borderRadius: 6, paddingVertical: 14, marginTop: 16 },
  buttonDisabled: { backgroundColor: "#d1d5db" },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" },
});