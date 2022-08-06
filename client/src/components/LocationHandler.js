import * as Location from 'expo-location'

export async function getLocation() {
  Location.requestForegroundPermissionsAsync().then((perm) => {
    if (perm.status !== 'granted') {
        alert('Location permissions required: '+perm.status)
        return;
    }
    location = Location.getCurrentPositionAsync({}).then((result)=>{
        return [result.coords.longitude, result.coords.latitude]
    })
  })
}

