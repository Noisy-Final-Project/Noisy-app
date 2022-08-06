import { Platform } from 'react-native';
import * as Location from 'expo-location'

export async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Location permissions required')
      return;
    }
  
    const currentLocation = await Location.getCurrentPositionAsync({});
  
    return currentLocation
 }

 export function sendToMap(webRef ,type, jsonObject) {
    const message = {
      type,
      body: jsonObject
    }
    if (Platform.OS === 'web')
    {
      webRef.current.contentWindow.postMessage(message)
    }
    else {
      webRef.current.injectJavaScript(`postMessage(${JSON.stringify(message)})`);
    }
    
  }
