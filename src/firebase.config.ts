// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDnMopEByfF5zukpMJEfd7UtRN3bAoCYko",
  authDomain: "house-marketplace-app-7de82.firebaseapp.com",
  projectId: "house-marketplace-app-7de82",
  storageBucket: "house-marketplace-app-7de82.appspot.com",
  messagingSenderId: "924774427396",
  appId: "1:924774427396:web:ba5d458fcb4dfa9adebe51",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
