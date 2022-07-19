import React, { useState } from "react";
import { View, Text } from "react-native";
//import Text from "@kaloraat/react-native-text";
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import NoisyLogo from "../components/NoisyLogo";
import NoisyStyles from "../NoisyStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignUp = ({ navigation }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password) {
      alert("All fields are required");
      setLoading(false);
      return;
    }
    // console.log("SIGNUP REQUEST => ", name, email, password);
    try {
      const { data } = await axios.post("http://localhost:8000/api/signup", {
        name,
        email,
        password,
      });
      setLoading(false);
      console.log("SIGN IN SUCCESS => ", data);
      alert("Sign Up successful");
    } catch (err) {
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
      <View style={{ marginVertical: 110 }}>
        <NoisyLogo style={ NoisyStyles.logo }/>
        <Text style={ NoisyStyles.title }>
          Sign Up
        </Text>

        <UserInput
          name="Name"
          value={name}
          setValue={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />
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
          autoComplteType="password"
        />

        <SubmitButton
          title="Sign Up"
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <Text style={ NoisyStyles.isChecked }> 
          Already Joined?{" "}
            <Text onPress={() => navigation.navigate("SignIn")}
             style={ NoisyStyles.navigateLink }>
                Sign In
            </Text>
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

export default SignUp;