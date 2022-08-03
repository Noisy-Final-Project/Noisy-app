import React, { Component } from 'react';
import { SafeAreaView, Text, Platform, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import NoisyStyles from '../NoisyStyles';
import MapTemplate from '../screens/MapTemplate';

const Map = React.forwardRef(({onMessage}, ref) => {
  if (Platform.OS === 'web') {
    console.log('Returning web....')

    return <iframe ref={ref} srcDoc={MapTemplate} id='mapFrame'/>;
  }

  return (
    <WebView
        ref={ref}
        onMessage={onMessage}
        style={styles.map}
        originWhitelist={['*']}
        source={{ html:MapTemplate }}
      />
  )})


const styles = StyleSheet.create({
  map: {
    flex:1,
    width: '100%',
    height: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// import { WebView } from 'react-native-webview';
// import { View } from 'react-native';
// import { StyleSheet } from "react-native";
// import NoisyStyles from '../NoisyStyles';


// export default () => (
//       <View style={styles.container}>
//         <WebView
//           source={{uri: 'https://walla.com'}}
//           style={{ flex: 1 }}
//         />
//       </View>
//     );
 
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'space-between',

//   },
//   video: {
//     marginTop: 20,
//     maxHeight: 200,
//     width: 320,
//     flex: 1
//   }
// });

// const MapView = ({
//   name,
//   value,
//   setValue,
//   autoCapitalize = "none",
//   keyboardType = "default",
//   secureTextEntry = false,
// }) => {
//   return (
//     <View style={{ marginHorizontal: 24 }}>
//       <h1>Hellloooooo</h1>
//     </View>
//   );
// };

export default Map;