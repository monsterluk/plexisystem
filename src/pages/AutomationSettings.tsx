import React, { useState, useEffect } from 'react';
import { Bell, Mail, Clock, Zap, Save, Plus, Trash2, Calendar, AlertCircle, CheckCircle, Settings, Toggle, X, ChevronRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import { TestDataReset } from '@/components/TestDataReset';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: 'offer_expiry' | 'offer_status' | 'client_activity' | 'scheduled';
  trigger: {
    event?: string;
    days?: number;
    time?: string;
    status?: string;
  };
  action: {
    type: 'email' | 'notification' | 'task';
    template?: string;
    recipients?: string[];
  };
  isActive: boolean;
  lastTriggered?: string;
  createdAt: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  digest: 'instant' | 'daily' | 'weekly';
}

export function AutomationSettings() {
  const { isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState<'rules' | 'notifications' | 'templates' | 'admin'>('rules');
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Przypomnienie o wygasających ofertach',
      description: 'Powiadom 3 dni przed wygaśnięciem oferty',
      type: 'offer_expiry',
      trigger: { days: 3 },
      action: { type: 'email', template: 'offer_expiry_reminder' },
      isActive: true,
      lastTriggered: '2024-07-15T10:00:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Powiadomienie o akceptacji oferty',
      description: 'Wyślij email gdy oferta zostanie zaakceptowana',
      type: 'offer_status',
      trigger: { status: 'accepted' },
      action: { type: 'notification', template: 'offer_accepted' },
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Cotygodniowy raport',
      description: 'Wysyłaj raport z podsumowaniem każdy poniedziałek o 9:00',
      type: 'scheduled',
      trigger: { time: '09:00', event: 'weekly_monday' },
      action: { type: 'email', template: 'weekly_report' },
      isActive: false,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: false,
    inApp: true,
    digest: 'instant'
  });

  const [emailTemplates] = useState([
    { id: 'offer_expiry_reminder', name: 'Przypomnienie o wygaśnięciu', variables: ['offer_number', 'client_name', 'days_left'] },
    { id: 'offer_accepted', name: 'Oferta zaakceptowana', variables: ['offer_number', 'client_name', 'total_value'] },
    { id: 'weekly_report', name: 'Raport tygodniowy', variables: ['week_number', 'offers_count', 'revenue'] },
    { id: 'client_inactive', name: 'Nieaktywny klient', variables: ['client_name', 'last_activity', 'days_inactive'] }
  ]);

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  const saveNotificationSettings = () => {
    // Zapisz ustawienia
    console.log('Saving notification settings:', notificationSettings);
  };

  const renderRules = () => (
    <div className="space-y-6">
      {/* Nagłówek z przyciskiem dodawania */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Reguły automatyzacji</h3>
          <p className="text-sm text-gray-400 mt-1">Zarządzaj automatycznymi akcjami w systemie</p>
        </div>
        <button
          onClick={() => setShowRuleModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Nowa reguła
        </button>
      </div>

      {/* Lista reguł */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-gray-800/50 backdrop-blur-sm rounded-lg border p-6 transition-all ${
              rule.isActive ? 'border-green-500/30 shadow-sm' : 'border-gray-700 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    rule.isActive ? 'bg-green-500/10' : 'bg-gray-700'
                  }`}>
                    {rule.type === 'offer_expiry' && <Clock className="w-5 h-5 text-orange-400" />}
                    {rule.type === 'offer_status' && <Bell className="w-5 h-5 text-blue-400" />}
                    {rule.type === 'scheduled' && <Calendar className="w-5 h-5 text-purple-400" />}
                    {rule.type === 'client_activity' && <Zap className="w-5 h-5 text-yellow-400" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      {rule.name}
                      {rule.isActive && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full animate-pulse">
                          Aktywna
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Wyzwalacz: 
                      {rule.trigger.days && ` ${rule.trigger.days} dni przed`}
                      {rule.trigger.status && ` Status: ${rule.trigger.status}`}
                      {rule.trigger.time && ` Codziennie o ${rule.trigger.time}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Akcja: {rule.action.type === 'email' ? 'Email' : rule.action.type === 'notification' ? 'Powiadomienie' : 'Zadanie'}
                    </span>
                  </div>
                  {rule.lastTriggered && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">
                        Ostatnie uruchomienie: {new Date(rule.lastTriggered).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    rule.isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      rule.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <button
                  onClick={() => {
                    setEditingRule(rule);
                    setShowRuleModal(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Aktywne reguły</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {rules.filter(r => r.isActive).length} / {rules.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Wykonane dzisiaj</p>
              <p className="text-2xl font-bold text-green-900 mt-1">24</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Zaoszczędzony czas</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">3.5h</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Ustawienia powiadomień</h3>
        <p className="text-sm text-gray-400 mt-1">Wybierz jak chcesz otrzymywać powiadomienia</p>
      </div>

      {/* Kanały powiadomień */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 space-y-6">
        <h4 className="font-medium text-white">Kanały powiadomień</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-white">Email</p>
                <p className="text-sm text-gray-400">Otrzymuj powiadomienia na adres email</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings({ ...notificationSettings, email: !notificationSettings.email })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.email ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-white">Powiadomienia push</p>
                <p className="text-sm text-gray-400">Powiadomienia w przeglądarce</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings({ ...notificationSettings, push: !notificationSettings.push })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.push ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.push ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-white">Powiadomienia w aplikacji</p>
                <p className="text-sm text-gray-400">Pokazuj powiadomienia w systemie</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings({ ...notificationSettings, inApp: !notificationSettings.inApp })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.inApp ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.inApp ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Częstotliwość */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h4 className="font-medium text-white mb-4">Częstotliwość powiadomień</h4>
        <div className="space-y-3">
          {(['instant', 'daily', 'weekly'] as const).map((frequency) => (
            <label key={frequency} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="digest"
                value={frequency}
                checked={notificationSettings.digest === frequency}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, digest: e.target.value as any })}
                className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600"
              />
              <div>
                <p className="font-medium text-white">
                  {frequency === 'instant' && 'Natychmiast'}
                  {frequency === 'daily' && 'Podsumowanie dzienne'}
                  {frequency === 'weekly' && 'Podsumowanie tygodniowe'}
                </p>
                <p className="text-sm text-gray-400">
                  {frequency === 'instant' && 'Otrzymuj powiadomienia od razu'}
                  {frequency === 'daily' && 'Jedno podsumowanie każdego dnia o 9:00'}
                  {frequency === 'weekly' && 'Jedno podsumowanie w poniedziałki o 9:00'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={saveNotificationSettings}
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        Zapisz ustawienia
      </button>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Szablony wiadomości</h3>
        <p className="text-sm text-gray-400 mt-1">Zarządzaj szablonami emaili i powiadomień</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emailTemplates.map((template) => (
          <div key={template.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-all cursor-pointer">
            <h4 className="font-semibold text-white">{template.name}</h4>
            <p className="text-sm text-gray-400 mt-2">ID: {template.id}</p>
            <div className="mt-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Dostępne zmienne:</p>
              <div className="flex flex-wrap gap-2">
                {template.variables.map((variable) => (
                  <span key={variable} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-mono">
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
            </div>
            <button className="mt-4 text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Edytuj szablon →
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdminSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Ustawienia administratora</h3>
        <p className="text-sm text-gray-400 mt-1">Zarządzaj ustawieniami systemu i danymi testowymi</p>
      </div>

      {/* Resetowanie danych testowych */}
      <TestDataReset />
      
      {/* Dodatkowe ustawienia administratora mogą być dodane tutaj */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Nagłówek */}
      <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Settings className="w-8 h-8 text-orange-500" />
                Automatyzacja
              </h1>
              <p className="mt-1 text-sm text-gray-300">
                Skonfiguruj automatyczne akcje i powiadomienia
              </p>
            </div>
          </div>

          {/* Zakładki */}
          <div className="flex space-x-8 border-b -mb-px">
            {[
              { id: 'rules', label: 'Reguły', icon: Zap },
              { id: 'notifications', label: 'Powiadomienia', icon: Bell },
              { id: 'templates', label: 'Szablony', icon: Mail },
              ...(isAdmin ? [{ id: 'admin', label: 'Administracja', icon: Settings }] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zawartość */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'rules' && renderRules()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'admin' && isAdmin && renderAdminSettings()}
      </div>

      {/* Modal dodawania/edycji reguły */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 animate-scaleIn border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingRule ? 'Edytuj regułę' : 'Nowa reguła automatyzacji'}
              </h3>
              <button
                onClick={() => {
                  setShowRuleModal(false);
                  setEditingRule(null);
                }}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Formularz reguły */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nazwa reguły</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="np. Przypomnienie o fakturze"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Typ wyzwalacza</label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="offer_expiry">Wygaśnięcie oferty</option>
                  <option value="offer_status">Zmiana statusu oferty</option>
                  <option value="scheduled">Harmonogram</option>
                  <option value="client_activity">Aktywność klienta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Akcja</label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="email">Wyślij email</option>
                  <option value="notification">Pokaż powiadomienie</option>
                  <option value="task">Utwórz zadanie</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRuleModal(false);
                    setEditingRule(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Anuluj
                </button>
                <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  {editingRule ? 'Zapisz zmiany' : 'Dodaj regułę'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}