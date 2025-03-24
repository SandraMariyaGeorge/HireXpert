import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-black text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md hover:bg-gray-900" onClick={toggleSidebar}>
            <Menu className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-xl font-bold">HireXpert</h1>
        </div>
        <div className="ml-auto">
          <Button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full" onClick={() => logout()}>
            <LogOut className="text-white" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;