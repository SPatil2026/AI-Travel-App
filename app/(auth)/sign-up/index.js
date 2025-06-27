import { View, Text, TextInput, StyleSheet, ToastAndroid, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Colors } from './../../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

export default function SignUp() {
  const navigation=useNavigation();
  const router=useRouter();

  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const [fullName,setFullName]=useState();

  useEffect(()=>{
    navigation.setOptions({
      headerShown:false
    })
  },[])

  const OnCreateAccount=()=>{

    if(!email || !password || !fullName){
      ToastAndroid.show('Please enter all details',ToastAndroid.BOTTOM)
      return;
    }

    // Password validation
    if(password.length < 6) {
      ToastAndroid.show('Password must be at least 6 characters',ToastAndroid.BOTTOM)
      return;
    }

    // Show loading indicator or disable button here if needed
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up - Firebase will handle persistence automatically
        const user = userCredential.user;
        console.log('User created:', user.email);
        router.replace('/mytrip')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
        
        // Handle different error codes
        if(errorCode === 'auth/email-already-in-use'){
          ToastAndroid.show("Email already in use", ToastAndroid.LONG);
        } else if(errorCode === 'auth/invalid-email') {
          ToastAndroid.show("Invalid email address", ToastAndroid.LONG);
        } else if(errorCode === 'auth/weak-password') {
          ToastAndroid.show("Password is too weak", ToastAndroid.LONG);
        } else {
          ToastAndroid.show("Sign up failed. Please try again.", ToastAndroid.LONG);
        }
      });

  }

  return (
    <View style={{
      padding:25,
      paddingTop:40,
      backgroundColor:Colors.WHITE,
      height:'100%'
    }}>
      <Pressable onPress={()=>router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>

      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:30,
        marginTop:30
      }}>Create New Account</Text>

      {/* User full name*/}
      <View style={{
        marginTop:50
      }}>
        <Text style={{
          fontFamily:"outfit"
        }}>Full Name</Text>
        <TextInput
        style={styles.input} 
        placeholder='Enter Full Name'
        onChangeText={(value)=>setFullName(value)}
        verticalAlign="middle"
        />
      </View>

      {/* Email */}
      <View style={{
        marginTop:20
      }}>
        <Text style={{
          fontFamily:"outfit"
        }}>Email</Text>
        <TextInput
        style={styles.input} 
        placeholder='Enter Email'
        onChangeText={(value)=>setEmail(value)}
        verticalAlign="middle"
        />
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
        placeholder='Enter Password'
        onChangeText={(value)=>setPassword(value)}
        verticalAlign="middle"
        />
      </View>

      {/* Create account button */}
      <Pressable onPress={OnCreateAccount} style={{
        backgroundColor:Colors.PRIMARY,
        padding:20,
        borderRadius:15,
        marginTop:50,
      }}>
        <Text style={{
          color:Colors.WHITE,
          textAlign:'center'
        }}>Create Account</Text>
      </Pressable>

      {/* Sign in button */}
      <Pressable 
      onPress={()=>router.replace('/(auth)/sign-in')}
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
        }}>Sign In</Text>
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
