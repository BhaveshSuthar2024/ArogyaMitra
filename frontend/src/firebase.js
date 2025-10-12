import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAHAQ6Hqri-_mcd5It6-8eqzaJFeX1GXFI",
  authDomain: "sensors-data-max30102.firebaseapp.com",
  databaseURL: "https://sensors-data-max30102-default-rtdb.firebaseio.com",
  projectId: "sensors-data-max30102",
  storageBucket: "sensors-data-max30102.firebasestorage.app",
  messagingSenderId: "1070901551821",
  appId: "1:1070901551821:web:cc9a28c0dfe40fecd6ff84",
  measurementId: "G-Z4BW5LDHQZ"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
