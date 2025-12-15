
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType, Speciality } from '../types';
import { authService } from '../services/auth';
// audioManager removed - import when needed

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, provider: 'google' | 'local' = 'local', speciality?: Speciality) => {
    const user = await authService.login(username, provider, speciality);
    setUser(user);
  };

  const register = async (data: { username: string; email: string; speciality: Speciality }) => {
      const user = await authService.register(data);
      setUser(user);
  }

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserXp = async (amount: number) => {
      if (!user) return;
      const updatedUser = await authService.updateXp(amount);
      if (updatedUser) {
          if (updatedUser.level > user.level) {
              // Level Up Sound!
              // audioManager.play('levelup'); // Future implementation
          }
          setUser(updatedUser);
      }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, updateUserXp }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
