import { useState } from "react";
let decibels = [];
const [recording, setRecording] = React.useState(false);

const onRecordingStatusUpdate = (playbackStatus) => {
  console.log("Current status: " + JSON.stringify(playbackStatus));
  decibels.push(playbackStatus.metering);
};

async function startRecording() {
  try {
    // TODO make sure this line empties the array in the beginning of each recording
    decibels.empty();
    // TODO how to make the array decibels exported to other screens
    console.log(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY));
    console.log("Requesting permissions..");
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    console.log("Starting recording..");
    const timeMillis = 15000;
    const intervals = 200;
    const { recording, status } = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
      onRecordingStatusUpdate,
      intervals
    );
    // milliseconds of recording

    console.log("Init Recording status: " + status);
    setRecording(recording);
    console.log("Recording started");
    // stops recording after
    setTimeout(stopRecording, timeMillis);
    return;
  } catch (err) {
    console.error("Failed to start recording", err);
  }
}

async function stopRecording() {
  // TODO the audio file is not needed, therefore should be deleted.
  console.log("Stopping recording..");
  setRecording(undefined);
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  console.log("Recording stopped and stored at", uri);
}
