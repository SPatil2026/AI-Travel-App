import { db } from '../configs/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

// Collection reference
const getTripsCollection = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return collection(db, 'users', user.uid, 'trips');
};

// Add a trip to Firestore
export const addTripToFirestore = async (trip) => {
  try {
    const tripsCollection = getTripsCollection();
    const tripData = {
      ...trip,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(tripsCollection, tripData);
    return { ...tripData, firestoreId: docRef.id };
  } catch (error) {
    console.error('Error adding trip to Firestore:', error);
    throw error;
  }
};

// Get all trips from Firestore
export const getTripsFromFirestore = async () => {
  try {
    const tripsCollection = getTripsCollection();
    const querySnapshot = await getDocs(tripsCollection);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      firestoreId: doc.id
    }));
  } catch (error) {
    console.error('Error getting trips from Firestore:', error);
    return [];
  }
};

// Delete a trip from Firestore
export const deleteTripFromFirestore = async (firestoreId) => {
  try {
    const tripsCollection = getTripsCollection();
    await deleteDoc(doc(tripsCollection, firestoreId));
    return true;
  } catch (error) {
    console.error('Error deleting trip from Firestore:', error);
    throw error;
  }
};