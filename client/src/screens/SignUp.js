import React, { useState } from "react";
import { View, Text } from "react-native";
import UserInput from "../components/UserInput";
import DateInput from "../components/DateInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import { SERVER_URL } from "../../ENV.json";
import NoisyLogo from "../components/NoisyLogo";
import NoisyStyles from "../NoisyStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateDate, validateEmail, validatePassword } from "../helpers/validation";

const SignUp = ({ navigation }) => {
  // User details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDOB] = useState('');

  // Page properties
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    if (!name || !email || !password) {
      alert("All fields are required");
      setLoading(false);
      return;
    }

    // Input validations
    if (!validateEmail(email)) {
      alert(email + " is not a valid email");
      setLoading(false);
      return;
    }

    if (!validateDate(dob)) {
      alert(dob + " should be a valid date in this format: DD/MM/YYYY");
      setLoading(false);
      return
    }

    if (!validatePassword(password)) {
      alert(
        "Password should be 8-16 characters long and contain both letters and numbers."
      );
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(SERVER_URL + "signup", {
        name,
        dob,
        email,
        password,
      });
      setLoading(false);

      if (data.error) {
        console.log("SIGN UP FAILED => ", data);
        alert(data.error);
      } else {
        console.log("SIGN UP SUCCESS => ", data);
        alert("Sign Up Successful");
        navigation.navigate("SignIn");
      }
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
      <View style={NoisyStyles.container}>
        <NoisyLogo style={NoisyStyles.logo} />
        <Text style={NoisyStyles.title}>Sign Up</Text>

        <UserInput
          name=" Name"
          value={name}
          setValue={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <DateInput
          name="Date of Birth"
          value={dob}
          setValue={setDOB}
          namePosition={"placeholder"}
        />

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
          title="Sign Up"
          handleSubmit={handleSignUp}
          loading={loading}
        />

        <Text style={NoisyStyles.isChecked}>
          Already Joined?{" "}
          <Text
            onPress={() => navigation.navigate("SignIn")}
            style={NoisyStyles.navigateLink}
          >
            Sign In
          </Text>
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

export default SignUp;
