import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Register Service Worker - temporarily disabled
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then(registration => {
//         console.log('SW registered:', registration);
        
//         // Check for updates every hour
//         setInterval(() => {
//           registration.update();
//         }, 60 * 60 * 1000);
//       })
//       .catch(error => {
//         console.log('SW registration failed:', error);
//       });
//   });
// }

// Install PWA prompt - temporarily disabled
// let deferredPrompt: any;

// window.addEventListener('beforeinstallprompt', (e) => {
//   e.preventDefault();
//   deferredPrompt = e;
  
//   // Show install button
//   const installButton = document.getElementById('install-pwa');
//   if (installButton) {
//     installButton.style.display = 'block';
//     installButton.addEventListener('click', () => {
//       deferredPrompt.prompt();
//       deferredPrompt.userChoice.then((choiceResult: any) => {
//         if (choiceResult.outcome === 'accepted') {
//           console.log('User accepted the install prompt');
//         }
//         deferredPrompt = null;
//       });
//     });
//   }
// });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
