import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Błąd logowania');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PlexiSystem</h1>
          <p className="text-gray-600 mt-2">Zaloguj się do systemu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="twoj@email.pl"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logowanie...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Zaloguj się
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Demo konta:</strong></p>
            <p>Admin: admin@plexisystem.pl</p>
            <p>Handlowiec: dorota@plexisystem.pl</p>
            <p>Hasło: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
