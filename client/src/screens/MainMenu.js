import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import NoisyLogo from "../components/NoisyLogo";
import NoisyStyles from "../NoisyStyles";
import { validateToken } from "../helpers/AuthUtils";


const MainMenu = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  const focus = useIsFocused();  // useIsFocused as shown

  useEffect(() => {
    validateToken().then((userDetails) => {
      if (userDetails) {
        setUserName(userDetails.name);
      }
    })
  }, [focus]);

  const handleSignIn = async () => {
    navigation.navigate("SignIn");
  }

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("@auth");
    setUserName("");
    alert("Sign Out Successful");
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
          onPress={() => navigation.push("ChooseBusiness")}
          style={NoisyStyles.link}>
          Choose a Business
        </Text>

        <Text style={NoisyStyles.centerText}>
          OR
        </Text>

        <Text
          onPress={userName ? handleSignOut : handleSignIn}
          style={NoisyStyles.link}>
          {userName ? "Sign Out" : "Sign In"}
        </Text>

        <Text style={NoisyStyles.centerText}>
          {userName ? "Hello " + userName : ""}
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default MainMenu;