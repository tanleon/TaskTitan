import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { addTask } from "../services/Services";
import { useUser } from '../context/UserContext';
import styles from '../styles';

const CreateTask = ({ route, navigation }) => {
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [status, setStatus] = useState('Pending');

    const handleCreateTask = async () => {
        if (!title || !description) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (!user || !user.user_id) {
            Alert.alert('Error', 'User not identified.');
            return;
        }

        try {
            const task = {
                user_id: user.user_id,
                title,
                description,
                dueDate: dueDate.toISOString().slice(0, 10), // Format the date to YYYY-MM-DD
                status,
            };
            const result = await addTask(task.user_id, task.title, task.description, task.dueDate, task.status);
            if (result.id) {
                Alert.alert('Success', 'Task created successfully!');
                navigation.goBack();
                if (route.params && route.params.onGoBack) {
                    route.params.onGoBack();  // Call the passed refresh function
                }
            } else {
                throw new Error('Task creation failed.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create the task.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={createTaskStyles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter task title"
                value={title}
                onChangeText={setTitle}
            />
            <Text style={createTaskStyles.label}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter task description"
                value={description}
                onChangeText={setDescription}
            />
            <Text style={createTaskStyles.label}>Due Date</Text>
            <DatePicker
                date={dueDate}
                onDateChange={setDueDate}
                mode="date"
                locale="en"
            />
            <TouchableOpacity style={createTaskStyles.button} onPress={handleCreateTask}>
                <Text style={styles.buttonText}>Create Task</Text>
            </TouchableOpacity>
        </View>
    );
};

// Local styles specific to CreateTask
const createTaskStyles = StyleSheet.create({
    label: {
        ...styles.text.subtitle,
        marginBottom: 8,
    },
    button: {
        ...styles.button,
        marginTop: 20, // Adjust spacing
    },
});

export default CreateTask;
