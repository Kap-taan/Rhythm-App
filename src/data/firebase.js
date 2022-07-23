import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAwgj8bcEeK-sYfku5q1vKB27GJwSHK4MA",
    authDomain: "geetapp-c1fff.firebaseapp.com",
    projectId: "geetapp-c1fff",
    storageBucket: "geetapp-c1fff.appspot.com",
    messagingSenderId: "726246709685",
    appId: "1:726246709685:web:674870141f64b551fce1fc"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

export default app;