import React, { useState, useContext } from "react";
import { View, Text } from "react-native";
//import Text from "@kaloraat/react-native-text";
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import NoisyLogo from "../components/NoisyLogo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoisyStyles from "../NoisyStyles";
//import { AuthContext } from "../context/auth";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [resetCode, setResetCode] = useState();
  // context
  //const [state, setState] = useContext(AuthContext);

  const handleSubmit = async () => {
    setLoading(true);
    if (!email) {
      alert("Email is required");
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post("/forgot-password", {
        email,
      });
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        setLoading(false);
        setVisible(true);
        console.log("RESET PASSWORD RES => ", data);
        alert("Enter the password reset code we sent in your email");
      }
    } catch (err) {
      alert("Error sending email. Try again.");
      console.log(err);
    }
  };

  const handlePasswordReset = async () => {
    // console.log("HANDLE PASSWORD RESET -> ", email, password, resetCode);
    try {
      const { data } = await axios.post("/reset-password", {
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
      <View style={{ marginVertical: 100 }}>
        <NoisyLogo style={ NoisyStyles.logo }/>
        <Text style={ NoisyStyles.title }>
          Forgot Password
        </Text>

        <UserInput
          name="Email"
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
              autoComplteType="password"
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
          handleSubmit={visible ? handlePasswordReset : handleSubmit}
          loading={loading}
        />

        <Text
          onPress={() => navigation.navigate("SignIn")}
          style={ NoisyStyles.navigateLink }>
          Sign In
        </Text>

        <Text
          onPress={() => navigation.navigate("MainMenu")}
          style={ NoisyStyles.navigateMainMenu }>
          Main Menu
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPassword;