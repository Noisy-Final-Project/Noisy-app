import { Audio } from "expo-av";
let decibels = [];
const timeMillis = 15000;

let currentRecording = undefined;

const onRecordingStatusUpdate = (playbackStatus) => {
  console.log("Current status: " + JSON.stringify(playbackStatus));
  if (playbackStatus.metering) decibels.push(playbackStatus.metering);
};

async function startRecording() {
  try {
    // TODO make sure this line empties the array in the beginning of each recording
    decibels = [];
    console.log("Requesting permissions..");
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    console.log("Starting recording..");
    const intervals = 200;
    const { recording, status } = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
      onRecordingStatusUpdate,
      intervals
    );
    currentRecording = recording;

    console.log("Init Recording status: " + status);
    console.log("Recording started");
  } catch (err) {
    console.error("Failed to start recording", err);
  }
}

async function stopRecording() {
  console.log("Stopping recording..");
  await currentRecording.stopAndUnloadAsync();
  currentRecording = undefined;
}

/**
 * returns a float number between [0,5]
 *
 * */
function analyzeAverage() {
  let sum = 0;
  decibels.forEach((element) => (sum += element));

  const average = sum / decibels.length;
  const amount = Math.abs(average / 32.5);
  return 5 - amount;
}

async function getBells() {
  // record and stop
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  await startRecording();

  await delay(timeMillis);

  await stopRecording();

  return analyzeAverage();
}

export default getBells;
