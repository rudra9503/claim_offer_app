import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function MyClaims() {
  const { isLoggedIn, user, login, logout } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text>Logged in: {isLoggedIn ? "YES" : "NO"}</Text>
      <Text>User: {user?.name ?? "none"}</Text>
      <Pressable onPress={() => login("fake-token", { name: "Test User" })}>
        <Text style={{ color: "#2563eb" }}>Fake login</Text>
      </Pressable>
      <Pressable onPress={logout}>
        <Text style={{ color: "#dc2626" }}>Logout</Text>
      </Pressable>
    </View>
  );
}