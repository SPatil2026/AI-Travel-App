import { auth } from '../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store session token
export const storeSession = async () => {
  try {
    if (auth.currentUser) {
      // Store user email and UID
      await AsyncStorage.setItem('userEmail', auth.currentUser.email || '');
      await AsyncStorage.setItem('userId', auth.currentUser.uid);
      await AsyncStorage.setItem('userLoggedIn', 'true');
      console.log('Session stored');
    }
  } catch (error) {
    console.error('Error storing session:', error);
  }
};

// Clear session completely
export const clearSession = async () => {
  try {
    // Clear all session data
    const keys = [
      'userEmail',
      'userId',
      'userLoggedIn',
      'userTrips',
      'selectedTrip'
    ];
    await AsyncStorage.multiRemove(keys);
    console.log('Session cleared completely');
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    return false;
  }
};