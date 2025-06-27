import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function useAuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // User is not authenticated, redirect to sign-in
      router.replace('/(auth)/sign-in');
    }
  }, [user, loading, router]);

  return { isAuthenticated: !!user, isLoading: loading };
}