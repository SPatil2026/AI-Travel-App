import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'expo-router'

export default function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      console.log('Direct sign out attempt');
      setIsSigningOut(true);
      
      // Get a fresh auth instance
      const auth = getAuth();
      console.log('Current user:', auth.currentUser?.email);
      
      // Sign out
      await signOut(auth);
      console.log('Sign out successful');
      
      // Navigate to sign-in screen
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out: ' + error.message);
      setIsSigningOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Profile</Text>
      
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={Colors.PRIMARY} />
        </View>
        <Text style={styles.emailText}>{user?.email || 'User'}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <Pressable style={styles.optionItem}>
          <Ionicons name="settings-outline" size={24} color={Colors.PRIMARY} />
          <Text style={styles.optionText}>Settings</Text>
        </Pressable>
        
        <Pressable style={styles.optionItem}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.PRIMARY} />
          <Text style={styles.optionText}>Help & Support</Text>
        </Pressable>
        
        <Pressable style={styles.optionItem}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.PRIMARY} />
          <Text style={styles.optionText}>About</Text>
        </Pressable>
      </View>

      <Pressable 
        style={styles.signOutButton}
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="red" />
            <Text style={styles.signOutText}>Signing Out...</Text>
          </View>
        ) : (
          <Text style={styles.signOutText}>Sign Out</Text>
        )}
      </Pressable>
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
    marginBottom: 30
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40
  },
  avatarContainer: {
    marginBottom: 15
  },
  emailText: {
    fontFamily: 'outfit-medium',
    fontSize: 18
  },
  optionsContainer: {
    marginBottom: 40
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  optionText: {
    fontFamily: 'outfit',
    fontSize: 16,
    marginLeft: 15
  },
  signOutButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  signOutText: {
    fontFamily: 'outfit-medium',
    color: 'red',
    marginLeft: 8
  },
  disabledButton: {
    opacity: 0.6
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})