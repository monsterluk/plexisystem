// Service Worker dla PlexiSystem
const CACHE_NAME = 'plexisystem-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    ).catch(() => {
      // If both fail, show offline page
      if (event.request.destination === 'document') {
        return caches.match('/offline.html');
      }
    })
  );
});

// Push notifications
self.addEventListener('push', event => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: 'PlexiSystem',
    body: 'Masz nowe powiadomienie',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'plexisystem-notification',
    requireInteraction: true,
    actions: []
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
      
      // Dodaj akcje w zależności od typu powiadomienia
      if (data.type === 'offer-accepted') {
        notificationData.actions = [
          { action: 'view', title: 'Zobacz ofertę', icon: '/icons/view.png' },
          { action: 'contact', title: 'Kontakt', icon: '/icons/contact.png' }
        ];
      } else if (data.type === 'offer-expiring') {
        notificationData.actions = [
          { action: 'extend', title: 'Przedłuż', icon: '/icons/extend.png' },
          { action: 'remind', title: 'Przypomnij później', icon: '/icons/remind.png' }
        ];
      }
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event);
  
  event.notification.close();

  let urlToOpen = '/';
  
  // Handle different actions
  if (event.action === 'view' && event.notification.data && event.notification.data.offerId) {
    urlToOpen = `/offer/${event.notification.data.offerId}`;
  } else if (event.action === 'contact' && event.notification.data && event.notification.data.clientId) {
    urlToOpen = `/clients/${event.notification.data.clientId}`;
  } else if (event.action === 'extend' && event.notification.data && event.notification.data.offerId) {
    urlToOpen = `/offer/${event.notification.data.offerId}/extend`;
  } else if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, then open the target URL in a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-offers') {
    event.waitUntil(syncOffers());
  }
});

async function syncOffers() {
  try {
    const cache = await caches.open('offline-offers');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (error) {
        console.error('Sync failed for:', request.url);
      }
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

// Periodic background sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'check-notifications') {
    event.waitUntil(checkForNotifications());
  }
});

async function checkForNotifications() {
  try {
    const response = await fetch('/api/notifications/check');
    const notifications = await response.json();
    
    for (const notification of notifications) {
      await self.registration.showNotification(notification.title, notification);
    }
  } catch (error) {
    console.error('Failed to check notifications:', error);
  }
}