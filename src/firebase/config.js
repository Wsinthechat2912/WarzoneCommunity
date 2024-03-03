import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCMsP3JwQ15fNdV8QcSHgXsYEM8_Lr5e40",
  authDomain: "warzonecommunity-a4824.firebaseapp.com",
  databaseURL:
    "https://warzonecommunity-a4824-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "warzonecommunity-a4824",
  storageBucket: "warzonecommunity-a4824.appspot.com",
  messagingSenderId: "691816939627",
  appId: "1:691816939627:web:0c6dc79df33c5e35b1712e",
  measurementId: "G-DDFCS6Y703",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const database = getDatabase(app);

export { auth, database };
