import { View, Text, TextInput, StyleSheet, ToastAndroid, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'

import { Colors } from './../../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

export default function SignIn() {
  const navigation=useNavigation();
  const router=useRouter();

  const [email,setEmail]=useState();
  const [password,setPassword]=useState();


  useEffect(()=>{
    navigation.setOptions({
      headerShown:false
    })
  },[])

  const onSignIn=()=>{

    if(!email || !password){
      ToastAndroid.show("Please Enter Email and Password",ToastAndroid.BOTTOM)
      return;
    }

    // Show loading indicator or disable button here if needed
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in - Firebase will handle persistence automatically
        const user = userCredential.user;
        
        // Navigate to app
        router.replace('/mytrip')
        console.log('User signed in:', user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, error.code);
        
        // Handle different error codes
        if(errorCode === 'auth/invalid-credential' || errorCode === 'auth/invalid-email' || errorCode === 'auth/wrong-password'){
          ToastAndroid.show("Invalid Email or Password", ToastAndroid.LONG);
        } else if(errorCode === 'auth/user-not-found') {
          ToastAndroid.show("User not found", ToastAndroid.LONG);
        } else if(errorCode === 'auth/too-many-requests') {
          ToastAndroid.show("Too many failed login attempts. Please try again later", ToastAndroid.LONG);
        } else {
          ToastAndroid.show("Sign in failed. Please try again.", ToastAndroid.LONG);
        }
      });
  }

  return (
    <View style={{
      padding:25,
      paddingTop:40,
      backgroundColor:Colors.WHITE,
      height:"100%"
    }}>
      <Pressable onPress={()=>router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:30,
        marginTop:30
      }}>Let's Sign You In</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:30,
        color:Colors.GRAY,
        marginTop:20
      }}>Welcome Back</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:30,
        color:Colors.GRAY,
        marginTop:10
      }}>You've been missed!</Text>

      {/* Email */}
      <View style={{
        marginTop:50
      }}>
        <Text style={{
          fontFamily:"outfit"
        }}>Email</Text>
        <TextInput
        style={styles.input}
        onChangeText={(value)=>setEmail(value)}
        placeholder='Enter Email'
        verticalAlign="middle"/>
      </View>
      
      {/* Password */}
      <View style={{
        marginTop:20
      }}>
        <Text style={{
          fontFamily:"outfit"
        }}>Password</Text>
        <TextInput
        secureTextEntry={true}
        style={styles.input} 
        onChangeText={(value)=>setPassword(value)}
        placeholder='Enter Password'
        verticalAlign="middle"/>
      </View>
      
      {/* Sign-in button */}
      <Pressable onPress={onSignIn} style={{
        backgroundColor:Colors.PRIMARY,
        padding:20,
        borderRadius:15,
        marginTop:50,
      }}>
        <Text style={{
          color:Colors.WHITE,
          textAlign:'center'
        }}>Sign In</Text>
      </Pressable>

      {/* Create Account button */}
      <Pressable 
      onPress={()=>router.replace('/(auth)/sign-up')}
      style={{
        backgroundColor:Colors.WHITE,
        padding:20,
        borderRadius:15,
        marginTop:20,
        borderWidth:1,
      }}>
        <Text style={{
          color:Colors.PRIMARY,
          textAlign:'center'
        }}>Create an Account</Text>
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  input:{
    borderWidth:1,
    padding:15,
    borderRadius:15,
    borderColor:Colors.GRAY,
    fontFamily:"outfit"
  }
})
