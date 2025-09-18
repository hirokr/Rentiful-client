'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'tenant' | 'manager';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Store the current path for redirect after login
      const currentPath = window.location.pathname;
      if (currentPath !== '/auth/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      router.push('/auth/login');
      return;
    }

    if (!loading && requiredRole && user?.role !== requiredRole) {
      router.push('/dashboard'); // Redirect to dashboard if role doesn't match
      return;
    }
  }, [isAuthenticated, user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}