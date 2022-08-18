import React, { useState } from "react";
import { View, Text } from "react-native";
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import { SERVER_URL } from "../../ENV.json";
import NoisyLogo from "../components/NoisyLogo";
import NoisyStyles from "../NoisyStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = ({ navigation }) => {
  // User details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Page properties
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    if (!email || !password) {
      alert("All fields are required");
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(SERVER_URL + `signin`, {
        email,
        password,
      });
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        // Save user auth data
        await AsyncStorage.setItem("@auth", JSON.stringify(data));
        setLoading(false);
        console.log("SIGN IN SUCCESS => ", data.doc);
        alert("Sign In Successful");
        // Redirect
        navigation.popToTop();
      }
    } catch (err) {
      alert("Sign In failed. Try again.");
      console.log(err);
      setLoading(false);
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
        <Text style={NoisyStyles.title}>Sign In</Text>

        <UserInput
          name=" Email"
          value={email}
          setValue={setEmail}
          autoCompleteType="email"
          keyboardType="email-address"
        />
        <UserInput
          name=" Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
          autoCompleteType="password"
        />

        <SubmitButton
          title="Sign In"
          handleSubmit={handleSignIn}
          loading={loading}
        />

        <Text style={NoisyStyles.isChecked}>
          Not yet registered?{" "}
          <Text
            onPress={() => navigation.navigate("SignUp")}
            style={NoisyStyles.navigateLink}
          >
            Sign Up
          </Text>
        </Text>

        <Text
          onPress={() => navigation.navigate("ForgotPassword")}
          style={NoisyStyles.navigateLink}
        >
          Forgot Password?
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

export default SignIn;
