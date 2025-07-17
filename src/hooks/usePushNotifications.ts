// hooks/usePushNotifications.ts
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';

interface NotificationPermissionState {
  permission: NotificationPermission;
  isSupported: boolean;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
}

export function usePushNotifications() {
  const { currentUser } = useUser();
  const [state, setState] = useState<NotificationPermissionState>({
    permission: 'default',
    isSupported: false,
    isSubscribed: false,
    subscription: null
  });

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  const checkNotificationSupport = async () => {
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    
    if (isSupported) {
      const permission = Notification.permission;
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      setState({
        permission,
        isSupported,
        isSubscribed: !!subscription,
        subscription
      });
    } else {
      setState(prev => ({ ...prev, isSupported: false }));
    }
  };

  const requestPermission = async () => {
    if (!state.isSupported) {
      console.error('Push notifications are not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));
      
      if (permission === 'granted') {
        await subscribeUser();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Get VAPID public key from server
      const response = await fetch('/api/notifications/vapid-public-key');
      const { publicKey } = await response.json();
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userId: currentUser.id
        })
      });

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription
      }));

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe user:', error);
      return null;
    }
  };

  const unsubscribeUser = async () => {
    try {
      if (state.subscription) {
        await state.subscription.unsubscribe();
        
        // Remove subscription from server
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.id
          })
        });

        setState(prev => ({
          ...prev,
          isSubscribed: false,
          subscription: null
        }));
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  const sendTestNotification = async () => {
    if (!state.isSubscribed) {
      console.error('User is not subscribed to notifications');
      return;
    }

    try {
      await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          title: 'Test powiadomienia',
          body: 'To jest testowe powiadomienie PlexiSystem',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          data: {
            type: 'test',
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  return {
    ...state,
    requestPermission,
    subscribeUser,
    unsubscribeUser,
    sendTestNotification,
    checkNotificationSupport
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}