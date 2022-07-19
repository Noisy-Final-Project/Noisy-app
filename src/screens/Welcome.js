import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import NoisyStyles from "../NoisyStyles";

const Welcome = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("MainMenu");
    }, 3000);
  }, []);
  return (
    <View style={NoisyStyles.container}>
      <Text style={NoisyStyles.header}>Noisy</Text>
      <Image
        source={require("../../assets/logo.png")}
        style={NoisyStyles.logo}
      />
      <Text style={NoisyStyles.footer}>A social network for sharing noise levels</Text>
    </View>
  );
};

export default Welcome;