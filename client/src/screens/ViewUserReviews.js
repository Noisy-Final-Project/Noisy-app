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
  console.log(locationID);

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
  const [isWeb, setIsweb] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const getReviews = async () => {
    try {
      const { data } = await axios.get(
        SERVER_URL + "locations/reviews/" + locationID,
        { params: { page: 0 } });
      if (data.error) {
        alert(data.error);
      } else {
        setReviewList(data)
        console.log("REVIEWS RES => ", data);
      }
    } catch (err) {
      alert("Error getting reviews. Try again.");
      setReviewList(list);
      console.log(err);
    }
  };

  const previousPage = async () => {
    if (pageNumber == 0){
      return
    }

    const { data } = await axios.get(
      SERVER_URL + "locations/reviews/" + locationID,
      { params: { page: pageNumber - 1 } });
    
    if (data.length > 0){
      setReviewList(data)
      setPageNumber(pageNumber + 1)
    }
  }

  const nextPage = async () => {
    //TODO: ...
  }

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
            startingValue={item.soundLevel}
            type="bell"
          />
        </View>
        <Text style={NoisyStyles.text}>
          Sound Opinion: {item.soundOpinion}
        </Text>
        <Text style={NoisyStyles.text}>
          Labels: {item.labels.join(", ")}
        </Text>
        <Text style={NoisyStyles.text}>
          More Info: {item.userText}
        </Text>
        <Text style={NoisyStyles.text}>
          Reviewer Name: {item.username}
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
          data={reviewList}
          renderItem={renderItem}
        />

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginHorizontal: 15,
          }}
        >
          <Text
            onPress={() => previousPage()}
            style={NoisyStyles.linkButton}>
            PREVIOUS
          </Text>
          
          <Text
            onPress={() => nextPage()}
            style={NoisyStyles.linkButton}>
            NEXT
          </Text>

        </View>

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
