import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

export default function TripDetails() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  // This would typically come from a database or API
  const tripDetails = {
    id: id,
    destination: 'Paris',
    country: 'France',
    startDate: '2023-08-15',
    endDate: '2023-08-22',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    activities: [
      { id: 1, name: 'Eiffel Tower', time: '10:00 AM', day: 'Day 1' },
      { id: 2, name: 'Louvre Museum', time: '2:00 PM', day: 'Day 1' },
      { id: 3, name: 'Notre Dame Cathedral', time: '10:00 AM', day: 'Day 2' },
      { id: 4, name: 'Seine River Cruise', time: '7:00 PM', day: 'Day 2' },
    ]
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: Colors.WHITE
    });
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image 
        source={{ uri: tripDetails.image }} 
        style={styles.headerImage} 
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.destinationTitle}>{tripDetails.destination}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color={Colors.GRAY} />
          <Text style={styles.countryText}>{tripDetails.country}</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Start Date</Text>
            <Text style={styles.dateValue}>{tripDetails.startDate}</Text>
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>End Date</Text>
            <Text style={styles.dateValue}>{tripDetails.endDate}</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Itinerary</Text>
        
        {tripDetails.activities.map(activity => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityTimeContainer}>
              <Text style={styles.activityDay}>{activity.day}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityName}>{activity.name}</Text>
            </View>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => console.log('Edit trip')}
        >
          <Text style={styles.editButtonText}>Edit Trip</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE
  },
  headerImage: {
    width: '100%',
    height: 300
  },
  contentContainer: {
    padding: 20,
    marginTop: -30,
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  destinationTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 28,
    marginBottom: 5
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  countryText: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    marginLeft: 5
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15
  },
  dateBox: {
    alignItems: 'center'
  },
  dateLabel: {
    fontFamily: 'outfit',
    color: Colors.GRAY,
    fontSize: 14
  },
  dateValue: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginTop: 5
  },
  sectionTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 22,
    marginBottom: 15
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden'
  },
  activityTimeContainer: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activityDay: {
    fontFamily: 'outfit-medium',
    color: Colors.WHITE,
    fontSize: 14
  },
  activityTime: {
    fontFamily: 'outfit',
    color: Colors.WHITE,
    fontSize: 12,
    marginTop: 5
  },
  activityContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center'
  },
  activityName: {
    fontFamily: 'outfit-medium',
    fontSize: 16
  },
  editButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  editButtonText: {
    fontFamily: 'outfit-medium',
    color: Colors.WHITE,
    fontSize: 16
  }
});