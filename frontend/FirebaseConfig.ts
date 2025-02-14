
import { initializeApp } from "firebase/app";
import { initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBw_2vTXV0OLXi6WB8FXvrij0D_mPp4Zk8",
    authDomain: "money-mate-5239c.firebaseapp.com",
    projectId: "money-mate-5239c",
    storageBucket: "money-mate-5239c.firebasestorage.app",
    messagingSenderId: "862178463544",
    appId: "1:862178463544:web:965ccb03b0905d54a63bcd",
    measurementId: "G-X6W6VPMCLR"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
//export const db = getFirestore(app);
//export const storage = getStorage(app);