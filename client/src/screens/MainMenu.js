import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoisyLogo from "../components/NoisyLogo";
import NoisyStyles from "../NoisyStyles";

const MainMenu = ({ navigation }) => {

  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function fetchAuth() {
      const auth = await AsyncStorage.getItem("@auth");
      if (auth) {
        const user = JSON.parse(auth);
        setUserName(user.doc.name);
      }
    }
    fetchAuth();
  }, []);

  const handleSignIn = async () => {
    //await AsyncStorage.removeItem("@auth");
    alert("Sign Out successful");
    navigation.navigate("SignIn");
  }

  return (
    <KeyboardAwareScrollView
      contentCotainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View style={{ marginVertical: 110 }}>
        <NoisyLogo style={NoisyStyles.logo} />

        <Text
          onPress={() => navigation.navigate("ChooseBusiness")}
          style={NoisyStyles.link}>
          Choose a Business
        </Text>

        <Text style={NoisyStyles.centerText}>
          OR
        </Text>

        <Text
          onPress={handleSignIn}
          style={NoisyStyles.link}>
          {(userName) ? "Sign Out" : "Sign In"}
        </Text>

        <Text style={NoisyStyles.centerText}>
          {userName ? "Hello " + userName : ""}
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default MainMenu;