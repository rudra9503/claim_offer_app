import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function MyClaims({ navigation }) {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 14 }}>
      <Text>Logged in: {isLoggedIn ? "YES" : "NO"}</Text>
      <Text>User: {user?.name ?? "none"}</Text>
      {!isLoggedIn && (
        <>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "#2563eb" }}>Go to Login</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "#2563eb" }}>Go to Register</Text>
          </Pressable>
        </>
      )}
      {isLoggedIn && (
        <Pressable onPress={logout}>
          <Text style={{ color: "#dc2626" }}>Logout</Text>
        </Pressable>
      )}
    </View>
  );
}