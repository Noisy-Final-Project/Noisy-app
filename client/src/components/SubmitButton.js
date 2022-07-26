import React from "react";
import { TouchableOpacity, Text } from "react-native";
import NoisyStyles from "../NoisyStyles";
//import Text from "@kaloraat/react-native-text";

const SubmitButton = ({ title, handleSubmit, loading }) => (
  <TouchableOpacity
    onPress={handleSubmit}
    style={{
      backgroundColor: "powderblue",
      height: 50,
      margin: 20,
      justifyContent: "center",
      marginHorizontal: 15,
      borderRadius: 24,
    }}
  >
    <Text style={ NoisyStyles.isChecked }>
      {loading ? "Please wait..." : title}
    </Text>
  </TouchableOpacity>
);

export default SubmitButton;