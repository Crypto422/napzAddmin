import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import {getStorage } from "@firebase/storage";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID

  // apiKey: "AIzaSyCCiywCSJ5x6QR13xv1AqwbLecbc6wh_gQ",
  // authDomain: "react-image-f5823.firebaseapp.com",
  // databaseURL: "https://react-image-f5823-default-rtdb.firebaseio.com",
  // projectId: "react-image-f5823",
  // storageBucket: "react-image-f5823.appspot.com",
  // messagingSenderId: "433928662432",
  // appId: "1:433928662432:web:3f949745e126830192c8c5"

};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);


