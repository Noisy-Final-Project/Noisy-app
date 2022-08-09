import { useState } from "react";
let decibels = []
const [recording, setRecording] = React.useState(false);
  
  const onRecordingStatusUpdate = playbackStatus => {
    console.log('Current status: '+JSON.stringify(playbackStatus))
  };
  
  async function startRecording() {
    try {
      console.log(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY));
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      const { recording, status } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        onRecordingStatusUpdate,
        200
      );
      // milliseconds of recording
      const timeMillis = 15000

      console.log('Init Recording status: '+status)
      decibels.push(status.metering);
      setRecording(recording);
      console.log('Recording started');
      // stops recording after 
    setTimeout(stopRecording, timeMillis );
    return
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    console.log('Recording stopped and stored at', uri);
  }
