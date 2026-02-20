import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging/sw'

precacheAndRoute(self.__WB_MANIFEST)
clientsClaim()

// Firebase config
const firebaseConfig = {
//   apiKey: "...",
//   authDomain: "...",
//   projectId: "...",
//   messagingSenderId: "...",
//   appId: "..."

  apiKey: "AIzaSyD3ZACDb-oAbBYL5VnMhYUd5IsOxr94Cgk",
  authDomain: "payments-3a454.firebaseapp.com",
  projectId: "payments-3a454",
//   storageBucket: "payments-3a454.firebasestorage.app",
  messagingSenderId: "647238495625",
  appId: "1:647238495625:web:e4c0b433a54e057c6f0558",
//   measurementId: "G-HSE5FMBD5S"
}

const app = initializeApp(firebaseConfig)
getMessaging(app)
