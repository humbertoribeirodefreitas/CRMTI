import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users with updated passwords
const demoUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@crm.com',
    role: 'admin',
    password: 'nova123',
  },
  {
    id: '2',
    name: 'Técnico João',
    email: 'joao@crm.com',
    role: 'technician',
    password: 'nova123',
  },
  {
    id: '3',
    name: 'Atendente Maria',
    email: 'maria@crm.com',
    role: 'attendant',
    password: 'nova123',
  },
  {
    id: '4',
    name: 'Humberto',
    email: 'sansunghumberto13@gmail.com',
    role: 'admin',
    password: 'humberto',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = demoUsers.find(u => 
      (u.email === email || u.name.toLowerCase() === email.toLowerCase()) && 
      u.password === password
    );
    
    if (foundUser) {
      const userWithoutPassword = { 
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
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