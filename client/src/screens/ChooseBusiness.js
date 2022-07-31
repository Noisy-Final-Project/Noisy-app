import React, { useState } from "react";
import { View, Text } from "react-native";
import { WebView } from 'react-native-webview';
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoisyStyles from "../NoisyStyles";

const ChooseBusiness = ({ navigation }) => {
  const [search, setSearch] = useState();

  const handleSearch = async () => {
    try {
      const { data } = await axios.get("/businesses");
      if (data.error) {
        alert(data.error);
        setSearch(undefined);
      } else {
        setSearch(data);
        console.log("BUSINESSES RES => ", data);
      }
    } catch (err) {
      alert("Error getting businesses. Try again.");
      console.log(err);
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
        <Text style={ NoisyStyles.title }>
          Choose a Business
        </Text>

        <UserInput
          name="Search"
          value={search}
          setValue={setSearch}
          autoCompleteType="Search"
        />

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: 15}}>
          <Text
            onPress={() => navigation.navigate("CreateNewReview")}
            style={ NoisyStyles.linkSmallButton }>
            Create New Review
          </Text>

          <Text
            onPress={() => navigation.navigate("ViewUserReviews")}
            style={ NoisyStyles.linkSmallButton }>
            View User Reviews
          </Text>
        </View>
        

        <Text
          onPress={() => navigation.navigate("MainMenu")}
          style={ NoisyStyles.navigateMainMenu }>
          Main Menu
        </Text>
      </View>

      {/* <WebView
        width="600"
        height="450"
        style="border:10"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/view?key=API_KEY">
      </WebView> */}
    </KeyboardAwareScrollView>
  );
};

export default ChooseBusiness;