import React, { useState, useContext } from "react";
import { View, Text } from "react-native";
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import { SERVER_URL } from "../../ENV.json";
import NoisyLogo from "../components/NoisyLogo";
import NoisyStyles from "../NoisyStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { AuthContext } from "../context/auth";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // context
  //const [state, setState] = useContext(AuthContext);

  const handleSignIn = async () => {
    setLoading(true);
    if (!email || !password) {
      alert("All fields are required");
      setLoading(false);
      return;
    }
    // console.log("SIGNINREQUEST => ", name, email, password);
    try {
      // here needs to call controller function that checks sign in info
      const { data } = await axios.post(SERVER_URL + `signin`, {
        email,
        password,
      });
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        // save in context
        // setState(data);
        // save response in async storage
        await AsyncStorage.setItem("@auth", JSON.stringify(data));
        setLoading(false);
        console.log("SIGN IN SUCCESS => ", data);
        alert("Sign In Successful");
        // redirect
        navigation.navigate("MainMenu");
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
          name="Email"
          value={email}
          setValue={setEmail}
          autoCompleteType="email"
          keyboardType="email-address"
        />
        <UserInput
          name="Password"
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
          onPress={() => navigation.navigate("MainMenu")}
          style={NoisyStyles.linkButton}
        >
          Main Menu
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
