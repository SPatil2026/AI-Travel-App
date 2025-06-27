import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useTrip } from '../../context/TripContext'

export default function AIGeneratedTripDetails() {
  const { tripId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const { aiRecommendations, addToUserTrips, userTrips, removeFromUserTrips } = useTrip();
  
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState(null);
  const [addingTrip, setAddingTrip] = useState(false);
  const [tripAdded, setTripAdded] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: Colors.WHITE
    });
  }, []);
  
  // Check if trip is in user trips whenever userTrips, tripId, or tripDetails changes
  useEffect(() => {
    if (tripId && tripDetails && userTrips) {
      // Check by ID first
      let isAdded = userTrips.some(trip => trip.id === tripId);
      
      // If not found by ID, check by destination and country (for trips with changed IDs)
      if (!isAdded && tripDetails) {
        isAdded = userTrips.some(
          trip => trip.destination === tripDetails.destination && 
                 trip.country === tripDetails.country
        );
      }
      
      console.log('Trip added state:', isAdded);
      setTripAdded(isAdded);
    }
  }, [userTrips, tripId, tripDetails]);
  
  // Load trip details from userTrips, recommendations or fallback
  useEffect(() => {
    // Find the selected trip from various sources
    const findTrip = () => {
      // First check if this is a trip from user's saved trips
      if (userTrips && userTrips.length > 0) {
        const savedTrip = userTrips.find(t => t.id === tripId);
        if (savedTrip) {
          console.log('Found trip in userTrips:', savedTrip.destination);
          setTripDetails(savedTrip);
          setLoading(false);
          return;
        }
      }
      // Then try to find the trip in AI recommendations
      if (aiRecommendations && aiRecommendations.length > 0) {
        const trip = aiRecommendations.find(t => t.id === tripId);
        if (trip) {
          console.log('Found trip in aiRecommendations:', trip.destination);
          setTripDetails(trip);
          setLoading(false);
          return;
        }
      }
      
      // If not found, use fallback trips
      const fallbackTrips = [
        {
          id: "paris_france_" + Date.now() + "_1",
          destination: "Paris",
          country: "France",
          description: "The City of Light offers iconic landmarks, world-class cuisine, and romantic ambiance. Perfect for art lovers and history enthusiasts.",
          imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
          budget: {
            currency: "USD",
            averageDailyExpense: "$150-$250",
            totalEstimate: "$1,050-$1,750 for 7 days"
          },
          bestTimeToVisit: "April to June or September to October",
          recommendedDuration: "5-7 days",
          tripPlan: [
            {day: 1, activities: ["Eiffel Tower", "Seine River Cruise", "Dinner in Montmartre"]},
            {day: 2, activities: ["Louvre Museum", "Tuileries Garden", "Champs-Élysées shopping"]}
          ],
          mustSeeAttractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral"],
          localTips: ["Buy a Paris Museum Pass for better value", "Use the Metro for transportation"]
        },
        {
          id: "tokyo_japan_" + Date.now() + "_2",
          destination: "Tokyo",
          country: "Japan",
          description: "A vibrant metropolis blending ultramodern and traditional, from neon-lit skyscrapers to historic temples. Experience unique culture, technology, and cuisine.",
          imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop",
          budget: {
            currency: "USD",
            averageDailyExpense: "$100-$200",
            totalEstimate: "$700-$1,400 for 7 days"
          },
          bestTimeToVisit: "March to May or September to November",
          recommendedDuration: "7-10 days",
          tripPlan: [
            {day: 1, activities: ["Senso-ji Temple", "Tokyo Skytree", "Akihabara district"]},
            {day: 2, activities: ["Meiji Shrine", "Harajuku", "Shibuya Crossing"]}
          ],
          mustSeeAttractions: ["Tokyo Tower", "Imperial Palace", "Shinjuku Gyoen National Garden"],
          localTips: ["Get a Suica or Pasmo card for public transport", "Try conveyor belt sushi restaurants for affordable meals"]
        }
      ];
      
      // Try to find a matching fallback trip or use the first one
      const fallbackTrip = fallbackTrips.find(t => t.id === tripId) || fallbackTrips[0];
      console.log('Using fallback trip:', fallbackTrip.destination);
      setTripDetails(fallbackTrip);
      setLoading(false);
    };
    
    // Wait a bit to simulate loading
    setTimeout(findTrip, 500);
  }, [tripId, aiRecommendations, userTrips]);

  const handleAddToMyTrips = async () => {
    // Show loading state
    setAddingTrip(true);
    
    try {
      // Add the trip to user trips using the context and get the added trip with new ID
      const addedTrip = await addToUserTrips(tripDetails);
      
      // Update tripId to match the new ID if it was changed
      if (addedTrip.id !== tripId) {
        console.log('Trip added with new ID:', addedTrip.id);
        // Update tripDetails with the new ID to ensure UI updates correctly
        setTripDetails(addedTrip);
      }
      
      // Set added state immediately for UI feedback
      setTripAdded(true);
      
      // Show success message
      Alert.alert(
        "Trip Added",
        `${tripDetails.destination} has been added to your trips!`,
        [
          { 
            text: "View My Trips", 
            onPress: () => router.push('/mytrip')
          },
          {
            text: "OK",
            style: "cancel"
          }
        ]
      );
    } catch (error) {
      console.error('Error adding trip:', error);
      Alert.alert(
        "Error",
        "There was a problem adding this trip. Please try again."
      );
    } finally {
      // Hide loading state
      setAddingTrip(false);
    }
  };
  
  const handleRemoveTrip = async () => {
    // Find the trip in userTrips to get the correct ID
    const tripToRemove = userTrips.find(trip => 
      trip.destination === tripDetails.destination && 
      trip.country === tripDetails.country
    );
    
    if (tripToRemove) {
      try {
        // Remove the trip using its actual ID in userTrips
        await removeFromUserTrips(tripToRemove.id);
        setTripAdded(false);
        
        // Show success message
        Alert.alert(
          "Trip Removed",
          `${tripDetails.destination} has been removed from your trips.`,
          [{ text: "OK" }]
        );
      } catch (error) {
        console.error('Error removing trip:', error);
        Alert.alert(
          "Error",
          "There was a problem removing this trip. Please try again."
        );
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image 
        source={{ uri: tripDetails.imageUrl }} 
        style={styles.headerImage} 
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.destinationTitle}>{tripDetails.destination}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color={Colors.GRAY} />
          <Text style={styles.countryText}>{tripDetails.country}</Text>
        </View>
        
        <Text style={styles.description}>{tripDetails.description}</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Best Time to Visit</Text>
          <Text style={styles.infoText}>{tripDetails.bestTimeToVisit}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Budget</Text>
          <Text style={styles.infoText}>
            Daily: {tripDetails.budget.averageDailyExpense}{'\n'}
            Total: {tripDetails.budget.totalEstimate}
          </Text>
        </View>
        
        <Text style={styles.sectionTitle}>Recommended Trip Plan</Text>
        {tripDetails.tripPlan.map((day, index) => (
          <View key={index} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayText}>Day {day.day}</Text>
            </View>
            <View style={styles.activitiesList}>
              {day.activities.map((activity, actIndex) => (
                <View key={actIndex} style={styles.activityItem}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.PRIMARY} />
                  <Text style={styles.activityText}>{activity}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Must-See Attractions</Text>
        <View style={styles.attractionsContainer}>
          {tripDetails.mustSeeAttractions.map((attraction, index) => (
            <View key={index} style={styles.attractionItem}>
              <Ionicons name="star" size={16} color={Colors.PRIMARY} />
              <Text style={styles.attractionText}>{attraction}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Local Tips</Text>
        <View style={styles.tipsContainer}>
          {tripDetails.localTips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Ionicons name="information-circle" size={16} color={Colors.PRIMARY} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
        
        {tripAdded ? (
          <View>
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={24} color="green" />
              <Text style={styles.successText}>Added to My Trips</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={handleRemoveTrip}
            >
              <View style={styles.removeButtonContent}>
                <Ionicons name="trash-outline" size={20} color={Colors.WHITE} />
                <Text style={styles.removeButtonText}>Remove from My Trips</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.addTripButton, addingTrip && styles.disabledButton]}
            onPress={handleAddToMyTrips}
            disabled={addingTrip}
          >
            {addingTrip ? (
              <View style={styles.loadingButtonContent}>
                <ActivityIndicator size="small" color={Colors.WHITE} />
                <Text style={styles.addTripButtonText}>Adding trip...</Text>
              </View>
            ) : (
              <Text style={styles.addTripButtonText}>Add to My Trips</Text>
            )}
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Discover</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    padding: 20
  },
  loadingText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center'
  },
  headerImage: {
    width: '100%',
    height: 250
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.WHITE
  },
  destinationTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 28,
    marginBottom: 5
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  countryText: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    marginLeft: 5
  },
  description: {
    fontFamily: 'outfit',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20
  },
  sectionTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10
  },
  infoText: {
    fontFamily: 'outfit',
    fontSize: 16,
    lineHeight: 24
  },
  dayCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden'
  },
  dayHeader: {
    backgroundColor: Colors.PRIMARY,
    padding: 10
  },
  dayText: {
    fontFamily: 'outfit-medium',
    color: Colors.WHITE,
    fontSize: 16
  },
  activitiesList: {
    padding: 15
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  activityText: {
    fontFamily: 'outfit',
    fontSize: 16,
    marginLeft: 10
  },
  attractionsContainer: {
    marginBottom: 20
  },
  attractionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  attractionText: {
    fontFamily: 'outfit',
    fontSize: 16,
    marginLeft: 10
  },
  tipsContainer: {
    marginBottom: 30
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  tipText: {
    fontFamily: 'outfit',
    fontSize: 16,
    marginLeft: 10,
    flex: 1
  },
  addTripButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15
  },
  addTripButtonText: {
    fontFamily: 'outfit-medium',
    color: Colors.WHITE,
    fontSize: 16
  },
  disabledButton: {
    backgroundColor: Colors.PRIMARY,
    opacity: 0.7
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#e6f7e6',
    padding: 10,
    borderRadius: 10
  },
  successText: {
    fontFamily: 'outfit-medium',
    color: 'green',
    fontSize: 16,
    marginLeft: 8
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15
  },
  removeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeButtonText: {
    fontFamily: 'outfit-medium',
    color: Colors.WHITE,
    fontSize: 16,
    marginLeft: 8
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  backButtonText: {
    fontFamily: 'outfit-medium',
    color: Colors.PRIMARY,
    fontSize: 16
  }
});