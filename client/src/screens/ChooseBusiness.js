import React, { useRef, useState } from "react";
import { View, Text, Platform } from "react-native";
import { MAPS_API_KEY } from "../../ENV.json";
import NoisyStyles from "../NoisyStyles";
import Map from "../components/Map";
import { getLocation, sendToMap } from "../helpers/MapUtils";
import axios from "axios";
import { Suggestions } from "../components/Suggestions";

const ChooseBusiness = ({ navigation }) => {
  // Search bar variables:
  let [placeholder, setPlaceholder] = useState("Search by Name or Address");
  let [showList, setShowList] = useState(false);
  let [suggestionListData, setSuggestionListData] = useState([]);
  const [location, setLocation] = useState(null);

  // Map referese:
  let webRef = useRef(null);

  /*
    ####### HANDLERS: #######
  */
  const onPressItem = (item) => {
    setPlaceholder(item.address);
    setShowList(false);
    const lnglat = [parseFloat(item.lon), parseFloat(item.lat)];
    sendToMap(webRef, "center", { lnglat });
  };

  const handleSearchTextChange = (changedSearchText) => {
    if (!changedSearchText || changedSearchText.length < 5) {
      setShowList(false);
      return;
    }

    let baseUrl = `https://api.tomtom.com/search/2/search/${changedSearchText}.json?`;
    let searchUrl = baseUrl + `key=${MAPS_API_KEY}`;

    if (location) {
      searchUrl = searchUrl + `&lon=${location[0]}`;
      searchUrl = searchUrl + `&lat=${location[1]}`;
    }

    axios
      .get(searchUrl)
      .then((response) => {
        console.log(response);
        let addresses = response.data.results.map((v) => {
          let parts = v.address.freeformAddress.split(",");
          return {
            name: v.poi ? v.poi.name : null,
            p1: parts.length > 0 ? parts[0] : null,
            p2: parts.length > 1 ? parts[1] : null,
            p3: parts.length > 2 ? parts[2] : null,
            address: v.address.freeformAddress,
            lat: v.position.lat,
            lon: v.position.lon,
          };
        });

        setSuggestionListData(addresses);
        setShowList(true);
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.error(error.response.data);
          console.error(error.response.status);
          console.error(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error", error.message);
        }
      });
  };

  function messageHandler(event) {
    const message =
      Platform.OS == "web" ? event.data : JSON.parse(event.nativeEvent.data);

    if (message.error) {
      alert(message.error);
      return;
    }
    switch (message.type) {
      case "getLocation":
        try {
          getLocation().then((currentLocation) => {
            setLocation(currentLocation);
            sendToMap(webRef, "center", { lnglat: currentLocation });
          });
        } catch (err) {
          console.error(err);
        }
        break;
      case "getReviews":
        navigation.navigate("ViewUserReviews", { locationID: message.body.id });
        break;
      case "addReview":
        // params are: [id, name, address, lnglat]
        const params = Object.values(message.body);

        // Reset ID for the server to create a new ID in DB
        params[0] = "";
        navigation.navigate("AddReview", ...params);
        break;
      default:
        break;
    }
  }

  // Web iframe needs a listener:
  if (Platform.OS === "web") {
    window.addEventListener("message", messageHandler, { once: true });
  }

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 10,
        marginTop: 20,
        justifyContent: "center",
      }}
    >
      <Text style={NoisyStyles.title}>Choose a Business</Text>

      <Suggestions
        placeholder={placeholder}
        showList={showList}
        suggestionListData={suggestionListData}
        onPressItem={onPressItem}
        handleSearchTextChange={handleSearchTextChange}
      ></Suggestions>

      <Map onMessage={messageHandler} ref={webRef} />

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          marginHorizontal: 15,
        }}
      >
        <Text
          onPress={() =>
            navigation.navigate("AddReview", {
              locationID: 4,
              locationName: "BBB",
              uid: "userID",
            })
          }
          style={NoisyStyles.linkButton}
        >
          Add Review
        </Text>
        <Text
          onPress={() =>
            navigation.navigate("ViewUserReviews", {
              locationID: 4,
            })
          }
          style={NoisyStyles.linkButton}
        >
          View Reviews
        </Text>
        <Text
          onPress={() => navigation.navigate("MainMenu")}
          style={NoisyStyles.linkButton}
        >
          Main Menu
        </Text>
      </View>
    </View>
  );
};

export default ChooseBusiness;
