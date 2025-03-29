"use client"; // Add this directive since this is a Client Component

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of the user object
interface User {
  token: string;
  role: string; 
  name: string; 
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  login: (token: string, role: string,name: string) => void; 
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
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name'); // Retrieve role from localStorage
    if (token && role && name) {
      setUser({ token, role,name });
    }
  }, []);

  const login = (token: string, role: string, name: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role); // Save role to localStorage
    localStorage.setItem('name', name); // Save name to localStorage
    setUser({ token, role, name });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    localStorage.removeItem('name'); // Remove name from localStorage
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