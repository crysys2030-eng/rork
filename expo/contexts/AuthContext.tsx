import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';

export type UserRole = 'guest' | 'user' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (userData: Partial<User>) => Promise<void>;
};

const STORAGE_KEY = '@auth_user';
const USERS_STORAGE_KEY = '@registered_users';

const ADMIN_CREDENTIALS = {
  email: 'admin@app.com',
  password: 'admin123',
};

export const [AuthProvider, useAuth] = createContextHook<AuthState>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const saveUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Admin',
          email: ADMIN_CREDENTIALS.email,
          role: 'admin',
        };
        await saveUser(adminUser);
        return { success: true };
      }

      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const registeredUsers: { email: string; password: string; name: string }[] = usersData ? JSON.parse(usersData) : [];
      
      const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData: User = {
          id: `user-${Date.now()}`,
          name: foundUser.name,
          email: foundUser.email,
          role: 'user',
        };
        await saveUser(userData);
        return { success: true };
      }

      return { success: false, error: 'Email ou senha incorretos' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  }, [saveUser]);

  const loginAsGuest = useCallback(async () => {
    const guestUser: User = {
      id: `guest-${Date.now()}`,
      name: 'Convidado',
      email: 'guest@app.com',
      role: 'guest',
    };
    await saveUser(guestUser);
  }, [saveUser]);

  const logout = useCallback(async () => {
    try {
      console.log('Removendo utilizador do storage...');
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Utilizador removido do storage');
      setUser(null);
      console.log('Estado do utilizador limpo');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const registeredUsers: { email: string; password: string; name: string }[] = usersData ? JSON.parse(usersData) : [];
      
      if (registeredUsers.some(u => u.email === email)) {
        return { success: false, error: 'Este email já está registado' };
      }

      registeredUsers.push({ email, password, name });
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
      
      const userData: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: 'user',
      };
      await saveUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Erro ao criar conta' };
    }
  }, [saveUser]);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    try {
      setUser(currentUser => {
        if (!currentUser) return currentUser;
        return { ...currentUser, ...userData };
      });
      
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = { ...parsedUser, ...userData };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        console.log('Utilizador atualizado:', updatedUser);
      }
    } catch (error) {
      console.error('Erro ao atualizar utilizador:', error);
      throw error;
    }
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginAsGuest,
    logout,
    register,
    updateUser,
  };
});
