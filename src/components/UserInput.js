import React from "react";
import { View, TextInput } from "react-native";

const UserInput = ({
  name,
  value,
  setValue,
  autoCapitalize = "none",
  keyboardType = "default",
  secureTextEntry = false,
}) => {
  return (
    <View style={{ marginHorizontal: 24 }}>
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
          placeholder={name}
        value={value}
        onChangeText={(text) => setValue(text)}
      />
    </View>
  );
};

export default UserInput;