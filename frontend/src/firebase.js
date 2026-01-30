import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCvWBKGJ0vXrrT_EAoN0yvemQOqynrQv7c",
  authDomain: "arogya-cb3c0.firebaseapp.com",
  databaseURL: "https://arogya-cb3c0-default-rtdb.firebaseio.com",
  projectId: "arogya-cb3c0",
  storageBucket: "arogya-cb3c0.firebasestorage.app",
  messagingSenderId: "279873706745",
  appId: "1:279873706745:web:69ded10505cf9bcf55e028",
  measurementId: "G-Y0TNH93RJV"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);