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
  console.log(decibels);
  let sum = 0;
  const min = -120;
  console.log("MIN " + min);
  decibels.forEach((element) => (sum += element));
  console.log("SUM " + sum);
  const average = sum / decibels.length;
  console.log("AVERAGE " + average);

  const amount = Math.abs(average / (min / 5));
  const result = 5 - amount;
  if (result < 0) {
    return 0;
  } else if (result > 5) {
    return 5;
  }
  return result;
}

/**
 * The EV function takes an array of decibels and returns the expected value
 * of the decibel values in that array.
 *
 * How it works:
 * the decibel values are stored in 6 partitions based on their values.
 * We calculate the sum of each partition number multiplied by partition size divided by the total decibels stored.
 * 
 * The result gives a more concrete evalutation of the sound level after the recording.
 * 
 * @return The expected value of the decibels array.
 * 
 */
function EV() {
  // values of decibels in [-160,0]
  const partitions = 6;
  const minimalValue = -120;

  const totalSamples = decibels.length;
  // create an array of "partitions" amount of empty arrays
  let Partition = [];
  for (let i = 0; i < partitions; i += 1) {
    Partition[i] = [];
  }

  // console.log(`Partitions before: ${Partition.toString()}`);
  const m = minimalValue / partitions;
  for (let d of decibels) {
    let i = Math.floor(partitions - d / m);
    if (i >= partitions) {
      i = partitions;
    } else if (i < 0) {
      i = 0;
    }
    Partition[i].push(d);
  }
  let res = 0;
  Partition.forEach((part, ind) => {
    res += ind * (part.length / totalSamples);
  });
  return res;
}

async function getBells() {
  // record and stop
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  await startRecording();

  await delay(timeMillis);

  await stopRecording();

  return EV();
}

export default getBells;
