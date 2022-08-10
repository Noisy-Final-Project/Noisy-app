import React from "react";
import { View, TextInput, Text } from "react-native";
import NoisyStyles from "../NoisyStyles";

const UserInput = ({
  name,
  value,
  setValue,
  autoCapitalize = "none",
  keyboardType = "default",
  secureTextEntry = false,
  namePosition = "placeholder",
  editable = true,
}) => {
  return (
    <View>
      {namePosition === "text" && (<Text style={NoisyStyles.text}>{name + ": "}</Text>)}
      <TextInput
        autoCorrect={false}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={{
          borderWidth: 2,  // size/width of the border
          borderColor: 'lightgrey',  // color of the border
          paddingLeft: 10,
          height: 48,
          marginVertical: 10,
        }}
        placeholder={namePosition === "placeholder" ? name : ""}
        value={value}
        onChangeText={(text) => setValue(text)}
        editable={editable}
      />
    </View>
  );
};

export default UserInput;