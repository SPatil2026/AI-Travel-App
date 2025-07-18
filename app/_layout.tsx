import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { TripProvider } from '../context/TripContext';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {

  useFonts({
    'outfit':require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium':require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold':require('./../assets/fonts/Outfit-Bold.ttf'),
  })

  return (
    <AuthProvider>
      <TripProvider>
        <Stack screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="index" options={{headerShown:false}}/>
        </Stack>
      </TripProvider>
    </AuthProvider>
  );
}
