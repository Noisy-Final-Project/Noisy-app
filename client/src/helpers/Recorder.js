import { Audio } from "expo-av";
let decibels = [];

let currentRecording = undefined;

const onRecordingStatusUpdate = (playbackStatus) => {
  console.log("Current status: " + JSON.stringify(playbackStatus));
  decibels.push(playbackStatus.metering);
};

async function startRecording() {
  try {
    // TODO make sure this line empties the array in the beginning of each recording
    decibels = [];
    // console.log(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY));
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
    currentRecording = recording;
    // milliseconds of recording

    console.log("Init Recording status: " + status);
    // Audio.setRecording(recording);
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
  // Audio.setRecording(undefined);
  await currentRecording.stopAndUnloadAsync();
  currentRecording = undefined;
  console.log(decibels.toString())
  // const uri = currentRecording.getURI();
  // console.log("Recording stopped and stored at", uri);
}

/**
 * returns a float number between [0,5]
 *
 * */
async function analyzeAverage() {
  let sum = 0;
  decibels.forEach((element) => (sum += element));
  const average = sum / decibels.length;
  const amount = Math.abs(average / 32.5);
  return 5 - amount;
}

async function getBells() {
  // record and stop
  await startRecording();
  // after that the array decibels is filled with data
  const amountBells = analyzeAverage();
  return amountBells;
}

export default getBells ;
