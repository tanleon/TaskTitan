import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import Checkbox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { insertUser } from "../services/Services";
import styles from '../styles'; // Import global styles

const Signup = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const handleSignUp = async () => {
        validateEmail();
        validatePassword();
        validateUsername();

        if (emailError || passwordError || usernameError) {
            Alert.alert('Error', 'Please correct the errors before submitting.');
            return;
        }

        if (!isChecked) {
            Alert.alert('Error', 'Please agree to the terms and conditions.');
            return;
        }

        try {
            const user_id = await insertUser(username, email, password);
            if (user_id) {
                Alert.alert('Success', 'Account created successfully!');
                navigation.navigate('Login');
            }
        } catch (error) {
            Alert.alert('Registration Error', error.message);
        }
    };

    const validateEmail = () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        setEmailError(emailPattern.test(email) ? '' : 'Invalid email format');
    };

    const validatePassword = () => {
        setPasswordError(password.length >= 6 ? '' : 'Password must be at least 6 characters long');
    };

    const validateUsername = () => {
        setUsernameError(username ? '' : 'Username is required');
    };

    return (
        <SafeAreaView style={localStyles.container}>
            <View style={localStyles.innerContainer}>
                <Text style={styles.text.title}>Create Account</Text>
                <Text style={styles.text.subtitle}>Get started with TaskTitan!</Text>
                <View style={localStyles.inputContainer}>
                    <Text style={localStyles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your username'
                        value={username}
                        onChangeText={setUsername}
                        onBlur={validateUsername}
                    />
                    {usernameError && <Text style={styles.text.error}>{usernameError}</Text>}
                </View>
                <View style={localStyles.inputContainer}>
                    <Text style={localStyles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your email'
                        keyboardType='email-address'
                        value={email}
                        onChangeText={setEmail}
                        onBlur={validateEmail}
                    />
                    {emailError && <Text style={styles.text.error}>{emailError}</Text>}
                </View>
                <View style={localStyles.inputContainer}>
                    <Text style={localStyles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your password'
                        secureTextEntry={!isPasswordShown}
                        value={password}
                        onChangeText={setPassword}
                        onBlur={validatePassword}
                    />
                    <TouchableOpacity
                        onPress={() => setIsPasswordShown(!isPasswordShown)}
                        style={localStyles.iconPosition}
                    >
                        <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={styles.colors.black} />
                    </TouchableOpacity>
                    {passwordError && <Text style={styles.text.error}>{passwordError}</Text>}
                </View>
                <View style={localStyles.checkboxContainer}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? styles.colors.primary : undefined}
                    />
                    <Text style={localStyles.checkboxLabel}>I agree to the terms and conditions</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <View style={localStyles.footer}>
                    <Text style={localStyles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={localStyles.signupText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

// Local styles specific to Signup screen
const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: styles.colors.white,
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 22,
    },
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
        marginVertical: 8
    },
    iconPosition: {
        position: 'absolute',
        right: 12,
        top: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    checkboxLabel: {
        marginLeft: 8
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: styles.colors.black,
    },
    signupText: {
        fontSize: 16,
        color: styles.colors.primary,
        fontWeight: 'bold',
        marginLeft: 6
    }
});

export default Signup;
