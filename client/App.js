import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Welcome from "./src/screens/Welcome";
import MainMenu from "./src/screens/MainMenu";
import SignIn from "./src/screens/SignIn";
import SignUp from "./src/screens/SignUp";
import ForgotPassword from "./src/screens/ForgotPassword";
import ChooseBusiness from "./src/screens/ChooseBusiness";
import ViewUserReviews from "./src/screens/ViewUserReviews";
import AddReview from "./src/screens/AddReview";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View>
        <StatusBar backgroundColor="white" />
      </View>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ChooseBusiness" component={ChooseBusiness} />
        <Stack.Screen name="ViewUserReviews" component={ViewUserReviews} />
        <Stack.Screen name="AddReview" component={AddReview} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
