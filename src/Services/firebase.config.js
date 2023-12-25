   // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHAt1F4NcVuP13zIbAnexokLxiaFlwh04",
  authDomain: "shaadi-hall-91912.firebaseapp.com",
  projectId: "shaadi-hall-91912",
  storageBucket: "shaadi-hall-91912.appspot.com",
  messagingSenderId: "1015157618784",
  appId: "1:1015157618784:web:95b3af7af6f022f81d2b05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
