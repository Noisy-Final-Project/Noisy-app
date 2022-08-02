import React, { useState } from "react";
import { View, Text, SafeAreaView, TextInput, Button, StyleSheet } from "react-native";
import UserInput from "../components/UserInput";
import axios from "axios";
import { SERVER_URL } from '../../config.json'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoisyStyles from "../NoisyStyles";
import MapView from "../components/MapView";
import { WebView } from 'react-native-webview';
import MapTemplate from "./MapTemplate";

const ChooseBusiness = ({ navigation }) => {
  // let webRef = undefined;
  // let [mapCenter, setMapCenter] = useState('-121.913, 37.361');
  // const run = `
  //     document.body.style.backgroundColor = 'blue';
  //     true;
  //   `;

  // const onButtonClick = () => {
  //   const [lng, lat] = mapCenter.split(",");
  //   webRef.injectJavaScript(`map.setCenter([${parseFloat(lng)}, ${parseFloat(lat)}])`);
  // }

  // const handleMapEvent = (event) => {
  //   setMapCenter(event.nativeEvent.data)
  // }

  // return (
  //   <View style={styles.container}>
  //     <View style={styles.buttons}>
  //       <TextInput 
  //       style={styles.textInput}
  //       onChangeText={setMapCenter}
  //       value={mapCenter}></TextInput>
  //       <Button title="Set Center" onPress={onButtonClick}></Button>
  //     </View>
  //     <WebView
  //       ref={(r) => (webRef = r)}
  //       onMessage={handleMapEvent}
  //       style={styles.map}
  //       originWhitelist={['*']}
  //       source={{ html: MapTemplate }}
  //     />
  //   </View>
  // );

  const [search, setSearch] = useState('');

  let webRef = undefined;
  let [mapCenter, setMapCenter] = useState('-121.913, 37.361');

  const onButtonClick = () => {
    const [lng, lat] = mapCenter.split(",");
    webRef.injectJavaScript(`map.setCenter([${parseFloat(lng)}, ${parseFloat(lat)}])`);
  }

  const handleMapEvent = (event) => {
    setMapCenter(event.nativeEvent.data)
  }

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

  return (

    <SafeAreaView style={{ flex: 1 }}>
        <Text style={ NoisyStyles.title }>
          Choose a Business
        </Text>
        <View style={styles.buttons}>
        <TextInput 
        style={styles.textInput}
        onChangeText={setMapCenter}
        value={mapCenter}></TextInput>
        <Button title="Set Center" onPress={onButtonClick}></Button>
      </View>
      <WebView
        ref={(r) => (webRef = r)}
        onMessage={handleMapEvent}
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: MapTemplate }}
      />
        {/* <WebView 
          source={{ html: '<h1>Hi Thereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</h1>' }} 
          style={{marginTop: 300, marginTop:200}}
        /> */}

    <View style={ NoisyStyles.container }>
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

      </SafeAreaView>

  );




    // <KeyboardAwareScrollView
    //   contentCotainerStyle={{
    //     flex: 1,
    //     justifyContent: "center",
    //   }}
    // >

    //   <View style={ NoisyStyles.container }>
    //     <Text style={ NoisyStyles.title }>
    //       Choose a Business
    //     </Text>


    //     <UserInput
    //       name="Search"
    //       value={search}
    //       setValue={setSearch}
    //       autoCompleteType="Search"
    //     />
      


    //     <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: 15}}>
    //       <Text
    //         onPress={() => navigation.navigate("CreateNewReview")}
    //         style={ NoisyStyles.linkButton }>
    //         Create New Review
    //       </Text>

    //       <Text
    //         onPress={() => navigation.navigate("ViewUserReviews", "locationID")}
    //         style={ NoisyStyles.linkButton }>
    //         View User Reviews
    //       </Text>
    //     </View>
        

    //     <Text
    //       onPress={() => navigation.navigate("MainMenu")}
    //       style={ NoisyStyles.linkButton }>
    //       Main Menu
    //     </Text>
    //   </View>

    //   {/* <WebView
    //     width="600"
    //     height="450"
    //     style="border:10"
    //     loading="lazy"
    //     allowfullscreen
    //     referrerpolicy="no-referrer-when-downgrade"
    //     src="https://www.google.com/maps/embed/v1/view?key=API_KEY">
    //   </WebView> */}
    // </KeyboardAwareScrollView>
//   );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  buttons: {
    flexDirection: 'row',
    height: '15%',
    backgroundColor: '#fff',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12
  },
  textInput: {
    height: 40,
    width: "60%",
    marginRight: 12,
    paddingLeft: 5,
    borderWidth: 1,
  },
  map: {
    width: '100%',
    height: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChooseBusiness;