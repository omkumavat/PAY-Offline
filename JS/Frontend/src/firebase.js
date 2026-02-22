import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// import env from "dotenv";
// env.config();

const firebaseConfig = {
// //   apiKey: "YOUR_KEY",
//   authDomain: "YOUR_DOMAIN",
//   projectId: "YOUR_ID",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"

  apiKey: "AIzaSyD3ZACDb-oAbBYL5VnMhYUd5IsOxr94Cgk",
  authDomain: "payments-3a454.firebaseapp.com",
  projectId: "payments-3a454",
  storageBucket: "payments-3a454.firebasestorage.app",
  messagingSenderId: "647238495625",
  appId: "1:647238495625:web:e4c0b433a54e057c6f0558",
  measurementId: "G-HSE5FMBD5S"

};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
