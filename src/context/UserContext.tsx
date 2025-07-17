import { createContext, useContext, useState, ReactNode } from 'react';
import { salespeople } from '@/constants/materials';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'salesperson';
}

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAdmin: boolean;
  isSalesperson: boolean;
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
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);

  const value = {
    currentUser,
    setCurrentUser,
    isAdmin: currentUser.role === 'admin',
    isSalesperson: currentUser.role === 'salesperson'
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
