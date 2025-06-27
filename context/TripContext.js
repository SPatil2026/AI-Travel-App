import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { addTripToFirestore, getTripsFromFirestore, deleteTripFromFirestore } from '../services/firebaseService';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // Load saved trips from Firebase on app start
  useEffect(() => {
    const loadSavedData = async () => {
      try {        
        // Load user trips from Firebase if user is logged in
        if (auth.currentUser) {
          const firebaseTrips = await getTripsFromFirestore();
          setUserTrips(firebaseTrips);
        }
      } catch (error) {
        console.error('Error loading saved trips:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSavedData();
    
    // Listen for auth state changes to reload trips or clear data
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadSavedData();
      } else {
        // User signed out, clear data from state
        setUserTrips([]);
        setSelectedTrip(null);
        setAiRecommendations([]);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Store AI recommendations
  const storeAiRecommendations = (recommendations) => {
    setAiRecommendations(recommendations);
  };

  // Get a specific AI recommendation by ID
  const getAiRecommendation = (id) => {
    return aiRecommendations.find(trip => trip.id === id) || null;
  };

  // Add a trip to user's trips and Firebase
  const addToUserTrips = async (trip) => {
    // Check if trip already exists in userTrips by destination and country
    const existingTrip = userTrips.find(
      t => t.destination === trip.destination && t.country === trip.country
    );
    
    if (existingTrip) {
      return existingTrip; // Don't add duplicate trips
    }
    
    // Create a new trip with guaranteed unique ID
    const tripToAdd = {
      ...trip,
      id: `${trip.destination.toLowerCase().replace(/\s+/g, '-')}_${Date.now()}`,
      addedAt: new Date().toISOString(),
      tripPlan: trip.tripPlan || [],
      mustSeeAttractions: trip.mustSeeAttractions || [],
      localTips: trip.localTips || []
    };
    
    try {
      // Add to Firebase
      const firestoreTrip = await addTripToFirestore(tripToAdd);
      tripToAdd.firestoreId = firestoreTrip.firestoreId;
      setUserTrips(prevTrips => [...prevTrips, tripToAdd]);
      return tripToAdd;
    } catch (error) {
      console.error('Error adding trip to Firebase:', error);
      throw error;
    }
  };

  // Remove a trip from user's trips and Firebase
  const removeFromUserTrips = async (tripId) => {
    // Find the trip to get its Firestore ID
    const tripToRemove = userTrips.find(trip => trip.id === tripId);
    
    if (!tripToRemove?.firestoreId) return;
    
    try {
      // Remove from Firebase
      await deleteTripFromFirestore(tripToRemove.firestoreId);
      // Update state after successful deletion
      setUserTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
    } catch (error) {
      console.error('Error removing trip from Firebase:', error);
      throw error;
    }
  };

  // Set the currently selected trip
  const selectTrip = (trip) => {
    setSelectedTrip(trip);
  };

  return (
    <TripContext.Provider
      value={{
        aiRecommendations,
        userTrips,
        selectedTrip,
        loading,
        storeAiRecommendations,
        getAiRecommendation,
        addToUserTrips,
        removeFromUserTrips,
        selectTrip
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);

export default TripContext;