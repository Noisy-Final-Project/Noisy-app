import React, { useState, useContext } from "react";
import { View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoisyLogo from "../components/NoisyLogo";
import NoisyStyles from "../NoisyStyles";

const MainMenu = ({ navigation }) => {
  return (
    <KeyboardAwareScrollView
      contentCotainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View style={{ marginVertical: 110 }}>
        <NoisyLogo style={ NoisyStyles.logo }/>

        <Text
          onPress={() => navigation.navigate("ChooseBusiness")}
          style={ NoisyStyles.link }>
          Choose a Business
        </Text>

        <Text style={ NoisyStyles.text }>
          OR
        </Text>

        <Text
          onPress={() => navigation.navigate("SignIn")}
            style= { NoisyStyles.link }>
          Sign In
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default MainMenu;