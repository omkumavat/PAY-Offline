import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging/sw'
// import env from 'dotenv'
// env.config()

precacheAndRoute(self.__WB_MANIFEST)
clientsClaim()

// Firebase config
const firebaseConfig = {
//   apiKey: "...",
//   authDomain: "...",
//   projectId: "...",
//   messagingSenderId: "...",
//   appId: "..."

  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER,
  appId: import.meta.env.VITE_APP_ID,
//   measurementId: "G-HSE5FMBD5S"
}

const app = initializeApp(firebaseConfig)
getMessaging(app)
