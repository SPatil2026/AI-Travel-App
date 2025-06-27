import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import RecommendedTrip from '../../components/Discover/RecommendedTrip'
import { useRouter } from 'expo-router'
import { getDestinationRecommendations, searchNearbyAttractions } from '../../services/geminiService'
import { useTrip } from '../../context/TripContext'

export default function Discover() {
  const router = useRouter();
  const { aiRecommendations, storeAiRecommendations } = useTrip();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const categories = [
    'Popular', 'Beach', 'Mountain', 'City', 'Cultural', 'Adventure'
  ];

  const [activeCategory, setActiveCategory] = useState('Popular');

  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  const fetchAIRecommendations = async () => {
    try {
      setLoading(true);
      const recommendations = await getDestinationRecommendations({
        interests: [activeCategory !== 'Popular' ? activeCategory.toLowerCase() : 'travel'],
        budget: 'medium',
        season: 'summer',
        tripDuration: '7 days'
      });
      // Store recommendations in the context so they can be accessed from other screens
      storeAiRecommendations(recommendations);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category !== 'Popular') {
      fetchAIRecommendations();
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        setSearching(true);
        setSearchResults([]);
        const attractions = await searchNearbyAttractions(searchQuery);
        setSearchResults(attractions);
      } catch (error) {
        console.error('Error searching attractions:', error);
      } finally {
        setSearching(false);
      }
    }
  };

  const handleTripPress = (trip) => {
    // Navigate to the trip details page with the trip ID
    router.push({
      pathname: '/trip-details/ai-generated',
      params: { tripId: trip.id }
    });
  };

  const renderAIRecommendations = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Generating recommendations...</Text>
        </View>
      );
    }

    return aiRecommendations.map(trip => (
      <TouchableOpacity 
        key={trip.id} 
        style={styles.tripCard}
        onPress={() => handleTripPress(trip)}
      >
        <Image 
          source={{ uri: trip.imageUrl }} 
          style={styles.tripImage} 
        />
        <View style={styles.tripInfo}>
          <Text style={styles.tripDestination}>{trip.destination}</Text>
          <View style={styles.tripDetails}>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color={Colors.GRAY} />
              <Text style={styles.tripCountry}>{trip.country}</Text>
            </View>
            <Text style={styles.tripBudget}>{trip.budget.averageDailyExpense}/day</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  const renderSearchResults = () => {
    if (searching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Searching attractions...</Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return null;
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Attractions near {searchQuery}</Text>
        {searchResults.map(attraction => (
          <TouchableOpacity 
            key={attraction.id} 
            style={styles.attractionCard}
          >
            <Image 
              source={{ uri: attraction.imageUrl }} 
              style={styles.attractionImage} 
            />
            <View style={styles.attractionInfo}>
              <Text style={styles.attractionName}>{attraction.name}</Text>
              <Text style={styles.attractionDescription}>{attraction.description}</Text>
              <View style={styles.attractionDetails}>
                <Text style={styles.attractionCategory}>{attraction.category}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.attractionRating}>{attraction.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Discover</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search attractions by location"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>
      
      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(category => (
          <TouchableOpacity 
            key={category} 
            style={[styles.categoryButton, activeCategory === category && styles.activeCategoryButton]}
            onPress={() => handleCategoryChange(category)}
          >
            <Text style={[styles.categoryText, activeCategory === category && styles.activeCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {searchResults.length > 0 ? (
          renderSearchResults()
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Recommended Trips</Text>
              <TouchableOpacity onPress={fetchAIRecommendations}>
                <Ionicons name="refresh" size={20} color={Colors.PRIMARY} />
              </TouchableOpacity>
            </View>
            {renderAIRecommendations()}
          </>
        )}
      </ScrollView>
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
  headerText: {
    fontFamily: 'outfit-bold',
    fontSize: 35,
    marginBottom: 20
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontFamily: 'outfit',
    fontSize: 16,
    marginRight: 10
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoriesContainer: {
    marginBottom: 20
  },
  categoriesContent: {
    paddingRight: 20
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0'
  },
  activeCategoryButton: {
    backgroundColor: Colors.PRIMARY
  },
  categoryText: {
    fontFamily: 'outfit-medium',
    color: Colors.GRAY
  },
  activeCategoryText: {
    color: Colors.WHITE
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 20
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontFamily: 'outfit-medium',
    marginTop: 10,
    color: Colors.GRAY
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
    height: 180,
    resizeMode: 'cover'
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
  tripBudget: {
    fontFamily: 'outfit-medium',
    color: Colors.PRIMARY
  },
  attractionCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    flexDirection: 'row',
    height: 120
  },
  attractionImage: {
    width: 120,
    height: '100%'
  },
  attractionInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between'
  },
  attractionName: {
    fontFamily: 'outfit-bold',
    fontSize: 16
  },
  attractionDescription: {
    fontFamily: 'outfit',
    fontSize: 12,
    color: Colors.GRAY,
    marginVertical: 5,
    flex: 1
  },
  attractionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  attractionCategory: {
    fontFamily: 'outfit',
    fontSize: 12,
    color: Colors.PRIMARY,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  attractionRating: {
    fontFamily: 'outfit-medium',
    fontSize: 12,
    marginLeft: 3
  }
})