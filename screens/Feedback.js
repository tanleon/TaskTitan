import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import io from 'socket.io-client';
import { SERVER_URL } from '../config';

const Feedback = ({ navigation }) => {
  const [feedback, setFeedback] = useState('');
  const socket = io(SERVER_URL);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected with ID: ${socket.id}`);
      socket.emit('client_connected', { connected: true });
    });

    // Listen for server's response to feedback submission
    socket.on('feedback_response', () => {
      Alert.alert('Success', 'Feedback Successfully Sent');
    });

    // Clean up to avoid multiple listeners being added
    return () => {
      socket.off('connect');
      socket.off('feedback_response');
    };
  }, []);

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter some feedback before sending.');
      return;
    }
    socket.emit('feedback', feedback);
    setFeedback(''); // Clear the input after sending
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/TaskTitanLogo.png')}
      />
      <Text style={styles.title}>TaskTitan Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your feedback here"
        value={feedback}
        onChangeText={setFeedback}
      />
      <Button title="Send Feedback" onPress={handleSendFeedback} color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  logo: {
    width: 200,  // Adjust the width according to your preference
    height: 100, // Adjust the height based on your logo's aspect ratio
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    minHeight: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
  }
});

export default Feedback;
