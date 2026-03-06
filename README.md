# Offline QR Payment Retry & Reminder System 🚀

A smart payment recovery system that allows users to store UPI QR payment details when internet connectivity fails and automatically retry the payment once the connection is restored.

This project solves a common problem in digital payments where QR-based UPI transactions fail due to poor network connectivity. The system ensures that payment intent is safely stored and users are notified to complete the transaction once internet access is available.

---

## 📌 Problem Statement

In many situations such as rural areas, crowded locations, or unstable networks, UPI QR payments fail because of temporary internet loss. Users often have to retry the payment manually, which can cause:

- Transaction delays
- Merchant waiting time
- Duplicate payment attempts
- Poor user experience

This project provides a **fault-tolerant QR payment retry mechanism**.

---

## 💡 Solution

The system stores payment details locally when the network fails and retries the payment process when connectivity is restored. Users receive a push notification and can complete the payment instantly.

Key idea:

1. User scans or uploads a UPI QR code.
2. Payment fails due to no internet.
3. System stores the payment intent offline.
4. Once internet returns, user receives a notification after every interval until successful payment.
5. Clicking the notification redirects the user to the UPI payment app.

---

## 🏗 System Architecture
User Device  
│  
│ Scan / Upload QR  
▼  
React PWA Application  
│  
│ Store payment intent (IndexedDB / local storage)  
│  
▼  
Spring Boot Backend  
│  
│ Manage pending payments  
│  
▼  
Firebase Cloud Messaging (FCM)  
│  
│ Send push notification  
▼  
User Device Notification  
│  
│ Tap notification  
▼  
Redirect to UPI Deep Link  
│  
▼  
UPI App (Google Pay / PhonePe / Paytm)  


---

## ⚙️ Tech Stack

### Frontend
- React.js
- Progressive Web App (PWA)
- Service Workers
- IndexedDB / Local Storage
- QR Code Scanner

### Backend
- Spring Boot
- REST APIs
- Node.js (security service)

### Notifications
- Firebase Cloud Messaging (FCM)

### Payment Integration
- UPI Deep Linking

---

## ✨ Features

- QR code scanning and image upload
- Offline payment intent storage
- Progressive Web App support
- Automatic internet detection
- Push notifications using Firebase
- One-click redirect to UPI apps
- Retry failed payments
- Lightweight and scalable architecture

---

## 📱 Supported Payment Apps

The system redirects users to any UPI-enabled app installed on the device, including:

- Google Pay
- PhonePe
- Paytm
- BHIM

---

## 🔄 Workflow

### Step 1: Scan or Upload QR Code
User scans a merchant QR code or uploads a QR image.

### Step 2: Extract UPI Data
The system extracts payment details such as:

- UPI ID
- Merchant name
- Amount
- Currency

### Step 3: Network Failure Handling
If internet connectivity is unavailable:

- Payment details are stored locally.
- Payment status is marked as **Pending**.

### Step 4: Internet Restoration
When the device reconnects to the internet:

- Backend detects pending transactions.
- Firebase Cloud Messaging sends a push notification.

### Step 5: User Notification
The user receives a notification:


### Step 6: Redirect to UPI
Clicking the notification redirects the user to the UPI deep link:


The user completes the payment by entering their UPI PIN.

---

## 🔔 Push Notification Flow

Backend Server  
│  
│ Send message  
▼  
Firebase Cloud Messaging  
│  
│ Push notification  
▼  
User Device  
│  
│ Tap notification  
▼  
Open PWA  
│  
▼  
Redirect to UPI Payment  

---

## 📦 Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/offline-qr-payment-retry.git
