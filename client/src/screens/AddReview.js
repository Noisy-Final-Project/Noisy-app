import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Rating } from "react-native-ratings";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropDownPicker from "react-native-dropdown-picker";
import { Card } from "react-native-elements";
import axios from "axios";
import { SERVER_URL } from "../../ENV.json";
import NoisyStyles from "../NoisyStyles";
import SubmitButton from "../components/SubmitButton";
import UserInput from "../components/UserInput";

const AddReview = ({ navigation, route }) => {
  const { locationID, locationName, uid } = route.params;

  const [loading, setLoading] = useState(false);
  const [loadingNoiseTest, setLoadingNoiseTest] = useState(false);
  const [soundLevel, setSoundLevel] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
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

  const submitReview = async () => {
    setLoading(true);
    if (!soundLevel || !textReview) {
      alert("Mandatory fields are required");
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(SERVER_URL + "locations/add-review", {
        locationID,
        uid,
        soundLevel,
        reviewerName,
        ageGroup,
        labels,
        soundOpinion,
        textReview,
      });
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        setLoading(false);
        console.log("ADD REVIEW RES => ", data);
      }
    } catch (err) {
      alert("Error adding review. Try again.");
      console.log(err);
    }
  };

  // TODO: Add Sound meter test
  const handleNoiseTest = async () => {
    setLoadingNoiseTest(true);
  };

  return (
    <KeyboardAwareScrollView
      contentCotainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Card>
        <Text style={NoisyStyles.title}>Review {locationName}</Text>

        <View style={{ marginVertical: 50 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={NoisyStyles.cardText}>*Sound Level: </Text>
            <Rating
              imageSize={30}
              readonly
              startingValue={soundLevel}
              type="bell"
            />
            <SubmitButton
              title="        Test        "
              handleSubmit={handleNoiseTest}
              loading={loadingNoiseTest}
            />
          </View>
          <UserInput
            name="Reviewer Name:"
            value={reviewerName}
            setValue={setReviewerName}
            autoCompleteType="name"
          />
          <UserInput
            name="Sound Opinion:"
            value={soundOpinion}
            setValue={setSoundOpinion}
          />
          <Text style={NoisyStyles.cardText}>Labels:</Text>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 15,
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
            name="*Summary:"
            value={textReview}
            setValue={setTextReview}
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
    </KeyboardAwareScrollView>
  );
};

export default AddReview;
