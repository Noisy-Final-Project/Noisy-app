import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Rating } from "react-native-ratings";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropDownPicker from "react-native-dropdown-picker";
import { Card } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SERVER_URL } from "../../ENV.json";
import NoisyStyles from "../NoisyStyles";
import SubmitButton from "../components/SubmitButton";
import UserInput from "../components/UserInput";
import getBells from "../helpers/Recorder.js";

const AddReview = ({ navigation, route }) => {
  const locationDetails = route.params;
  // locationDetails fields: id, name, address, lnglat

  const [uid, setUid] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingNoiseTest, setLoadingNoiseTest] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [soundLevel, setSoundLevel] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [soundOpinion, setSoundOpinion] = useState('');
  const [textReview, setTextReview] = useState('');

  const [openLabels, setOpenLabels] = useState(false);
  const [labels, setLabels] = useState([]);
  const [labelItems, setLabelItems] = useState([
    { label: "Music", value: "music" },
    { label: "Dates", value: "dates" },
    { label: "Fun", value: "fun" },
    { label: "Business Meeting", value: "businessMeeting" },
  ]);

  useEffect(() => {
    async function fetchAuth() {
      const auth = await AsyncStorage.getItem("@auth");
      if (auth) {
        const user = JSON.parse(auth);
        setUid(user.doc._id);
        setReviewerName(user.doc.name);
      }
    }
    fetchAuth();
  }, []);

  const submitReview = async () => {
    setLoading(true);
    if (!soundLevel || !textReview || (!locationDetails.name && !newLocationName)) {
      alert("Mandatory fields are required");
      setLoading(false);
      return;
    }
    try {
      // Check if locationDetails.name & locationDetails.address.freeformAddress exist
      // Update them with name and address if necessary

      const userDetails = {
        uid, // Can be empty, not a registered user
        name: reviewerName, // Can be empty, anonymous
        dateOfBirth
      };

      const reviewDetails = {
        locationID: locationDetails.id,
        userID: uid,
        userText: textReview,
        soundOpinion,
        soundLevel,
        labels,
      };

      const { data } = await axios.post(SERVER_URL + "locations/add-review", {
        locationDetails,
        userDetails,
        reviewDetails
      });
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        setLoading(false);
        console.log("ADD REVIEW RES => ", data);
      }
    } catch (err) {
      setLoading(false);
      alert("Error adding review. Try again.");
      console.log(err);
    }
  };

  const handleNoiseTest = () => {
    setLoadingNoiseTest(true);
    getBells()
      .then((res) => {
        // here res is the amount of bells (float)
        setLoadingNoiseTest(false);
        alert("sound level: " + res);
        setSoundLevel(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <KeyboardAwareScrollView
      contentCotainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Card>
        <View>
          <Text style={NoisyStyles.title}>
            {locationDetails.name ? "Review " + locationDetails.name : "Add New Review"}
          </Text>
          {!locationDetails.name && (
            <UserInput
              name="* Location Name"
              value={newLocationName}
              setValue={setNewLocationName}
              namePosition="text"
            />)}
          < View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 40
            }}
          >
            <Text style={NoisyStyles.text}>* Sound Level: </Text>
            <Rating
              imageSize={30}
              readonly
              startingValue={soundLevel}
              type="bell"
              fraction="2"
            />
          </View>
          <SubmitButton
            title="Test"
            handleSubmit={handleNoiseTest}
            loading={loadingNoiseTest}
          />
          <UserInput
            name="Reviewer Name"
            value={reviewerName}
            setValue={setReviewerName}
            autoCompleteType="name"
            namePosition="text"
            editable={(uid) ? false : true}
          />
          <UserInput
            name="Date of Birth"
            value={dateOfBirth}
            setValue={setDateOfBirth}
            namePosition="text"
          />
          <UserInput
            name="Sound Opinion"
            value={soundOpinion}
            setValue={setSoundOpinion}
            namePosition="text"
          />
          <Text style={NoisyStyles.text}>Labels:</Text>
          <View
            style={{
              paddingVertical: 10
            }}
          >
            <DropDownPicker
              open={openLabels}
              value={labels}
              items={labelItems}
              setOpen={setOpenLabels}
              setValue={setLabels}
              setItems={setLabelItems}
              multiple={true}
              mode="BADGE"
              listMode="SCROLLVIEW"
              badgeDotColors={[
                "#e76f51",
                "#00b4d8",
                "#e9c46a",
                "#e76f51",
                "#8ac926",
                "#00b4d8",
                "#e9c46a",
              ]}
            />
          </View>
          <UserInput
            name="* Summary"
            value={textReview}
            setValue={setTextReview}
            namePosition="text"
          />
        </View>

        <SubmitButton
          title="Upload Review"
          handleSubmit={submitReview}
          loading={loading}
        />

        <Text
          onPress={() => navigation.navigate("MainMenu")}
          style={NoisyStyles.linkButton}
        >
          Main Menu
        </Text>
      </Card>
    </KeyboardAwareScrollView >
  );
};

export default AddReview;
