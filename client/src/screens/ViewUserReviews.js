import React, { useState, useEffect } from "react";
import { View, Text, Platform, FlatList } from "react-native";
import { Card } from "react-native-elements";
import { Rating } from "react-native-ratings";
import axios from "axios";
import { SERVER_URL } from "../../ENV.json";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoisyStyles from "../NoisyStyles";

const ViewUserReviews = ({ navigation, route }) => {
  const { locationDetails } = route.params;

  // Boolean to check if is in web
  const [isWeb, setIsweb] = useState(false);

  // review list details and page number
  const [reviewList, setReviewList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const getReviews = async () => {
    try {
      const { data } = await axios.get(
        SERVER_URL + "locations/reviews/" + locationDetails.id,
        { params: { page: 0 } });
      if (data.error) {
        alert(data.error);
      } else {
        setReviewList(data)
        console.log("REVIEWS RES => ", data);
      }
    } catch (err) {
      alert("Error getting reviews. Try again.");
      console.log('ERROR: ' + err.message);
    }
  };

  const previousPage = async () => {
    if (pageNumber == 0) {
      return
    }

    const { data } = await axios.get(
      SERVER_URL + "locations/reviews/" + locationDetails.id,
      { params: { page: pageNumber - 1 } });

    if (data.length > 0) {
      setReviewList(data)
      setPageNumber(pageNumber - 1)
    }
  }

  const nextPage = async () => {
    const { data } = await axios.get(
      SERVER_URL + "locations/reviews/" + locationDetails.id,
      { params: { page: pageNumber + 1 } });

    if (data.length > 0) {
      setReviewList(data)
      setPageNumber(pageNumber + 1)
    }
  }

  // Runs when component is loading
  useEffect(() => {
    setIsweb(Platform.OS == "web");
    getReviews();
  }, []);


  const getHeader = () => {
    return (
      <KeyboardAwareScrollView
        contentCotainerStyle={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View style={{ marginTop: 30 }}>
          <Text style={NoisyStyles.title}>Reviews of {locationDetails.name}</Text>
        </View></KeyboardAwareScrollView>
    )
  }

  const getFooter = () => {
    return (
      <KeyboardAwareScrollView
        contentCotainerStyle={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: "5%",
            marginHorizontal: 15,
          }}
        >
          <Text
            onPress={() => previousPage()}
            style={NoisyStyles.linkButton}>
            Prev
          </Text>

          <Text
            style={NoisyStyles.linkButton}>
            {pageNumber + 1}
          </Text>

          <Text
            onPress={() => nextPage()}
            style={NoisyStyles.linkButton}>
            Next
          </Text>
        </View>

        {!isWeb && (<Text
          onPress={() => navigation.push("AddReview", locationDetails)}
          style={NoisyStyles.linkButton}
        >
          Add New Review
        </Text>)}

        <Text
          onPress={() => navigation.popToTop()}
          style={NoisyStyles.linkButton}>
          Main Menu
        </Text>
      </KeyboardAwareScrollView >
    )
  }

  const renderItem = ({ item }) => {
    return (
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

    <FlatList
      data={reviewList}
      renderItem={renderItem}
      ListHeaderComponent={getHeader()}
      ListFooterComponent={getFooter()}
      ListHeaderComponentStyle={{ direction: "ltr" }}
      ListFooterComponentStyle={{ direction: "ltr" }}
    />

  );
};

export default ViewUserReviews;
