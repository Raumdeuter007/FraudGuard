import { useState } from 'react';
import { AuthContext } from './AuthContextDef';
import type { User } from '../types/user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  );
  const [user, setUser] = useState<User | null>(null);

  const setAuth = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}