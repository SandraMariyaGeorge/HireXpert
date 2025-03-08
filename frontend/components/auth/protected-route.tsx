import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/signin'); // Redirect to sign-in if no token is found
      }
    }, [router]);
  
    return children;
  };
  
  export default ProtectedRoute;