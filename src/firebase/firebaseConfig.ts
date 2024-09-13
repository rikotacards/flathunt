// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoHaAGhyvtMjzNfGU0nqLRiZvzXnCkKJo",
  authDomain: "flat-hunt-a732f.firebaseapp.com",
  projectId: "flat-hunt-a732f",
  storageBucket: "flat-hunt-a732f.appspot.com",
  messagingSenderId: "273398034639",
  appId: "1:273398034639:web:d5a8b99bdf507a5405c7ba",
  measurementId: "G-Z7BEY3P7LJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const USER_ID = 'max'

