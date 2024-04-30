import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useUser } from '../context/UserContext';
import { updateProfile } from '../services/Services';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserProfile = ({ navigation }) => {
    const { user, setUser, signOut } = useUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && user?.user_id) {
            setUsername(user.username);
        }
    }, [isFocused, user?.user_id]);

    if (!user) {
        return (
          <View style={styles.centered}>
            <Text>No user details available. Please log in.</Text>
          </View>
        );
    }

    const handleLogout = async () => {
        try {
            await signOut();
            navigation.replace('Login');
        } catch (error) {
            Alert.alert('Error', 'Failed to log out');
        }
    };

    const handleUpdate = async () => {
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return; // Prevent update if validation fails
        }
        try {
            const updated = await updateProfile({ user_id: user.user_id, username, password });
            if (updated) {
                setUser({ ...user, username });
                Alert.alert('Success', 'Profile updated successfully');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>User Profile</Text>
            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
                autoCapitalize="none"
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError(''); // Reset error message on edit
                    }}
                    value={password}
                    placeholder="Enter new (or old) password"
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                    style={styles.icon}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                >
                    <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="grey" />
                </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <View style={styles.buttonContainer}>
                <Button
                    title="Update Profile"
                    onPress={handleUpdate}
                    color="#0066ff"
                />
                <View style={styles.buttonSpacer} />
                <Button
                    title="Logout"
                    onPress={handleLogout}
                    color="#ff4444"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjusted for space between buttons
        marginTop: 10,
    },
    buttonSpacer: {
        width: 10, // Space between buttons
    },
    label: {
        fontSize: 18,
        marginBottom: 10
    }
});

export default UserProfile;
