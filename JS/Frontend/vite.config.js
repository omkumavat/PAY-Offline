// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       includeAssets: ['vite.svg'],
//       manifest: {
//         name: 'PayOffline - Offline Payment App',
//         short_name: 'PayOffline',
//         description: 'Offline-first payment application with PWA support',
//         theme_color: '#0284c7',
//         background_color: '#ffffff',
//         display: 'standalone',
//         icons: [
//           {
//             src: '/vite.svg',
//             sizes: '512x512',
//             type: 'image/svg+xml',
//             purpose: 'any maskable'
//           }
//         ]
//       },
//       workbox: {
//         globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
//         runtimeCaching: [
//           {
//             urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
//             handler: 'CacheFirst',
//             options: {
//               cacheName: 'google-fonts-cache',
//               expiration: {
//                 maxEntries: 10,
//                 maxAgeSeconds: 60 * 60 * 24 * 365
//               },
//               cacheableResponse: {
//                 statuses: [0, 200]
//               }
//             }
//           }
//         ]
//       }
//     })
//   ],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'OfflineFirst PAY',
        short_name: 'OfflineFirstPAY',
        description: 'My awesome Progressive Web App',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ],
      }
    })
  ]
})
