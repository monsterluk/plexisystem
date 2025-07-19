import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { salespeople } from '@/constants/materials';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'salesperson';
}

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  isSalesperson: boolean;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

// Domyślny użytkownik - Łukasz (admin)
const defaultUser: User = {
  id: 'LS',
  name: 'Łukasz Sikorra',
  email: 'lukasz@plexisystem.pl',
  role: 'admin'
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Sprawdź czy jest zapisana sesja
  const getInitialUser = () => {
    const savedSession = localStorage.getItem('plexisystem_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // Sprawdź czy sesja nie wygasła
        if (new Date(session.expiresAt) > new Date()) {
          return session.user;
        }
      } catch (e) {
        console.error('Błąd parsowania sesji:', e);
      }
    }
    return null;
  };

  const [currentUser, setCurrentUser] = useState<User | null>(getInitialUser());

  // Aktualizuj sesję gdy zmienia się użytkownik
  useEffect(() => {
    if (currentUser) {
      const session = {
        user: currentUser,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      localStorage.setItem('plexisystem_session', JSON.stringify(session));
    }
  }, [currentUser]);

  const value = {
    currentUser: currentUser || defaultUser,
    setCurrentUser,
    isAdmin: currentUser?.role === 'admin',
    isSalesperson: currentUser?.role === 'salesperson',
    isLoggedIn: !!currentUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Lista wszystkich użytkowników
export const users: User[] = [
  {
    id: 'LS',
    name: 'Łukasz Sikorra',
    email: 'lukasz@plexisystem.pl',
    role: 'admin'
  },
  {
    id: 'DB',
    name: 'Dorota Będkowska',
    email: 'dorota@plexisystem.pl',
    role: 'salesperson'
  }
];
