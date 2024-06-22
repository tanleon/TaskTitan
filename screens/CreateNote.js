import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addNote, getTask } from "../services/Services";
import styles from '../styles';

const CreateNote = ({ route, navigation }) => {
    const { task_id } = route.params;
    const [task, setTask] = useState(null);  // State to hold the task object
    const [noteTitle, setNoteTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const fetchedTask = await getTask(task_id);
                if (fetchedTask) {
                    setTask(fetchedTask);  // Set the entire task object
                } else {
                    Alert.alert("Error", "No task found.");
                    navigation.goBack(); // Go back if the task is not found
                }
            } catch (error) {
                Alert.alert("Error", "Failed to fetch task details.");
                navigation.goBack(); // Consider going back if there's an error fetching task
            }
        };

        fetchTaskDetails();
    }, [task_id, navigation]);

    const handleSaveNote = async () => {
        if (!task) {
            Alert.alert("Error", "No task data available.");
            return;
        }

        if (!noteTitle || !content) {
            Alert.alert('Error', 'Please enter all fields.');
            return;
        }

        try {
            const noteDetails = {
                user_id: task.user_id,  // Now it should be correctly passed
                task_id: task_id,
                title: noteTitle,
                content: content
            };

            const result = await addNote(noteDetails);
            if (result) {
                Alert.alert('Success', 'Note created successfully');
                navigation.goBack(); // Navigate back or refresh as needed
            } else {
                throw new Error('Failed to create note');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={createNoteStyles.title}>{task ? task.title : 'Loading task...'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Note Title"
                value={noteTitle}
                onChangeText={setNoteTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Note Content"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
            />
            <TouchableOpacity style={createNoteStyles.button} onPress={handleSaveNote}>
                <Text style={createNoteStyles.buttonText}>Add Note</Text>
            </TouchableOpacity>
        </View>
    );
};

const createNoteStyles = StyleSheet.create({
    title: {
        ...styles.text.title,
        marginBottom: 20,
    },
    button: {
        ...styles.button,
        marginTop: 20, // Override if needed
    },
    buttonText: {
        ...styles.buttonText,
    }
});

export default CreateNote;
