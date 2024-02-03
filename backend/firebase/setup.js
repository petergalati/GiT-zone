// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRGspZg8-hlhgEKXsJXfsbX4Smw7IcAd0",
  authDomain: "get-in-the-zone-ich24.firebaseapp.com",
  projectId: "get-in-the-zone-ich24",
  storageBucket: "get-in-the-zone-ich24.appspot.com",
  messagingSenderId: "972436340877",
  appId: "1:972436340877:web:47963146038ae0f8ae62c4",
  measurementId: "G-JX0610TP28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);