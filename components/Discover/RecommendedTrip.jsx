import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function RecommendedTrip({ trip }) {
  const router = useRouter();

  const handlePress = () => {
    // In a real app, this would create a trip based on the recommendation
    router.push(`/trip-details/${trip.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
    >
      <Image 
        source={{ uri: trip.image }} 
        style={styles.image} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{trip.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color={Colors.GRAY} />
          <Text style={styles.country}>{trip.country}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover'
  },
  infoContainer: {
    padding: 15
  },
  name: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    marginBottom: 5
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  country: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    marginLeft: 5
  }
});