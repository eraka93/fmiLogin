import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

client.defaults.xsrfCookieName = 'csrftoken';
client.defaults.xsrfHeaderName = "X-CSRFTOKEN";



client.interceptors.response.use(function (response) {
  console.log(response);
  return response;
}, function (error) {
  if (error.response.status === 403) {
    if (error.response.data.detail === "Authentication credentials were not provided.") {
      AsyncStorage.removeItem("user");
    }
  }
  console.log(error);
  return Promise.reject(error);
});

export default client;