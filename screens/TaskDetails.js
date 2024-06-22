import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { getTask, updateTask } from "../services/Services";
import { useUser } from '../context/UserContext';
import styles from '../styles';  // Import global styles

const TaskDetails = ({ route, navigation }) => {
    const { task_id } = route.params;
    const { user } = useUser();
    const [task, setTask] = useState(null);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.user_id) fetchTaskDetails();
    }, [task_id]);

    const fetchTaskDetails = async () => {
        setLoading(true);
        try {
            const fetchedTask = await getTask(task_id);
            if (fetchedTask.user_id !== user.user_id) {
                Alert.alert("Error", "This task does not belong to the logged-in user.");
                navigation.goBack();
            } else {
                setTask(fetchedTask);
                setDate(new Date(fetchedTask.due_date));
            }
        } catch (error) {
            Alert.alert("Error", "Unable to fetch task details");
        }
        setLoading(false);
    };

    const handleUpdateTask = async () => {
        const updatedTask = {
            description: task.description,
            due_date: date.toISOString().split('T')[0],
            status: task.status,
            task_id: task.task_id,
            title: task.title,
            user_id: user.user_id,
        };

        try {
            const result = await updateTask(task.task_id, updatedTask);
            if (result) {
                Alert.alert("Success", "Task updated successfully");
                setTask({ ...task, ...updatedTask, due_date: date });
            } else {
                throw new Error("Failed to update the task");
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to update the task");
        }
    };

    if (loading) {
        return <View style={styles.center}><Text>Loading...</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setTask({ ...task, title: text })}
                value={task.title}
                placeholder="Task Title"
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => setTask({ ...task, description: text })}
                value={task.description}
                placeholder="Task Description"
                multiline
            />
            <DatePicker
                date={date}
                onDateChange={setDate}
                mode="date"
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateTask}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('CreateNote', { task_id: task.task_id })}
            >
                <Text style={styles.buttonText}>Create Note</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('NoteList', { task_id: task.task_id })}
            >
                <Text style={styles.buttonText}>View Notes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default TaskDetails;
