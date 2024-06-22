import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Sound from 'react-native-sound';
import styles from '../styles'; // Correct import statement for global styles

const alarmSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('Failed to load the sound', error);
        return;
    }
});

const Pomodoro = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isWorkTime, setIsWorkTime] = useState(true);
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                decrementTimer();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, minutes, seconds]);

    const decrementTimer = () => {
        if (seconds > 0) {
            setSeconds(seconds - 1);
        } else if (minutes > 0) {
            setMinutes(minutes - 1);
            setSeconds(59);
        } else {
            togglePeriod();
        }
    };

    const togglePeriod = () => {
        alarmSound.play((success) => {
            if (!success) {
                console.log('Sound playback failed due to audio decoding errors');
            }
        });
        setIsWorkTime(!isWorkTime);
        setMinutes(isWorkTime ? breakDuration : workDuration);
        setSeconds(0);
    };

    const toggle = () => {
        setIsActive(!isActive);
        if (!isActive && minutes === 0 && seconds === 0) {
            setMinutes(isWorkTime ? workDuration : breakDuration);
            setSeconds(0);
        }
    };

    const handleModeChange = (newMode) => {
        setIsWorkTime(newMode);
        setMinutes(newMode ? workDuration : breakDuration);
        setSeconds(0);
    };

    return (
        <View style={localStyles.container}>
            <Text style={localStyles.timer}>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</Text>
            <Text style={localStyles.status}>{isWorkTime ? 'Work Time' : 'Break Time'}</Text>

            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isWorkTime ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={handleModeChange}
                value={isWorkTime}
            />

            <View style={localStyles.pickerContainer}>
                <Text style={localStyles.pickerLabel}>Work Duration: {workDuration} min</Text>
                <Picker
                    selectedValue={workDuration}
                    style={localStyles.picker}
                    onValueChange={(itemValue) => {
                        setWorkDuration(itemValue);
                        if (isWorkTime) {
                            setMinutes(itemValue);
                            setSeconds(0);
                        }
                    }}>
                    {[...Array(61).keys()].slice(1).map(min => (
                        <Picker.Item key={min} label={`${min} min`} value={min} />
                    ))}
                </Picker>
            </View>

            <View style={localStyles.pickerContainer}>
                <Text style={localStyles.pickerLabel}>Break Duration: {breakDuration} min</Text>
                <Picker
                    selectedValue={breakDuration}
                    style={localStyles.picker}
                    onValueChange={(itemValue) => {
                        setBreakDuration(itemValue);
                        if (!isWorkTime) {
                            setMinutes(itemValue);
                            setSeconds(0);
                        }
                    }}>
                    {[...Array(61).keys()].slice(1).map(min => (
                        <Picker.Item key={min} label={`${min} min`} value={min} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={toggle}>
                <Text style={styles.buttonText}>{isActive ? "Pause" : "Start"}</Text>
            </TouchableOpacity>
        </View>
    );
};

// Local styles specific to Pomodoro screen
const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: styles.colors.white,
    },
    timer: {
        fontSize: 48,
        marginBottom: 30,
    },
    status: {
        fontSize: 24,
        marginBottom: 20,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 16,
        paddingRight: 10,
    },
    picker: {
        width: 100,
        height: 44,
    },
    button: styles.button, // Use global style for the button
    buttonText: styles.buttonText, // Use global style for the button text
});

export default Pomodoro;
