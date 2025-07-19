import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useUser } from '@/context/UserContext';

// Tymczasowe hasła użytkowników - w produkcji powinny być w bazie danych
const USER_CREDENTIALS = {
  'lukasz@plexisystem.pl': {
    password: 'admin123',
    user: {
      id: 'LS',
      name: 'Łukasz Sikorra',
      email: 'lukasz@plexisystem.pl',
      role: 'admin' as const
    }
  },
  'dorota@plexisystem.pl': {
    password: 'dorota123',
    user: {
      id: 'DB',
      name: 'Dorota Będkowska',
      email: 'dorota@plexisystem.pl',
      role: 'salesperson' as const
    }
  }
};

export function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Symulacja opóźnienia jak przy prawdziwym API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Sprawdzenie kredencjałów
    const userCredentials = USER_CREDENTIALS[email as keyof typeof USER_CREDENTIALS];
    
    if (!userCredentials) {
      setError('Nieprawidłowy email lub hasło');
      setIsLoading(false);
      return;
    }

    if (userCredentials.password !== password) {
      setError('Nieprawidłowy email lub hasło');
      setIsLoading(false);
      return;
    }

    // Zapisz sesję w localStorage
    const session = {
      user: userCredentials.user,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 godziny
    };
    
    localStorage.setItem('plexisystem_session', JSON.stringify(session));
    
    // Ustaw użytkownika w kontekście
    setCurrentUser(userCredentials.user);
    
    setIsLoading(false);
    
    // Przekieruj do dashboardu
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo i tytuł */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500 mb-2">PlexiSystem</h1>
          <p className="text-gray-400">Zaloguj się do systemu</p>
        </div>

        {/* Formularz */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="nazwa@plexisystem.pl"
                  required
                />
              </div>
            </div>

            {/* Hasło */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Hasło
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Błąd */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Przycisk logowania */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Logowanie...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Zaloguj się
                </>
              )}
            </button>
          </form>

          {/* Informacja o demo */}
          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-sm text-gray-400 text-center">
              <strong>Konta testowe:</strong><br />
              Admin: lukasz@plexisystem.pl / admin123<br />
              Handlowiec: dorota@plexisystem.pl / dorota123
            </p>
          </div>
        </div>

        {/* Stopka */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 PlexiSystem. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </div>
  );
}