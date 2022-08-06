import React, { useState } from "react";
import { View, Text, ToastAndroid } from "react-native";
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import { SERVER_URL } from '../../ENV.json'
import NoisyLogo from "../components/NoisyLogo";
import NoisyStyles from "../NoisyStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateEmail, validatePassword } from "../helpers/validation"

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [dob, setDOB] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password) {
      alert("All fields are required");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)){
      alert(email + " is not a valid email")
      setLoading(false);
      return
    }

    if (!validatePassword(password)){
      alert("Password should be 8-16 characters long and contain both letters and numbers.")
      setLoading(false);
      return
    }

    // console.log("SIGNUP REQUEST => ", name, email, password);
    try {
      const { data } = await axios.post(SERVER_URL + "/signup", {
        name,
        dob,
        email,
        password,
      });
      setLoading(false);

      if (data.error){
        console.log("SIGN UP FAILED => ", data);
        alert(data.error);
      }
      else{
        console.log("SIGN UP SUCCESS => ", data);
        alert("Sign Up successful");
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
          name="Date of Birth"
          value={dob}
          setValue={setDOB}
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
          style={ NoisyStyles.linkButton }>
          Main Menu
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;