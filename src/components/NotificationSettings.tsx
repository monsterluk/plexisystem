// components/NotificationSettings.tsx
import React from 'react';
import { Bell, BellOff, Smartphone, CheckCircle } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Button } from '@/components/ui/Button';

export const NotificationSettings: React.FC = () => {
  const {
    permission,
    isSupported,
    isSubscribed,
    requestPermission,
    unsubscribeUser,
    sendTestNotification
  } = usePushNotifications();

  if (!isSupported) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-400">
          Twoja przeglądarka nie wspiera powiadomień push. 
          Użyj Chrome, Firefox lub Safari na urządzeniu mobilnym.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="w-6 h-6 text-orange-500" />
            Powiadomienia Push
          </h3>
          <p className="text-gray-400 mt-1">
            Otrzymuj powiadomienia o akceptacji ofert i ważnych wydarzeniach
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <span className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              Aktywne
            </span>
          ) : (
            <span className="flex items-center gap-2 text-gray-500">
              <BellOff className="w-5 h-5" />
              Nieaktywne
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {permission === 'default' && (
          <div className="bg-zinc-700 rounded-lg p-4">
            <p className="text-sm mb-3">
              Włącz powiadomienia, aby być na bieżąco z akceptacjami ofert i ważnymi terminami.
            </p>
            <Button onClick={requestPermission} variant="primary">
              <Bell className="w-4 h-4" />
              Włącz powiadomienia
            </Button>
          </div>
        )}

        {permission === 'denied' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              Powiadomienia zostały zablokowane. Aby je włączyć, zmień ustawienia przeglądarki.
            </p>
            <p className="text-red-400/70 text-xs mt-2">
              Chrome: Kliknij ikonę kłódki obok adresu strony → Ustawienia witryny → Powiadomienia
            </p>
          </div>
        )}

        {permission === 'granted' && isSubscribed && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-700 rounded-lg p-4">
                <h4 className="font-medium mb-2">Rodzaje powiadomień:</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Akceptacja oferty przez klienta
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Przypomnienia o wygasających ofertach
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Nowe zapytania od klientów
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Przypomnienia o follow-up
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-700 rounded-lg p-4">
                <h4 className="font-medium mb-2">Ustawienia:</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Dźwięk powiadomień</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Wibracje (mobile)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Pokazuj podgląd treści</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={sendTestNotification} variant="secondary">
                <Smartphone className="w-4 h-4" />
                Wyślij test
              </Button>
              <Button onClick={unsubscribeUser} variant="secondary">
                <BellOff className="w-4 h-4" />
                Wyłącz powiadomienia
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 p-4 bg-orange-500/10 rounded-lg">
        <p className="text-sm text-orange-400">
          <strong>Wskazówka:</strong> Zainstaluj PlexiSystem jako aplikację na telefonie, 
          aby otrzymywać powiadomienia nawet gdy przeglądarka jest zamknięta.
        </p>
      </div>
    </div>
  );
};