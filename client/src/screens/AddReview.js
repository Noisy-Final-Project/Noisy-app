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
import getBells from "../helpers/Recorder.js";
import { validateToken } from "../helpers/AuthUtils";
import DateInput from "../components/DateInput";
import { validateDate } from "../helpers/validation";

const AddReview = ({ navigation, route }) => {
  // locationDetails fields: id, name, address, lnglat
  const locationDetails = route.params;

  // Page properties
  const [loading, setLoading] = useState(false);
  const [loadingNoiseTest, setLoadingNoiseTest] = useState(false);

  // Review details
  const [newLocationName, setNewLocationName] = useState('');
  const [soundLevel, setSoundLevel] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [soundOpinion, setSoundOpinion] = useState('');
  const [textReview, setTextReview] = useState('');
  const [uid, setUid] = useState('');

  // Filter by labels:
  const [openLabels, setOpenLabels] = useState(false);
  const [labels, setLabels] = useState([]);
  const [labelItems, setLabelItems] = useState([]);
  useEffect(() => {
    // Initialize labels:
    axios
      .get(SERVER_URL + 'locations/get-labels')
      .then(response => {
        const labelsToItems = response.data.labels.map((item) => {
          return { label: item, value: item }
        })
        setLabelItems(labelsToItems)
      })
  }, [])

  // Runs when component is loading
  useEffect(() => {
    validateToken().then(userDetails => {
      if (userDetails) {
        setUid(userDetails._id);
        setDateOfBirth(userDetails.dob)
        setReviewerName(userDetails.name);
      }
    })
  }, []);

  const submitReview = async () => {
    setLoading(true);
    if (!soundLevel || !textReview || (!locationDetails.name && !newLocationName)) {
      alert("Mandatory fields are required");
      setLoading(false);
      return;
    }

    if (!validateDate(dateOfBirth)) {
      alert(dateOfBirth + " should be a valid date in this format: DD/MM/YYYY");
      setLoading(false);
      return
    }
    try {
      // Check if locationDetails.name & locationDetails.address.freeformAddress exist
      // Update them with name and address if necessary

      if (!locationDetails.name) {
        locationDetails.name = newLocationName
      }

      const userDetails = {
        uid, // Can be empty, not a registered user
        name: reviewerName, // Can be empty, anonymous
        dob: dateOfBirth
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

        if (!locationDetails.id) {
          locationDetails.id = data.locationID
        }

        alert('Review Added Successfully!')
        navigation.push('ViewUserReviews', { locationDetails, formSource: true })
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
        alert("Sound Level: " + res.toFixed(2));
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

          <DateInput
            name="Date of Birth"
            value={dateOfBirth}
            setValue={setDateOfBirth}
            namePosition={"text"}
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
