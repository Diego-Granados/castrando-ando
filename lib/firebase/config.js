// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8YT88lEtn6a9CtdXu0h7Udoyk9MQClXE",
  authDomain: "animalitos-db3ff.firebaseapp.com",
  projectId: "animalitos-db3ff",
  storageBucket: "animalitos-db3ff.appspot.com",
  messagingSenderId: "856299857172",
  appId: "1:856299857172:web:e0453ba1c85ff28c618e01",
  measurementId: "G-4L7VXH5BJ8",
};

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
