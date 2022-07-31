import React from "react";
import { TouchableOpacity, Text } from "react-native";
import NoisyStyles from "../NoisyStyles";

const SubmitButton = ({ title, handleSubmit, loading }) => (
  <TouchableOpacity
    onPress={handleSubmit}
    style={ NoisyStyles.submitButton }>
    <Text style={ NoisyStyles.isChecked }>
      {loading ? "Please wait..." : title}
    </Text>
  </TouchableOpacity>
);

export default SubmitButton;