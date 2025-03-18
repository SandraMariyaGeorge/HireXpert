import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
    const { logout } = useAuth(); 
    return (
    <header className="bg-gray-900 text-white p-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold">HireXpert</h1>
      <nav className="flex space-x-4">
          <Link href="/hrdash" className="mr-4">Home</Link>
          <Link href="/hrdash/jobs" className="mr-4">Jobs</Link>
          <Link href="/hrdash" className="mr-4">HR Dashboard</Link>
        </nav>
        <Button className="bg-white-400 hover:bg-white p-2 rounded-full" onClick={() => logout()}>
          <LogOut className="text-white" />
        </Button>
      </div>
    </header>
  );
};

export default Header;