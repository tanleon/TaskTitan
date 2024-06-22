import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import io from 'socket.io-client';
import { SERVER_URL } from '../config';
import styles from '../styles';

const Feedback = ({ navigation }) => {
  const [feedback, setFeedback] = useState('');
  const socket = io(SERVER_URL);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected with ID: ${socket.id}`);
      socket.emit('client_connected', { connected: true });
    });

    socket.on('feedback_response', () => {
      Alert.alert('Success', 'Feedback Successfully Sent');
    });

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
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <Image
          style={{width: 280, height: 280 * (71 / 340), marginBottom: 30, marginTop: 30}}
          source={require('../assets/TaskTitanLogo.png')}
          resizeMode="contain"
        />
      <Text style={feedbackStyles.title}>Give Us Your Feedback About TaskTitan!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your feedback here"
        value={feedback}
        onChangeText={setFeedback}
      />
      <Button title="Send Feedback" onPress={handleSendFeedback} color={styles.colors.primary} />
    </View>
  );
};

// Local styles specific to Feedback
const feedbackStyles = StyleSheet.create({
  logo: {
    ...styles.logo,
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  title: {
    ...styles.text.title,
    marginBottom: 20,
  },
});

export default Feedback;
