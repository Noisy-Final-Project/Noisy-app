import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Card } from 'react-native-elements';
import { Rating } from "react-native-ratings";
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoisyStyles from "../NoisyStyles";

const ViewUserReviews = ({ navigation, location }) => {
  const list = [{   
    userName: "Shani",
    userText: "Text",
    userSoundVolume: 3,
    userSoundOpinion: "Opinion",
    labelsAttached: ["Dates", "Fun", "Music"]},
    {   
      userName: "Shani",
      userText: "Text",
      userSoundVolume: 5,
      userSoundOpinion: "Opinion",
      labelsAttached: ["Dates", "Fun", "Music"]}];
  const [reviews, setReviews] = useState(list);

  const getReviews = async () => {
    try {
      const { data } = await axios.get("/locations/"+location+"/reviews/");
      if (data.error) {
        //alert(data.error);
        //setReviews(undefined);
        // const list = [{   
        //   userName: "Shani",
        //   userText: "Text",
        //   userSoundVolume: 3,
        //   userSoundOpinion: "Opinion",
        //   labelsAttached: ["Dates", "Fun", "Music"]}];
        // setReviews(list);
      } else {
        setReviews(data);
        console.log("REVIEWS RES => ", data);
      }
    } catch (err) {
      //alert("Error getting reviews. Try again.");
      console.log(err);
    }
  };

  useEffect(() => {
    getReviews();
  }, [])

  return (
    <KeyboardAwareScrollView
      contentCotainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View style={{ marginVertical: 100 }}>
        <Text style={ NoisyStyles.title }>
          Reviews of {location}
        </Text>

        <View style= {{marginVertical: 50}}>
          {
            reviews.map((review, i) => {
              return (
                <Card key={i}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={ NoisyStyles.cardText}>Noise Level: </Text>
                    <Rating 
                      imageSize={20}
                      readonly
                      startingValue={review.userSoundVolume}/>
                  </View>
                  <Text style={ NoisyStyles.cardText}>Sound Opinion: {review.userSoundOpinion}</Text>
                  <Text style={ NoisyStyles.cardText}>Labels: {review.labelsAttached.join(", ")}</Text>
                  <Text style={ NoisyStyles.cardText}>More Info: {review.userText}</Text>
                  <Text style={ NoisyStyles.cardText}>Reviewer Name: {review.userName}</Text>
                </Card>
              );
            })
          }
        </View>

        <Text
          onPress={() => navigation.navigate("CreateNewReview")}
          style={ NoisyStyles.linkLargeButton }>
           Create New Review
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

export default ViewUserReviews;