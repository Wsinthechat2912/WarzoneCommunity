import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyBRclt9ztV8nuDTJQCWJ6d-w4vG5D8bj4A",
  authDomain: "warzonecommunity-rp2912.firebaseapp.com",
  databaseURL:
    "https://warzonecommunity-rp2912-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "warzonecommunity-rp2912",
  storageBucket: "warzonecommunity-rp2912.appspot.com",
  messagingSenderId: "359789594309",
  appId: "1:359789594309:web:94942c385f41082ee312ac",
  measurementId: "G-4PDTSJ3NWH",
};

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfLlZApAAAAACPxg_L5bG7gmUoHxMLVRuO80ad8"),
  isTokenAutoRefreshEnabled: true,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const database = getDatabase(app);

export { auth, database, app, createUserWithEmailAndPassword };
