import React, { useRef, useState, useEffect } from "react";
import { View, Text, SafeAreaView, TextInput, Button, StyleSheet, Platform } from "react-native";
import { SERVER_URL } from '../../ENV.json'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoisyStyles from "../NoisyStyles";
import Map from "../components/Map";
import { getLocation, sendToMap } from "../helpers/MapUtils";
import axios from 'axios';
import { Suggestions } from '../components/Suggestions';

const [location, setLocation] = useState(null);
let [placeholder, setPlaceholder] = useState('Query e.g. Washington');
let [showList, setShowList] = useState(false);
let [suggestionListData, setSuggestionListData] = useState([])

const ChooseBusiness = ({ navigation }) => {
  let webRef = useRef(null);
  let [mapCenter, setMapCenter] = useState('-121.913, 37.361');

  const onPressItem = (item) => { 
    setPlaceholder(item.address);
    setShowList(false);
    const lnglat = [parseFloat(item.lon), parseFloat(item.lat)]
    sendToMap(webRef ,'center', {lnglat})
  }

  const messageHandler = (event) => {
    const message = (Platform.OS == 'web')? event.data : JSON.parse(event.nativeEvent.data)
    if (message.error === 'undefined') {
        alert(message.error)
        return
    }
    switch (message.type) {
        case 'alert':
            alert(message.body)
            break
        case 'getLocation':
            try {
                  getLocation().then((currentLocation) => {
                        const lnglat = [currentLocation.coords.longitude, currentLocation.coords.latitude]
                        sendToMap(webRef ,'center', {lnglat: lnglat})
                })
                
            }
            catch (err) {
                alert(err.message)
            }
            break

        default:
            break
    }
}

  if (Platform.OS === 'web')
  {
      window.addEventListener("message", messageHandler);
  }



  return (
    // <KeyboardAwareScrollView
    //   contentCotainerStyle={{flex: 1,  marginHorizontal: 20, justifyContent: 'center'}}
    // >
      <View style={ {flex: 1,  marginHorizontal: 20, justifyContent: 'center'} }>

        <Text style={ NoisyStyles.title }>
          Choose a Business
        </Text>
        <Suggestions  
          placeholder={placeholder} 
          showList={showList}  
          suggestionListData={suggestionListData}  
          onPressItem={onPressItem}  
          handleSearchTextChange={handleSearchTextChange}> 
        </Suggestions>
        <Map onMessage={messageHandler} ref={webRef} onLoad={centerToCurrentLocation}/>
    
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
        
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: 15}}>
          <Text
            onPress={() => navigation.navigate("MainMenu")}
            style={ NoisyStyles.linkButton }>
            Main Menu
          </Text>
        </View>
      </View>
    //</KeyboardAwareScrollView>
  )
};

const handleSearchTextChange = changedSearchText => { 
  if (!changedSearchText || changedSearchText.length < 5)  
    return; 

  let baseUrl = `https://api.tomtom.com/search/2/search/${changedSearchText}.json?`; 
  let searchUrl = baseUrl + `key=${tomtomKey}`; 

  if (location) {
    searchUrl = searchUrl + `&lon=${location.coords.longitude}`;
    searchUrl = searchUrl + `&lat=${location.coords.latitude}`;
  }  

  axios
    .get(searchUrl)  
    .then(response => {     
      let addresses = response.data.results.map(v => {     
        let parts = v.address.freeformAddress.split(',');  
        return {  
          p1: parts.length > 0 ? parts[0] : null,  
          p2: parts.length > 1 ? parts[1] : null,  
          p3: parts.length > 2 ? parts[2] : null,  
          address: v.address.freeformAddress,  
          lat: v.position.lat,  
          lon: v.position.lon  
        };  
      });  
 
      setSuggestionListData(addresses);  
      setShowList(true);  
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    })   
}

export default ChooseBusiness;