import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import { useRouter } from 'expo-router'
import { auth } from '../../configs/FirebaseConfig'
import { useTrip } from '../../context/TripContext'
import { useAuthGuard } from '../../hooks/useAuthGuard'

export default function MyTrip() {
  const router = useRouter();
  const { userTrips } = useTrip();
  const { isLoading } = useAuthGuard();  // Add auth guard
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={{ marginTop: 20, fontFamily: 'outfit' }}>Loading...</Text>
      </View>
    );
  }

  const handleAddTrip = () => {
    router.push('/create-trip/search-place');
  };

  const handleTripPress = (tripId) => {
    // Find the trip by ID
    const trip = userTrips.find(t => t.id === tripId);
    if (!trip) {
      console.error('Trip not found:', tripId);
      return;
    }
    
    console.log('Navigating to trip:', trip.destination, 'with ID:', tripId);
    
    // All trips should go to ai-generated now since we store full trip details
    router.push({
      pathname: '/trip-details/ai-generated',
      params: { tripId }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Trips</Text>
      </View>

      {userTrips.length === 0 ? (
        <StartNewTripCard />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {userTrips.map(trip => (
            <TouchableOpacity 
              key={trip.id} 
              style={styles.tripCard}
              onPress={() => handleTripPress(trip.id)}
            >
              <Image 
                source={{ uri: trip.imageUrl || trip.image }} 
                style={styles.tripImage} 
              />
              <View style={styles.tripInfo}>
                <Text style={styles.tripDestination}>{trip.destination}</Text>
                <View style={styles.tripDetails}>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location" size={16} color={Colors.GRAY} />
                    <Text style={styles.tripCountry}>{trip.country}</Text>
                  </View>
                  <Text style={styles.tripDate}>
                    {trip.startDate && trip.endDate ? 
                      `${trip.startDate} - ${trip.endDate}` : 
                      trip.recommendedDuration || '7 days'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 55,
    backgroundColor: Colors.WHITE,
    height: '100%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  headerText: {
    fontFamily: 'outfit-bold',
    fontSize: 35
  },
  tripCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2
  },
  tripImage: {
    width: '100%',
    height: 150
  },
  tripInfo: {
    padding: 15
  },
  tripDestination: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    marginBottom: 5
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tripCountry: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    marginLeft: 5
  },
  tripDate: {
    fontFamily: 'outfit',
    fontSize: 12,
    color: Colors.GRAY
  }
});