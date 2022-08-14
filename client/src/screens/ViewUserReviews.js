import React, { useState, useEffect } from "react";
import { View, Text, Platform, FlatList } from "react-native";
import { Card } from "react-native-elements";
import { Rating } from "react-native-ratings";
import axios from "axios";
import { SERVER_URL } from "../../ENV.json";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoisyStyles from "../NoisyStyles";

const ViewUserReviews = ({ navigation, route }) => {
  const { locationID, locationName } = route.params;
  const list = [
    {
      userName: "Shani",
      userText: "Text",
      userSoundVolume: 3,
      userSoundOpinion: "Opinion",
      labelsAttached: ["Dates", "Fun", "Music"],
    },
    {
      userName: "Shani",
      userText: "Text",
      userSoundVolume: 5,
      userSoundOpinion: "Opinion",
      labelsAttached: ["Dates", "Fun", "Music"],
    },
  ];
  const [reviews, setReviews] = useState([]);
  const [isWeb, setIsweb] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const getReviews = async () => {
    try {
      const { data } = await axios.get(
        SERVER_URL + "locations/reviews/" + locationID,
          {params: { page: 0 }});
          
      setReviewList(data)
      console.log(data);
      if (data.error) {
        alert(data.error);
      } else {
        setReviews(data);
        console.log("REVIEWS RES => ", data);
      }
    } catch (err) {
      alert("Error getting reviews. Try again.");
      setReviews(list);
      console.log(err);
    }
  };

  useEffect(() => {
    setIsweb(Platform.OS == "web");
    getReviews();
  }, []);

  const renderItem = ({ item }) => {
    console.log(item); return (
      <Card>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={NoisyStyles.text}>Noise Level: </Text>
          <Rating
            imageSize={30}
            readonly
            startingValue={item.userSoundVolume}
            type="bell"
          />
        </View>
        <Text style={NoisyStyles.text}>
          Sound Opinion: {item.userSoundOpinion}
        </Text>
        <Text style={NoisyStyles.text}>
          Labels: {item.labelsAttached.join(", ")}
        </Text>
        <Text style={NoisyStyles.text}>
          More Info: {item.userText}
        </Text>
        <Text style={NoisyStyles.text}>
          Reviewer Name: {item.userName}
        </Text>
      </Card>
    )
  };

  return (
    <KeyboardAwareScrollView
      contentCotainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View style={{ marginVertical: 100 }}>
        <Text style={NoisyStyles.title}>Reviews of {locationName}</Text>

        <FlatList
          data={list}
          renderItem={renderItem}
        />

        {/* <View style={{ marginVertical: 50 }}>
          {reviews.map((review, i) => {
            return (
              <Card key={i}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={NoisyStyles.text}>Noise Level: </Text>
                  <Rating
                    imageSize={30}
                    readonly
                    startingValue={review.userSoundVolume}
                    type="bell"
                  />
                </View>
                <Text style={NoisyStyles.text}>
                  Sound Opinion: {review.userSoundOpinion}
                </Text>
                <Text style={NoisyStyles.text}>
                  Labels: {review.labelsAttached.join(", ")}
                </Text>
                <Text style={NoisyStyles.text}>
                  More Info: {review.userText}
                </Text>
                <Text style={NoisyStyles.text}>
                  Reviewer Name: {review.userName}
                </Text>
              </Card>
            );
          })}
        </View>

        {!isWeb && (<Text
          onPress={() => navigation.navigate("AddReview", {
            locationID: 4,
            locationName: "BBB",
            uid: "userID",
          })}
          style={NoisyStyles.linkButton}
        >
          Add New Review
        </Text>)} */}

        <Text
          onPress={() => navigation.navigate("MainMenu")}
          style={NoisyStyles.linkButton}>
          Main Menu
        </Text>
      </View>
    </KeyboardAwareScrollView >
  );
};

export default ViewUserReviews;
