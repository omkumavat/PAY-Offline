importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");
// import env from "dotenv";
// env.config();

const API_URL = "https://pay-offline-backend1.onrender.com";

firebase.initializeApp({
//   apiKey: "YOUR_KEY",
//   authDomain: "YOUR_DOMAIN",
//   projectId: "YOUR_ID",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"

  apiKey: "AIzaSyD3ZACDb",
  authDomain: "payments-3a454.firebaseapp.com",
  projectId: "payments-3a454",
  storageBucket: "payments-3a454.firebasestorage.app",
  messagingSenderId: "647238495625",
  appId: "1:647238495625:web:e4c0b433a54e057c6f0558",
  measurementId: "G-HSE5FMBD5S"

});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  const title = payload.data.title;
  const txnId = payload.data.txnId;
  const body = payload.data.body;
  const upiLink = payload.data.upiLink;

  console.log(upiLink);
  

  self.registration.showNotification(title, {
    body: body,
    data: { upiLink, txnId }
  });
});


self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const upiLink = event.notification.data?.upiLink;
  const txnId = event.notification.data?.txnId;

    console.log("txnId:", txnId);

  event.waitUntil(
    fetch(`${API_URL}/api/payments/notification-clicked`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        txnId: txnId
      })
    })
    .then(() => {
      return clients.openWindow(upiLink);
    })
    .catch(err => {
      console.error("API failed:", err);
      return clients.openWindow(upiLink);
    })
  );
});
