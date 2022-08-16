import axios from "axios";
import { SERVER_URL } from "../../ENV.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const validateToken = async () => {
  const auth = await AsyncStorage.getItem("@auth");
  if (auth) {
    const parsedAuth = JSON.parse(auth);
    const { data } = await axios.get(SERVER_URL + `validate`,
      {
        headers: {
          authorization: 'Bearer ' + parsedAuth.token
        }
      });
    if (!data.error && parsedAuth.doc._id == data._id) {
      return parsedAuth.doc;
    }
    await AsyncStorage.removeItem("@auth");
  }
}

exports.validateToken = validateToken
