import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { getDestinationRecommendation } from '../../services/geminiService'

export default function AIRecommendation() {
  const navigation = useNavigation();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'AI Recommendation',
      headerTintColor: Colors.PRIMARY
    });
    
    fetchRecommendation();
  }, []);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      const data = await getDestinationRecommendation({
        interests: ['culture', 'food', 'history'],
        budget: 'medium',
        season: 'summer',
        tripDuration: '7 days'
      });
      setRecommendation(data);
    } catch (err) {
      console.error('Error fetching recommendation:', err);
      setError('Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = () => {
    // In a real app, this would save the recommendation to the user's trips
    router.push('/trip-details/ai-generated');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Generating your perfect destination...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color={Colors.PRIMARY} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRecommendation}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {recommendation && (
        <>
          <Image 
            source={{ uri: recommendation.imageUrl }} 
            style={styles.destinationImage} 
          />
          
          <View style={styles.contentContainer}>
            <Text style={styles.destinationTitle}>{recommendation.destination}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={Colors.GRAY} />
              <Text style={styles.countryText}>{recommendation.country}</Text>
            </View>
            
            <Text style={styles.description}>{recommendation.description}</Text>
            
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Best Time to Visit</Text>
              <Text style={styles.infoText}>{recommendation.bestTimeToVisit}</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Budget</Text>
              <Text style={styles.infoText}>
                Daily: {recommendation.budget.averageDailyExpense}{'\n'}
                Total: {recommendation.budget.totalEstimate}
              </Text>
            </View>
            
            <Text style={styles.sectionTitle}>Recommended Trip Plan</Text>
            {recommendation.tripPlan.map((day, index) => (
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
              {recommendation.mustSeeAttractions.map((attraction, index) => (
                <View key={index} style={styles.attractionItem}>
                  <Ionicons name="star" size={16} color={Colors.PRIMARY} />
                  <Text style={styles.attractionText}>{attraction}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Local Tips</Text>
            <View style={styles.tipsContainer}>
              {recommendation.localTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Ionicons name="information-circle" size={16} color={Colors.PRIMARY} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.createTripButton}
              onPress={handleCreateTrip}
            >
              <Text style={styles.createTripButtonText}>Create Trip from Recommendation</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.newRecommendationButton}
              onPress={fetchRecommendation}
            >
              <Text style={styles.newRecommendationButtonText}>Get New Recommendation</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    padding: 20
  },
  errorText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10
  },
  retryButtonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-medium',
    fontSize: 16
  },
  destinationImage: {
    width: '100%',
    height: 250
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40
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
  createTripButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15
  },
  createTripButtonText: {
    fontFamily: 'outfit-medium',
    color: Colors.WHITE,
    fontSize: 16
  },
  newRecommendationButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  newRecommendationButtonText: {
    fontFamily: 'outfit-medium',
    color: Colors.PRIMARY,
    fontSize: 16
  }
});