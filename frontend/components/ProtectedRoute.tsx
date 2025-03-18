'use client'; 
import { useAuth } from '@/context/AuthContext'; // Adjust the import path
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/'); // Redirect to login if not authenticated
    } else if (role && user.role !== role) {
      router.push('/'); // Redirect if the user doesn't have the required role
    }
  }, [user, router, role]);

  if (!user || (role && user.role !== role)) {
    return null; // Return null if the user is not authenticated or doesn't have the required role
  }

  return <>{children}</>;
}