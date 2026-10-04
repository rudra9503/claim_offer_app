import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import OfferList from "../screens/OfferList";
import OfferDetails from "../screens/OfferDetails";
import MyClaims from "../screens/MyClaims";
import Login from "../screens/Login";
import Register from "../screens/Register";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Offers" component={OfferList} options={{ title: "Nearby Offers" }} />
      <Tab.Screen name="MyClaims" component={MyClaims} options={{ title: "My Claims" }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="OfferDetails" component={OfferDetails} options={{ title: "Offer" }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} options={{ title: "Create Account" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}