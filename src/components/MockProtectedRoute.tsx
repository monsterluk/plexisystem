import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Mapowanie ról na uprawnienia do modułów
const ROLE_PERMISSIONS = {
  admin: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    offers: { view: true, create: true, edit: true, delete: true },
    clients: { view: true, create: true, edit: true, delete: true },
    products: { view: true, create: true, edit: true, delete: true },
    production: { view: true, create: true, edit: true, delete: true },
    quality_control: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, create: true, edit: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, create: true, edit: true, delete: true },
    ai: { view: true, create: true, edit: true, delete: true },
    marketplace: { view: true, create: true, edit: true, delete: true },
    knowledge: { view: true, create: true, edit: true, delete: true },
  },
  salesperson: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    offers: { view: true, create: true, edit: true, delete: false },
    clients: { view: true, create: true, edit: true, delete: false },
    products: { view: true, create: false, edit: false, delete: false },
    production: { view: false, create: false, edit: false, delete: false },
    quality_control: { view: false, create: false, edit: false, delete: false },
    reports: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
    ai: { view: true, create: false, edit: false, delete: false },
    marketplace: { view: true, create: false, edit: false, delete: false },
    knowledge: { view: true, create: false, edit: false, delete: false },
  }
};

interface MockProtectedRouteProps {
  children: React.ReactNode;
  module?: string;
  action?: 'view' | 'create' | 'edit' | 'delete';
}

export const MockProtectedRoute: React.FC<MockProtectedRouteProps> = ({ 
  children, 
  module, 
  action = 'view' 
}) => {
  const { currentUser } = useUser();

  // Jeśli nie określono modułu, pozwól na dostęp
  if (!module) {
    return <>{children}</>;
  }

  // Sprawdź uprawnienia
  const userRole = currentUser.role as keyof typeof ROLE_PERMISSIONS;
  const permissions = ROLE_PERMISSIONS[userRole];
  
  if (!permissions) {
    return <Navigate to="/unauthorized" replace />;
  }

  const modulePermissions = permissions[module as keyof typeof permissions];
  
  if (!modulePermissions) {
    return <Navigate to="/unauthorized" replace />;
  }

  const hasPermission = modulePermissions[action];

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};