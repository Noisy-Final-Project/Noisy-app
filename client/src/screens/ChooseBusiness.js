import React, { useState } from "react";
import { View, Text } from "react-native";
import UserInput from "../components/UserInput";
import axios from "axios";
import { SERVER_URL } from '../../config.json'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoisyStyles from "../NoisyStyles";
import MapView from "../components/MapView";

const ChooseBusiness = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(SERVER_URL + "/businesses");
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
  const [email, setEmail] = useState('');

  return (
    <KeyboardAwareScrollView
      contentCotainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >

      <View style={ NoisyStyles.container }>
        <Text style={ NoisyStyles.title }>
          Choose a Business
        </Text>

        <UserInput
          name="Search"
          value={search}
          setValue={setSearch}
          autoCompleteType="Search"
        />
      <MapView />


        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: 15}}>
          <Text
            onPress={() => navigation.navigate("CreateNewReview")}
            style={ NoisyStyles.linkButton }>
            Create New Review
          </Text>

          <Text
            onPress={() => navigation.navigate("ViewUserReviews", "locationID")}
            style={ NoisyStyles.linkButton }>
            View User Reviews
          </Text>
        </View>
        

        <Text
          onPress={() => navigation.navigate("MainMenu")}
          style={ NoisyStyles.linkButton }>
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