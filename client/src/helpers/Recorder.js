import { Audio } from "expo-av";
let decibels = [];
const timeMillis = 15000;

let currentRecording = undefined;

const onRecordingStatusUpdate = (playbackStatus) => {
  console.log("Current status: " + JSON.stringify(playbackStatus));
  if (playbackStatus.metering && playbackStatus.metering != -160)
    decibels.push(playbackStatus.metering);
};

async function startRecording() {
  try {
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
  const min = -120
  console.log('MIN ' + min)
  decibels.forEach((element) => (sum += element));
  console.log('SUM ' + sum)
  const average = sum / decibels.length;
  console.log('AVERAGE ' + average)

  const amount = Math.abs(average / (min / 5));
  const result = 5 - amount
  if (result < 0) {
    return 0
  } else if (result > 5) {
    return 5
  }
  return result;
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
