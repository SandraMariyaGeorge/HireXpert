'use client'; 
import { useAuth } from '@/context/AuthContext'; // Adjust the import path
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/'); // Redirect to login if not authenticated
    } else if (role && user.role !== role) {
      router.push('/'); // Redirect if the user doesn't have the required role
    }
    else {
      // User is authenticated and role matches, allow access
      setIsLoading(false);
      if (user.role === 'candidate') {
        const currentPath = window.location.pathname; // Capture the current path
        router.push(currentPath); // Redirect to the current path
      } else if (user.role === 'hr') {
        const currentPath = window.location.pathname; // Capture the current path
        router.push(currentPath);
      }
    }
  }, [user, router, role]);

  if (!user || (role && user.role !== role)) {
    return null; // Return null if the user is not authenticated or doesn't have the required role
  }
  if (isLoading) {
    // Show a loading spinner or nothing while checking auth state
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
