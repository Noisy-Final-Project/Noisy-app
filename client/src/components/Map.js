import React from 'react';
import { View, Platform } from "react-native";
import { WebView } from 'react-native-webview';
import MapTemplate from '../screens/MapTemplate';
import { IconButton } from 'react-native-paper'

const Map = React.forwardRef(({ onMessage, myLocation }, ref) => {
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 4, flexDirection: 'row', justifyContent: 'center', marginHorizontal: 100, paddingHorizontal: '15%' }}>
        <iframe
          ref={ref}
          srcDoc={MapTemplate}
          id='mapFrame'
          scrolling='no'
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            border: 0
          }} 
        />
      </View>

    )
  }

  return (
    <View style={{ flex: 8, justifyContent: 'center'}}>
      <WebView
        ref={ref}
        javaScriptEnabled={true}
        injectedJavaScriptBeforeContentLoaded={`(function() {
          window.ANDROID = true
          window.myLocation = ${myLocation}
      })();`}
        onMessage={onMessage}
        style={{
          flex: 1,
          width: '100%',
          height: '85%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          marginTop: 10,
          opacity: 0.99,
          overflow: "hidden"
        }}
        originWhitelist={['*']}
        source={{ html: MapTemplate }}
      />
      <View style={{ position: "absolute", right: '85%', bottom: "87%" }}>
        <IconButton
          icon="crosshairs-gps"
          size={32}
          onPress={() => {
            const message = {
              nativeEvent: {
                data: '{"type": "getLocation"}'
              }
            }
            onMessage(message)
          }}
        />
      </View>
    </View>
  )
})


export default Map;