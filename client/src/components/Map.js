import React, { Component } from 'react';
import { View, Platform, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import MapTemplate from '../screens/MapTemplate';
import { useEffect } from 'react';
import * as Location from 'expo-location';
import { PermissionsAndroid } from 'react-native';

const Map = React.forwardRef(({onMessage, initLocation}, ref) => {
  if (Platform.OS === 'web') {
    console.log('Returning web....')
    return (
      <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'center', marginHorizontal: 100, paddingHorizontal:'15%'}}>
          <iframe
            ref={ref}
            srcDoc={MapTemplate}
            id='mapFrame'
            scrolling='no'
            style={{
              position:'relative',
              width:'100%',
              height:'100%',
              border:0
          }}/>
        </View>
      
    )
  }

  return (
    <View style={{ flex: 2, justifyContent: 'center'}}>
      <WebView
        javaScriptEnabled={true}
        injectedJavaScriptBeforeContentLoaded={`(function() {
          window.ANDROID = true
      })();`}
        ref={ref}
        onMessage={onMessage}
        style={{
          flex:1,
          width: '100%',
          height: '85%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        originWhitelist={['*']}
        source={{ html:MapTemplate }}
      />
    </View>
  )})


export default Map;