import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Sound from 'react-native-sound';

// Initialize sound
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
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (minutes > 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                } else {
                    togglePeriod();
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, minutes, seconds]);

    const togglePeriod = () => {
        setIsWorkTime(!isWorkTime);
        setMinutes(isWorkTime ? breakDuration : workDuration);
        setSeconds(0);

        // Play the sound
        alarmSound.play((success) => {
            if (!success) {
                console.log('Sound playback failed due to audio decoding errors');
            }
        });
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
        <View style={styles.container}>
            <Text style={styles.timer}>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</Text>
            <Text style={styles.status}>{isWorkTime ? 'Work Time' : 'Break Time'}</Text>

            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isWorkTime ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={handleModeChange}
                value={isWorkTime}
            />

            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Work Duration: {workDuration} min</Text>
                <Picker
                    selectedValue={workDuration}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => {
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

            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Break Duration: {breakDuration} min</Text>
                <Picker
                    selectedValue={breakDuration}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => {
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Pomodoro;
