import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert, Image} from 'react-native';
import COLORS from '../constants/colors';
import Checkbox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { signInUser } from "../services/Services";
import { useUser } from '../context/UserContext'; // Ensure this path is correct

const Login = ({ navigation }) => {
    const { signIn } = useUser();  // This should be inside the component
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const retrieveData = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('email');
                const savedPassword = await AsyncStorage.getItem('password');
                const rememberMeChecked = await AsyncStorage.getItem('rememberMeChecked');
                if (rememberMeChecked === 'true') {
                    setEmail(savedEmail || '');
                    setPassword(savedPassword || '');
                    setIsChecked(true);
                }
            } catch (e) {
                console.error('Error retrieving data:', e);
            }
        };
        retrieveData();
    }, []);

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
            console.error('Validation failed.');
            return;
        }

        try {
            const user = await signInUser(email, password);
            if (user) {
                console.log('User logged in:', user);
                signIn(user); // Call signIn from context
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
                if (isChecked) {
                    await AsyncStorage.setItem('email', email);
                    await AsyncStorage.setItem('password', password);
                    await AsyncStorage.setItem('rememberMeChecked', 'true');
                } else {
                    await AsyncStorage.removeItem('email');
                    await AsyncStorage.removeItem('password');
                    await AsyncStorage.removeItem('rememberMeChecked');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            Alert.alert('Login failed', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../assets/TaskTitanLogo.png')} />
                </View>
                <Text style={styles.title}>Welcome to TaskTitan!</Text>
                <Text style={styles.subtitle}>Log in to manage your tasks.</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        onBlur={validateEmail}
                    />
                    {emailError && <Text style={styles.errorText}>{emailError}</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry={!isPasswordShown}
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
                    {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                </View>
                <View style={styles.checkboxContainer} >
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? COLORS.primary : undefined}
                    />
                    <Text>Remember Me</Text>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                        <Text style={styles.signupText}> Register Now</Text>
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
        width: '100%',
        height: 48,
        borderColor: COLORS.black,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        paddingRight: 40,
    },
    iconPosition: {
        position: 'absolute',
        right: 12,
        top: 15,
    },
    errorText: {
        color: 'red',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 8,
        width:30,
        height: 30,
    },
    loginButton: {
        marginTop: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 5,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 22,
    },
    footerText: {
        fontSize: 16,
        color: COLORS.black,
    },
    signupText: {
        fontSize: 16,
        color: COLORS.primary,
    },
});

export default Login;
