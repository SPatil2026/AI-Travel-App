import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

export default function PlanTrip() {
  const { place, placeId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Plan Your Trip',
      headerTintColor: Colors.PRIMARY
    });
  }, []);

  const handleCreateTrip = () => {
    // In a real app, this would save to a database
    console.log({
      destination: place,
      placeId,
      startDate,
      endDate,
      travelers,
      budget,
      interests
    });
    
    // Navigate to a dummy trip ID for now
    router.push('/trip-details/1');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.destinationText}>Destination: {place}</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Travelers</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            value={travelers}
            onChangeText={setTravelers}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget (USD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your budget"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Interests</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Museums, Food, Nature, etc."
            value={interests}
            onChangeText={setInterests}
            multiline={true}
            numberOfLines={4}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateTrip}
        >
          <Text style={styles.createButtonText}>Create AI Trip Plan</Text>
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
  formContainer: {
    padding: 20
  },
  destinationText: {
    fontFamily: 'outfit-bold',
    fontSize: 22,
    marginBottom: 20
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontFamily: 'outfit',
    fontSize: 16
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  createButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  createButtonText: {
    fontFamily: 'outfit-medium',
    color: Colors.WHITE,
    fontSize: 16
  }
});