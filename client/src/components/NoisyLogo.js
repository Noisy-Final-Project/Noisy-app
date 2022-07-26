import React from "react";
import { View, Image } from "react-native";

const NoisyLogo = () => (
  <View
    style={{
      justifyContent: "center",
      alignItems: "center",
    }}>
      
    <Image
      source={require("../../assets/logo.png")}
      style={{ width: "70%", height: 200, marginVertical: 20, resizeMode: "contain",
    }}
    />
  </View>
);

export default NoisyLogo;