import React, { useState } from "react";
import { View, Text } from "react-native";
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import { SERVER_URL } from "../../ENV.json";
import NoisyLogo from "../components/NoisyLogo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoisyStyles from "../NoisyStyles";

const ForgotPassword = ({ navigation }) => {
  // User details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Page properties
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [resetCode, setResetCode] = useState('');

  const handleRequestResetCode = async () => {
    setLoading(true);
    if (!email) {
      alert("Email is required");
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(SERVER_URL + "forgot-password", {
        email,
      });
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        setLoading(false);
        setVisible(true);
        console.log("FORGOT PASSWORD RES => ", data);
        alert("Enter the password reset code we sent in your email");
      }
    } catch (err) {
      alert("Error sending email. Try again.");
      setLoading(false);
      console.log(err);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { data } = await axios.post(SERVER_URL + "reset-password", {
        email,
        password,
        resetCode,
      });
      console.log("RESET PASSWORD => ", data);
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        alert("Now you can login with your new password");
        navigation.navigate("SignIn");
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Password reset failed. Try again.");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentCotainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View style={NoisyStyles.container}>
        <NoisyLogo style={NoisyStyles.logo} />
        <Text style={NoisyStyles.title}>Forgot Password</Text>

        <UserInput
          name=" Email"
          value={email}
          setValue={setEmail}
          autoCompleteType="email"
          keyboardType="email-address"
        />

        {visible && (
          <>
            <UserInput
              name="New Password"
              value={password}
              setValue={setPassword}
              secureTextEntry={true}
              autoCompleteType="password"
            />

            <UserInput
              name="Password Reset Code"
              value={resetCode}
              setValue={setResetCode}
              secureTextEntry={true}
            />
          </>
        )}

        <SubmitButton
          title={visible ? "Reset Password" : "Request Reset Code"}
          handleSubmit={visible ? handlePasswordReset : handleRequestResetCode}
          loading={loading}
        />

        <Text
          onPress={() => navigation.navigate("SignIn")}
          style={NoisyStyles.navigateLink}
        >
          Sign In
        </Text>

        <Text
          onPress={() => navigation.popToTop()}
          style={NoisyStyles.linkButton}
        >
          Main Menu
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPassword;
