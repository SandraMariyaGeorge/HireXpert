"use client"; // Add this directive since this is a Client Component

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of the user object
interface User {
  token: string;
  role: string; 
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  login: (token: string, role: string) => void; 
  logout: () => void;
}

// Create the context with an initial value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if the user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Retrieve role from localStorage
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role); // Save role to localStorage
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    window.location.href = '/';
    setUser(null);
  };

  // Provide the context value to the children
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};