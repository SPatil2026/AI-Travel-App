import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'

export default function StartNewTripCard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="airplane" size={40} color={Colors.PRIMARY} />
      </View>
      
      <Text style={styles.title}>No trips planned yet</Text>
      
      <Text style={styles.description}>
        Looks like it's time to plan a new travel experience! Get started below
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/create-trip/search-place')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Start a new trip</Text>
      </TouchableOpacity>
      
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2035&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative'
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  description: {
    fontSize: 16,
    fontFamily: 'outfit',
    textAlign: 'center',
    color: Colors.GRAY,
    marginBottom: 25,
    paddingHorizontal: 20
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 3
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-medium',
    fontSize: 16
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    opacity: 0.2
  }
});