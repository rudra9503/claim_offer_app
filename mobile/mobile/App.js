import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GOLO Offers</Text>
      <Text>Mobile app is running!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
});