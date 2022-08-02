import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import { StyleSheet } from "react-native";
import NoisyStyles from '../NoisyStyles';


export default () => (
      <View style={styles.container}>
        <WebView
          source={{uri: 'https://www.youtube.com/embed/PGUMRVowdv8'}}
          style={{
            marginTop: 150,
            marginBottom: 150,
            marginLeft: 16,
            marginRight: 16,
          }}
        />
        <WebView
          source={{uri: 'https://www.youtube.com/embed/PGUMRVowdv8'}}
        />
      </View>
    );
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  video: {
    marginTop: 20,
    maxHeight: 200,
    width: 320,
    flex: 1
  }
});

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

// export default MapView;