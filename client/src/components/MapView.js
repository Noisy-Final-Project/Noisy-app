import React, { Component } from 'react';
import { SafeAreaView, Text } from "react-native";
import { WebView } from 'react-native-webview';
import NoisyStyles from '../NoisyStyles';

class MapView extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={ NoisyStyles.title }>
          Choose a Business
        </Text>
        <WebView 
          source={{ uri: 'https://reactnative.dev/' }} 
          style={{marginTop: 200, marginTop:200}}
        />
        <Text style={ NoisyStyles.title }>
          Choose a Business
        </Text>
      </SafeAreaView>
    );
  }
}

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

export default MapView;