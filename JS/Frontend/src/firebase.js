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

  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID

};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
