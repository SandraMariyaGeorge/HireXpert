import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
    <header className="bg-gray-900 text-white p-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold">HireXpert</h1>
      <nav className="flex space-x-4">
          <Link href="/" className="mr-4">Home</Link>
          <Link href="/jobs" className="mr-4">Jobs</Link>
          <Link href="/hrdash" className="mr-4">HR Dashboard</Link>
          <Link href="/hrsignin">Sign In</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;