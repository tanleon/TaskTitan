import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, Image, StyleSheet } from 'react-native';
import Checkbox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { signInUser } from "../services/Services";
import { useUser } from '../context/UserContext';
import styles from '../styles'; // Importing global styles

// Local styles specific to Login screen
const localStyles = StyleSheet.create({
    iconPosition: {
        position: 'absolute',
        right: 12,
        top: 15, // Adjust based on the actual size of the input field
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20, // Added margin for spacing
    },
    checkbox: {
        marginRight: 8,
        width: 30,
        height: 30,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        fontSize: 16,
        color: styles.colors.primary,
        fontWeight: 'bold',
        marginLeft: 6,
    }
});

const Login = ({ navigation }) => {
    const { signIn } = useUser();
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        setEmailError(emailPattern.test(email) ? '' : 'Invalid email format');
    };

    const validatePassword = () => {
        setPasswordError(password.length >= 6 ? '' : 'Password must be at least 6 characters long');
    };

    const handleLogin = async () => {
        validateEmail();
        validatePassword();
        if (emailError || passwordError) {
            Alert.alert('Error', 'Please correct the errors before submitting.');
            return;
        }

        try {
            const user = await signInUser(email, password);
            if (user) {
                signIn(user);
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            } else {
                throw new Error('Login failed.');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Image style={styles.logo} source={require('../assets/TaskTitanLogo.png')} />
                <Text style={styles.text.title}>Welcome to TaskTitan!</Text>
                <Text style={styles.text.subtitle}>Log in to manage your tasks.</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        onBlur={validateEmail}
                    />
                    {emailError && <Text style={styles.text.error}>{emailError}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { paddingRight: 40 }]} // Extra padding for the eye icon
                        placeholder="Enter your password"
                        secureTextEntry={!isPasswordShown}
                        value={password}
                        onChangeText={setPassword}
                        onBlur={validatePassword}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordShown(!isPasswordShown)} style={localStyles.iconPosition}>
                        <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color="black" />
                    </TouchableOpacity>
                    {passwordError && <Text style={styles.text.error}>{passwordError}</Text>}
                </View>

                <View style={localStyles.checkboxContainer}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? styles.colors.primary : undefined}
                    />
                    <Text>Remember Me</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <View style={localStyles.footer}>
                    <Text>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                        <Text style={localStyles.signupText}>Register Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Login;
