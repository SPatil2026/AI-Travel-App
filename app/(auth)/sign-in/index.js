import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'

import { Colors } from './../../../constants/Colors'
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SignIn() {
  const navigation=useNavigation();
  const router=useRouter();
  useEffect(()=>{
    navigation.setOptions({
      headerShown:false
    })
  },[])

  return (
    <View style={{
      padding:25,
      paddingTop:40,
      backgroundColor:Colors.WHITE,
      height:"100%"
    }}>
      <TouchableOpacity onPress={()=>router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
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
        placeholder='Enter Email'/>
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
        placeholder='Enter Password'/>
      </View>
      
      {/* Sign-in button */}
      <View style={{
        backgroundColor:Colors.PRIMARY,
        padding:20,
        borderRadius:15,
        marginTop:50,
      }}>
        <Text style={{
          color:Colors.WHITE,
          textAlign:'center'
        }}>Sign In</Text>
      </View>

      {/* Create Account button */}
      <TouchableOpacity 
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
      </TouchableOpacity>

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
