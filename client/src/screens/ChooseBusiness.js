import React, { useEffect, useRef, useState } from "react";
import { View, Text, Platform } from "react-native";
import { MAPS_API_KEY, SERVER_URL } from "../../ENV.json";
import NoisyStyles from "../NoisyStyles";
import Map from "../components/Map";
import { getLocation, sendToMap } from "../helpers/MapUtils";
import axios from "axios";
import { Suggestions } from "../components/Suggestions";
import DropDownPicker from "react-native-dropdown-picker";

const ChooseBusiness = ({ navigation }) => {
  // Search bar variables:
  let [placeholder, setPlaceholder] = useState("Search by Name or Address");
  let [showList, setShowList] = useState(false);
  let [suggestionListData, setSuggestionListData] = useState([]);
  const [location, setLocation] = useState(null);

  // Filter by labels:
  const [openLabels, setOpenLabels] = useState(false);
  const [labels, setLabels] = useState([]);
  const [labelItems, setLabelItems] = useState([]);

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

    searchUrl += '&language=he-IL'
    axios
      .get(searchUrl)
      .then((response) => {
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
            sendToMap(webRef, "selfCenter", { lnglat: currentLocation });
          });
        } catch (err) {
          console.error(err);
        }
        break;
      case "getReviews":
        navigation.navigate("ViewUserReviews", message.body);
        break;
      case "addReview":
        // params are: [id, name, address, lnglat]

        navigation.navigate("AddReview", message.body);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    // Web iframe needs a listener:
    if (Platform.OS === "web") {
      window.addEventListener("message", messageHandler, { once: true });
    }
  }, [])

  useEffect(() => {
    axios
      .get(SERVER_URL + 'locations/get-labels')
      .then(response => {
        const labelsToItems = response.data.labels.map((item) => {
          return { label: item, value: item }
        })
        setLabelItems(labelsToItems)
      })
  }, [])

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
        containerStyle={{ paddingHorizontal: "5%", alignItems: 'center', paddingTop: 10 }}

        onChangeValue={(items) => {
          sendToMap(webRef, 'labelFilter', { labels: items })
        }}


        placeholder={"Filter by labels"}
      />

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
