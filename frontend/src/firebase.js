import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBmsk39Is56n0b35kA0ZcycsKZGrmNPNkQ",
  authDomain: "aarogyamitra-3dc3c.firebaseapp.com",
  databaseURL: "https://aarogyamitra-3dc3c-default-rtdb.firebaseio.com",
  projectId: "aarogyamitra-3dc3c",
  storageBucket: "aarogyamitra-3dc3c.firebasestorage.app",
  messagingSenderId: "87709247241",
  appId: "1:87709247241:web:e982b16f3947bf0ece95d8",
  measurementId: "G-WEK7HM46DT"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
