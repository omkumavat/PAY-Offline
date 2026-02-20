# PayOffline - Offline-First Payment Web App

A modern, offline-first payment application built with Vite, React, and PWA technologies. This app allows users to make payments even when offline, with automatic synchronization when connectivity is restored.

## Features

- **Offline-First Architecture**: Make payments anytime, even without internet connection
- **Progressive Web App (PWA)**: Install on any device and work like a native app
- **IndexedDB Storage**: Secure local storage for transactions
- **Auto-Sync**: Automatically syncs pending transactions when back online
- **Real-Time Status**: Visual indicators showing online/offline status
- **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **IndexedDB (via idb)** - Local database storage
- **Vite PWA Plugin** - Service worker and PWA manifest generation
- **Workbox** - Service worker libraries

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Navigation bar with offline badge
│   └── OfflineBadge.jsx     # Online/offline status indicator
├── pages/
│   ├── Home.jsx             # Landing page
│   └── Dashboard.jsx        # Main dashboard with transactions
├── db/
│   └── indexedDB.js         # IndexedDB utility functions
├── hooks/
│   └── useOnlineStatus.js   # Custom hook for online/offline detection
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Entry point with PWA registration
└── index.css                # Global styles with Tailwind

Configuration Files:
├── vite.config.js           # Vite config with PWA plugin
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How Offline-First Works

### 1. Online/Offline Detection

The app uses the browser's `navigator.onLine` API and event listeners to detect connectivity status:

```javascript
// useOnlineStatus.js
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);
```

### 2. Transaction Storage

When you make a payment:

- **Online**: Transaction is immediately marked as `SUCCESS`
- **Offline**: Transaction is saved to IndexedDB with status `PENDING`

```javascript
const transaction = {
  amount: 50.00,
  recipient: "John Doe",
  status: isOnline ? 'SUCCESS' : 'PENDING',
  timestamp: new Date().toISOString()
};
await addTransaction(transaction);
```

### 3. Auto-Sync

When connectivity is restored:

1. App detects the online status change
2. Retrieves all pending transactions from IndexedDB
3. Simulates syncing each transaction
4. Updates status from `PENDING` to `SUCCESS`
5. Refreshes the UI to show updated statuses

```javascript
useEffect(() => {
  if (isOnline) {
    syncPendingTransactions();
  }
}, [isOnline]);
```

### 4. Service Worker Caching

The PWA service worker caches all static assets:

- HTML, CSS, JavaScript files
- Images and SVG files
- Fonts

This enables the app to load instantly even when offline.

## IndexedDB Structure

### Database: `PayOfflineDB`

#### Object Store: `transactions`

| Field      | Type     | Description                    |
|------------|----------|--------------------------------|
| id         | number   | Auto-incrementing primary key  |
| amount     | number   | Transaction amount             |
| recipient  | string   | Payment recipient name         |
| status     | string   | `PENDING` or `SUCCESS`         |
| type       | string   | Transaction type (e.g., PAYMENT)|
| timestamp  | string   | ISO 8601 timestamp             |
| syncedAt   | string   | ISO 8601 timestamp (optional)  |

#### Indexes

- `status` - For querying pending transactions
- `timestamp` - For chronological sorting

## Key Components

### Dashboard

The main interface showing:
- User wallet summary
- Transaction history
- Payment creation modal
- Pending transaction indicators
- Offline warning banner

### OfflineBadge

Real-time indicator showing:
- Green dot + "Online" when connected
- Red dot + "Offline" when disconnected
- Pulsing animation for visibility

### IndexedDB Utilities

Core functions:
- `initDB()` - Initialize database
- `addTransaction()` - Add new transaction
- `getAllTransactions()` - Retrieve all transactions
- `updateTransaction()` - Update transaction status
- `getPendingTransactions()` - Get transactions awaiting sync

## Testing Offline Mode

### Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Select "Offline" from the throttling dropdown
4. Try making a payment
5. Check transaction status (should show "Pending")
6. Switch back to "Online"
7. Watch transaction automatically sync

### Application Tab

1. Open Application tab in DevTools
2. Check "Service Workers" - should show active worker
3. Check "IndexedDB" - should show PayOfflineDB
4. Inspect stored transactions

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

All modern browsers with:
- Service Worker support
- IndexedDB support
- ES6+ JavaScript

## PWA Installation

Users can install the app on:

- **Desktop**: Click install icon in address bar
- **Android**: "Add to Home Screen" from browser menu
- **iOS**: "Add to Home Screen" from Share menu

Once installed, the app works offline by default.

## Security Notes

This is a demo application using:
- Mock user data
- Simulated transactions
- No real payment processing
- Local-only storage

For production use, you would need:
- Real authentication
- Backend API integration
- Encrypted data transmission
- Secure payment gateway
- Server-side validation

## Future Enhancements

- User authentication
- Multiple user accounts
- Transaction categories
- Export transaction history
- Push notifications for sync status
- Conflict resolution for offline edits
- Background sync API integration

## License

MIT

## Author

Built with Vite + React for offline-first web applications.
