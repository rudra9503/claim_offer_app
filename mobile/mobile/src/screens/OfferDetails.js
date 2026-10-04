import { View, Text } from "react-native";

export default function OfferDetails({ route }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Offer Details (id: {route.params.id})</Text>
    </View>
  );
}