import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import styles from '../styles'; // Importing global styles

const Weather = () => {
    const [city, setCity] = useState('London'); // Default city
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchWeatherData = async () => {
        setIsLoading(true);
        setError('');
        const apiKey = ''
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        try {
            const response = await axios.get(url);
            setWeatherData(response.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Failed to fetch data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={city}
                style={localStyles.picker}
                onValueChange={(itemValue) => setCity(itemValue)}
            >
                <Picker.Item label="Abu Dhabi" value="Abu Dhabi" />
                <Picker.Item label="Amsterdam" value="Amsterdam" />
                <Picker.Item label="Ankara" value="Ankara" />
                <Picker.Item label="Athens" value="Athens" />
                <Picker.Item label="Bangkok" value="Bangkok" />
                <Picker.Item label="Barcelona" value="Barcelona" />
                <Picker.Item label="Beijing" value="Beijing" />
                <Picker.Item label="Berlin" value="Berlin" />
                <Picker.Item label="Brisbane" value="Brisbane" />
                <Picker.Item label="Bucharest" value="Bucharest" />
                <Picker.Item label="Budapest" value="Budapest" />
                <Picker.Item label="Buenos Aires" value="Buenos Aires" />
                <Picker.Item label="Cairo" value="Cairo" />
                <Picker.Item label="Cape Town" value="Cape Town" />
                <Picker.Item label="Delhi" value="Delhi" />
                <Picker.Item label="Dubai" value="Dubai" />
                <Picker.Item label="Dublin" value="Dublin" />
                <Picker.Item label="George Town" value="George Town" />
                <Picker.Item label="Helsinki" value="Helsinki" />
                <Picker.Item label="Hong Kong" value="Hong Kong" />
                <Picker.Item label="Istanbul" value="Istanbul" />
                <Picker.Item label="Jakarta" value="Jakarta" />
                <Picker.Item label="Johannesburg" value="Johannesburg" />
                <Picker.Item label="Johor Bahru" value="Johor Bahru" />
                <Picker.Item label="Kota Kinabalu" value="Kota Kinabalu" />
                <Picker.Item label="Kuala Lumpur" value="Kuala Lumpur" />
                <Picker.Item label="Kuantan" value="Kuantan" />
                <Picker.Item label="Kuching" value="Kuching" />
                <Picker.Item label="London" value="London" />
                <Picker.Item label="Los Angeles" value="Los Angeles" />
                <Picker.Item label="Madrid" value="Madrid" />
                <Picker.Item label="Melaka" value="Melaka" />
                <Picker.Item label="Mexico City" value="Mexico City" />
                <Picker.Item label="Miami" value="Miami" />
                <Picker.Item label="Milan" value="Milan" />
                <Picker.Item label="Moscow" value="Moscow" />
                <Picker.Item label="Mumbai" value="Mumbai" />
                <Picker.Item label="Munich" value="Munich" />
                <Picker.Item label="New York" value="New York" />
                <Picker.Item label="Osaka" value="Osaka" />
                <Picker.Item label="Oslo" value="Oslo" />
                <Picker.Item label="Paris" value="Paris" />
                <Picker.Item label="Penang" value="Penang" />
                <Picker.Item label="Perth" value="Perth" />
                <Picker.Item label="Rio de Janeiro" value="Rio de Janeiro" />
                <Picker.Item label="Rome" value="Rome" />
                <Picker.Item label="San Francisco" value="San Francisco" />
                <Picker.Item label="Seoul" value="Seoul" />
                <Picker.Item label="Shanghai" value="Shanghai" />
                <Picker.Item label="Singapore" value="Singapore" />
                <Picker.Item label="Stockholm" value="Stockholm" />
                <Picker.Item label="Sydney" value="Sydney" />
                <Picker.Item label="Tokyo" value="Tokyo" />
                <Picker.Item label="Toronto" value="Toronto" />
            </Picker>
            <Button
                title="Get Weather"
                onPress={fetchWeatherData}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : weatherData ? (
                <View style={localStyles.info}>
                    <Text style={styles.text.info}>Temperature: {weatherData.main.temp}°K</Text>
                    <Text style={styles.text.info}>Weather: {weatherData.weather[0].main}</Text>
                    <Text style={styles.text.info}>Description: {weatherData.weather[0].description}</Text>
                </View>
            ) : error ? (
                <Text style={styles.text.error}>{error}</Text>
            ) : null}
        </View>
    );
};

// Local styles specific to Weather screen
const localStyles = StyleSheet.create({
    picker: {
        width: '100%',
        height: 50,
    },
    info: {
        marginTop: 20,
    },
});

export default Weather;
