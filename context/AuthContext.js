import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // Force navigation to sign-in screen
      setTimeout(() => {
        router.replace('/(auth)/sign-in');
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw to allow handling in components
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut: handleSignOut,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;