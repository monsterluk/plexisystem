import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Shield, 
  Lock,
  Save,
  X,
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  Activity
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  permissions: Permission[];
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface Permission {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string;
  default_permissions: Permission[];
}

const AVAILABLE_MODULES = [
  { id: 'dashboard', name: 'Dashboard', description: 'Pulpit główny' },
  { id: 'offers', name: 'Oferty', description: 'Zarządzanie ofertami' },
  { id: 'clients', name: 'Klienci', description: 'Baza klientów' },
  { id: 'products', name: 'Produkty', description: 'Katalog produktów' },
  { id: 'production', name: 'Produkcja', description: 'Moduł produkcyjny' },
  { id: 'quality_control', name: 'Kontrola Jakości', description: 'Kontrola jakości i wysyłki' },
  { id: 'reports', name: 'Raporty', description: 'Raporty i analizy' },
  { id: 'automation', name: 'Automatyzacja', description: 'Ustawienia automatyzacji' },
  { id: 'users', name: 'Użytkownicy', description: 'Zarządzanie użytkownikami' },
  { id: 'settings', name: 'Ustawienia', description: 'Ustawienia systemu' }
];

const PREDEFINED_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'admin',
    display_name: 'Administrator',
    description: 'Pełny dostęp do wszystkich modułów',
    default_permissions: AVAILABLE_MODULES.map(module => ({
      module: module.id,
      can_view: true,
      can_create: true,
      can_edit: true,
      can_delete: true
    }))
  },
  {
    id: 'manager',
    name: 'manager',
    display_name: 'Kierownik',
    description: 'Dostęp do zarządzania i raportów',
    default_permissions: AVAILABLE_MODULES.map(module => ({
      module: module.id,
      can_view: true,
      can_create: module.id !== 'users' && module.id !== 'settings',
      can_edit: module.id !== 'users' && module.id !== 'settings',
      can_delete: module.id !== 'users' && module.id !== 'settings'
    }))
  },
  {
    id: 'quality_controller',
    name: 'quality_controller',
    display_name: 'Kontroler Jakości',
    description: 'Dostęp do kontroli jakości i raportów',
    default_permissions: AVAILABLE_MODULES.map(module => ({
      module: module.id,
      can_view: ['dashboard', 'quality_control', 'reports', 'products'].includes(module.id),
      can_create: module.id === 'quality_control',
      can_edit: module.id === 'quality_control',
      can_delete: false
    }))
  },
  {
    id: 'warehouse',
    name: 'warehouse',
    display_name: 'Magazynier',
    description: 'Dostęp do dokumentów WZ i produktów',
    default_permissions: AVAILABLE_MODULES.map(module => ({
      module: module.id,
      can_view: ['dashboard', 'quality_control', 'products'].includes(module.id),
      can_create: module.id === 'quality_control',
      can_edit: module.id === 'quality_control',
      can_delete: false
    }))
  },
  {
    id: 'salesperson',
    name: 'salesperson',
    display_name: 'Handlowiec',
    description: 'Dostęp do ofert i klientów',
    default_permissions: AVAILABLE_MODULES.map(module => ({
      module: module.id,
      can_view: ['dashboard', 'offers', 'clients', 'products', 'reports'].includes(module.id),
      can_create: ['offers', 'clients'].includes(module.id),
      can_edit: ['offers', 'clients'].includes(module.id),
      can_delete: false
    }))
  },
  {
    id: 'viewer',
    name: 'viewer',
    display_name: 'Podgląd',
    description: 'Tylko odczyt wybranych modułów',
    default_permissions: AVAILABLE_MODULES.map(module => ({
      module: module.id,
      can_view: !['users', 'settings', 'automation'].includes(module.id),
      can_create: false,
      can_edit: false,
      can_delete: false
    }))
  }
];

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Stan dla formularza
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: 'viewer',
    is_active: true,
    password: '',
    permissions: [] as Permission[]
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Błąd pobierania użytkowników:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setIsAddingUser(true);
    setSelectedUser(null);
    const defaultRole = PREDEFINED_ROLES.find(r => r.name === 'viewer');
    setFormData({
      email: '',
      full_name: '',
      phone: '',
      role: 'viewer',
      is_active: true,
      password: '',
      permissions: defaultRole?.default_permissions || []
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsAddingUser(false);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      phone: user.phone || '',
      role: user.role,
      is_active: user.is_active,
      password: '',
      permissions: user.permissions
    });
  };

  const handleRoleChange = (roleId: string) => {
    const role = PREDEFINED_ROLES.find(r => r.name === roleId);
    if (role) {
      setFormData({
        ...formData,
        role: roleId,
        permissions: role.default_permissions
      });
    }
  };

  const handlePermissionChange = (moduleId: string, permission: string, value: boolean) => {
    const newPermissions = [...formData.permissions];
    const modulePermission = newPermissions.find(p => p.module === moduleId);
    
    if (modulePermission) {
      (modulePermission as any)[permission] = value;
    } else {
      const newPerm: any = {
        module: moduleId,
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false
      };
      newPerm[permission] = value;
      newPermissions.push(newPerm);
    }
    
    setFormData({ ...formData, permissions: newPermissions });
  };

  const handleSaveUser = async () => {
    setSaving(true);
    try {
      if (isAddingUser) {
        // Dodawanie nowego użytkownika
        const { data, error } = await supabase
          .from('users')
          .insert([{
            email: formData.email,
            full_name: formData.full_name,
            phone: formData.phone,
            role: formData.role,
            is_active: formData.is_active,
            permissions: formData.permissions
          }]);
        
        if (error) throw error;
        
        // Tutaj można dodać logikę tworzenia konta w Supabase Auth
        
      } else if (selectedUser) {
        // Aktualizacja istniejącego użytkownika
        const { error } = await supabase
          .from('users')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            role: formData.role,
            is_active: formData.is_active,
            permissions: formData.permissions
          })
          .eq('id', selectedUser.id);
        
        if (error) throw error;
      }
      
      await fetchUsers();
      handleCancel();
    } catch (error) {
      console.error('Błąd zapisywania użytkownika:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Błąd usuwania użytkownika:', error);
    }
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setIsAddingUser(false);
    setFormData({
      email: '',
      full_name: '',
      phone: '',
      role: 'viewer',
      is_active: true,
      password: '',
      permissions: []
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getPermissionForModule = (moduleId: string) => {
    return formData.permissions.find(p => p.module === moduleId) || {
      module: moduleId,
      can_view: false,
      can_create: false,
      can_edit: false,
      can_delete: false
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Zarządzanie użytkownikami</h1>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          <UserPlus className="w-5 h-5" />
          Dodaj użytkownika
        </button>
      </div>

      {/* Filtry */}
      <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Szukaj użytkownika..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Wszystkie role</option>
            {PREDEFINED_ROLES.map(role => (
              <option key={role.name} value={role.name}>{role.display_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista użytkowników */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="p-4 border-b border-zinc-700">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Użytkownicy ({filteredUsers.length})
              </h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleEditUser(user)}
                  className={`p-4 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition ${
                    selectedUser?.id === user.id ? 'bg-zinc-700' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{user.full_name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.is_active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.is_active ? 'Aktywny' : 'Nieaktywny'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-full">
                          {PREDEFINED_ROLES.find(r => r.name === user.role)?.display_name || user.role}
                        </span>
                      </div>
                    </div>
                    <Shield className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formularz edycji/dodawania */}
        {(selectedUser || isAddingUser) && (
          <div className="lg:col-span-2">
            <div className="bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">
                  {isAddingUser ? 'Nowy użytkownik' : 'Edycja użytkownika'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Dane podstawowe */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400 uppercase">Dane podstawowe</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Imię i nazwisko
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isAddingUser}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rola
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {PREDEFINED_ROLES.map(role => (
                          <option key={role.name} value={role.name}>
                            {role.display_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {isAddingUser && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Hasło
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-orange-500 bg-zinc-900 border-zinc-700 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-300">
                      Konto aktywne
                    </label>
                  </div>
                </div>

                {/* Uprawnienia */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400 uppercase">Uprawnienia do modułów</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-300">Moduł</th>
                          <th className="text-center py-2 px-3 text-sm font-medium text-gray-300">Podgląd</th>
                          <th className="text-center py-2 px-3 text-sm font-medium text-gray-300">Tworzenie</th>
                          <th className="text-center py-2 px-3 text-sm font-medium text-gray-300">Edycja</th>
                          <th className="text-center py-2 px-3 text-sm font-medium text-gray-300">Usuwanie</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AVAILABLE_MODULES.map(module => {
                          const permission = getPermissionForModule(module.id);
                          return (
                            <tr key={module.id} className="border-b border-zinc-700">
                              <td className="py-3 px-3">
                                <div>
                                  <p className="text-sm font-medium text-white">{module.name}</p>
                                  <p className="text-xs text-gray-400">{module.description}</p>
                                </div>
                              </td>
                              <td className="text-center py-3 px-3">
                                <input
                                  type="checkbox"
                                  checked={permission.can_view}
                                  onChange={(e) => handlePermissionChange(module.id, 'can_view', e.target.checked)}
                                  className="w-4 h-4 text-orange-500 bg-zinc-900 border-zinc-700 rounded focus:ring-orange-500"
                                />
                              </td>
                              <td className="text-center py-3 px-3">
                                <input
                                  type="checkbox"
                                  checked={permission.can_create}
                                  onChange={(e) => handlePermissionChange(module.id, 'can_create', e.target.checked)}
                                  className="w-4 h-4 text-orange-500 bg-zinc-900 border-zinc-700 rounded focus:ring-orange-500"
                                />
                              </td>
                              <td className="text-center py-3 px-3">
                                <input
                                  type="checkbox"
                                  checked={permission.can_edit}
                                  onChange={(e) => handlePermissionChange(module.id, 'can_edit', e.target.checked)}
                                  className="w-4 h-4 text-orange-500 bg-zinc-900 border-zinc-700 rounded focus:ring-orange-500"
                                />
                              </td>
                              <td className="text-center py-3 px-3">
                                <input
                                  type="checkbox"
                                  checked={permission.can_delete}
                                  onChange={(e) => handlePermissionChange(module.id, 'can_delete', e.target.checked)}
                                  className="w-4 h-4 text-orange-500 bg-zinc-900 border-zinc-700 rounded focus:ring-orange-500"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Przyciski akcji */}
                <div className="flex justify-between pt-4">
                  <div>
                    {selectedUser && (
                      <button
                        onClick={() => handleDeleteUser(selectedUser.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Usuń użytkownika
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-zinc-700 text-gray-300 rounded-lg hover:bg-zinc-700 transition"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={handleSaveUser}
                      disabled={saving || !formData.email || !formData.full_name}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Zapisywanie...' : 'Zapisz'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jeśli nie wybrano użytkownika */}
        {!selectedUser && !isAddingUser && (
          <div className="lg:col-span-2">
            <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-12 text-center">
              <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Wybierz użytkownika
              </h3>
              <p className="text-gray-400">
                Kliknij na użytkownika z listy, aby zobaczyć i edytować jego uprawnienia
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Statystyki użytkowników */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Wszyscy użytkownicy</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Aktywni</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.is_active).length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Administratorzy</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Ostatnie logowanie</p>
              <p className="text-sm font-medium text-white">Dziś, 14:23</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;