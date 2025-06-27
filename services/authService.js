import { signOut, getAuth } from 'firebase/auth';

/**
 * Simple sign-out function that handles Firebase Auth sign out
 */
export const signOutUser = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};