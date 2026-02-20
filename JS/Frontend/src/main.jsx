import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },

  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/firebase-messaging-sw.js")
//     .then(() => console.log("Service Worker Registered"));
// }


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>
)
