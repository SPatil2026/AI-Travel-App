import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function SearchPlace() {
    const navigation = useNavigation();
    const router = useRouter();
    
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Search Destination'
        })
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Where do you want to go?</Text>
            <GooglePlacesAutocomplete
                placeholder='Search for a city or country'
                onPress={(data, details = null) => {
                    // Navigate to plan trip screen with place data
                    router.push({
                        pathname: '/create-trip/plan-trip',
                        params: {
                            place: data.structured_formatting?.main_text || data.description,
                            placeId: data.place_id
                        }
                    });
                }}
                fetchDetails={true}
                query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
                    language: 'en',
                }}
                styles={{
                    container: {
                        flex: 0,
                    },
                    textInputContainer: {
                        borderRadius: 10,
                        marginTop: 10
                    },
                    textInput: {
                        height: 50,
                        borderRadius: 10,
                        paddingLeft: 16,
                        fontSize: 16,
                        fontFamily: 'outfit'
                    },
                    predefinedPlacesDescription: {
                        color: Colors.PRIMARY,
                    },
                    description: {
                        fontFamily: 'outfit'
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: '100%'
    },
    headerText: {
        fontFamily: 'outfit-bold',
        fontSize: 24,
        marginBottom: 10
    }
});