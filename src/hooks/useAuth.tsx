import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface Permission {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  permissions: Permission[];
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  canAccessModule: (module: string) => boolean;
  logActivity: (action: string, module: string, details?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await checkUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Pobierz szczegóły użytkownika z naszej tabeli
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (error) throw error;

        if (userData && userData.is_active) {
          setUser(userData);
          
          // Zaktualizuj ostatnie logowanie
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', userData.id);
        } else {
          // Użytkownik nieaktywny lub nie istnieje w naszej tabeli
          await supabase.auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Najpierw sprawdź, czy użytkownik istnieje i jest aktywny
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!userData || !userData.is_active) {
        throw new Error('Konto nieaktywne lub nie istnieje');
      }

      // Logowanie przez Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Zapisz sesję
      const ip = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip)
        .catch(() => 'unknown');

      await supabase.from('user_sessions').insert({
        user_id: userData.id,
        ip_address: ip,
        user_agent: navigator.userAgent,
      });

      await logActivity('login', 'auth', { ip_address: ip });
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Zakończ aktywną sesję
      if (user) {
        await supabase
          .from('user_sessions')
          .update({ 
            ended_at: new Date().toISOString(), 
            is_active: false 
          })
          .eq('user_id', user.id)
          .eq('is_active', true);

        await logActivity('logout', 'auth');
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const hasPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin ma zawsze pełne uprawnienia

    const permission = user.permissions.find(p => p.module === module);
    if (!permission) return false;

    switch (action) {
      case 'view':
        return permission.can_view;
      case 'create':
        return permission.can_create;
      case 'edit':
        return permission.can_edit;
      case 'delete':
        return permission.can_delete;
      default:
        return false;
    }
  };

  const canAccessModule = (module: string): boolean => {
    return hasPermission(module, 'view');
  };

  const logActivity = async (action: string, module: string, details?: any) => {
    if (!user) return;

    try {
      const ip = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip)
        .catch(() => 'unknown');

      await supabase.from('user_activity_logs').insert({
        user_id: user.id,
        action,
        module,
        details: details || {},
        ip_address: ip,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    hasPermission,
    canAccessModule,
    logActivity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Komponent zabezpieczający trasy
export const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  module?: string;
  action?: 'view' | 'create' | 'edit' | 'delete';
}> = ({ children, module, action = 'view' }) => {
  const { user, loading, hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (module && !hasPermission(module, action)) {
        navigate('/unauthorized');
      }
    }
  }, [user, loading, module, action]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user || (module && !hasPermission(module, action))) {
    return null;
  }

  return <>{children}</>;
};