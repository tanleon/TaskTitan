import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import COLORS from '../constants/colors';
import Checkbox from '@react-native-community/checkbox';
import { insertUser } from "../services/Services";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Signup = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const handleSignUp = async () => {
        console.log('Handling sign up...');

        // Validate fields
        validateEmail();
        validatePassword();
        validateUsername();

        if (emailError || passwordError || usernameError) {
            console.error('Validation errors exist.');
            return;
        }

        if (!isChecked) {
            console.error('Please agree to the terms and conditions.');
            return;
        }

        try {
            const user_id = await insertUser(username, email, password);
            if (user_id) {
                console.log('User ID from insertUser:', user_id);
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Error registering user:', error);
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
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Get started with TaskTitan!</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your username'
                        value={username}
                        onChangeText={setUsername}
                        onBlur={validateUsername}
                    />
                    {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your email'
                        keyboardType='email-address'
                        value={email}
                        onChangeText={setEmail}
                        onBlur={validateEmail}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your password'
                        secureTextEntry={isPasswordShown}
                        value={password}
                        onChangeText={setPassword}
                        onBlur={validatePassword}
                    />
                    <TouchableOpacity
                        onPress={() => setIsPasswordShown(!isPasswordShown)}
                        style={styles.iconPosition}
                    >
                        <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={COLORS.black} />
                    </TouchableOpacity>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                <View style={styles.checkboxContainer}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? COLORS.primary : undefined}
                    />
                    <Text style={styles.checkboxLabel}>I agree to the terms and conditions</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.signupText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 22,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 12,
        color: COLORS.black
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.black
    },
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
        marginVertical: 8
    },
    input: {
        height: 48,
        borderColor: COLORS.black,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        paddingRight: 40,
    },
    iconPosition: {
        position: 'absolute',
        right: 15,
        top: 15
    },
    errorText: {
        color: 'red',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    checkboxLabel: {
        marginLeft: 8
    },
    button: {
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: COLORS.black,
    },
    signupText: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginLeft: 6
    }
});

export default Signup;
