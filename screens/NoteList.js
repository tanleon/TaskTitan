import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { getNotesForTask, getTask, deleteAllNotesForTask } from "../services/Services";
import { useUser } from '../context/UserContext';
import styles from '../styles'; // Import global styles

const NoteList = ({ route, navigation }) => {
    const { task_id } = route.params;
    const [notes, setNotes] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (user && user.user_id) {
                fetchNotes();
                fetchTaskDetails();
            }
        });

        fetchNotes();
        fetchTaskDetails();

        return unsubscribe; // Cleanup the listener properly
    }, [navigation, task_id]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const fetchedNotes = await getNotesForTask(task_id);
            setNotes(fetchedNotes);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch notes: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTaskDetails = async () => {
        try {
            const task = await getTask(task_id);
            setTaskTitle(task.title);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch task details: " + error.message);
        }
    };

    const handleClearAllNotes = async () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete all notes for this task?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: async () => {
                    await deleteAllNotesForTask(task_id);
                    fetchNotes();
                }}
            ]
        );
    };

    const renderNote = ({ item }) => (
        <TouchableOpacity 
            style={localStyles.noteContainer} 
            onPress={() => navigation.navigate('NoteContent', {
                noteId: item.note_id, 
                title: item.title, 
                content: item.content,
                onGoBack: fetchNotes, // Pass a function to refresh notes upon going back
            })}
        >
            <Text style={localStyles.noteTitle}>{item.title}</Text>
            <Text>{item.content}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={localStyles.taskTitle}>{taskTitle}</Text>
            {loading ? (
                <ActivityIndicator size="large" color={styles.colors.primary} />
            ) : (
                <FlatList
                    data={notes}
                    renderItem={renderNote}
                    keyExtractor={item => item.note_id.toString()}
                />
            )}
            <View style={localStyles.buttonContainer}>
                <Button
                    title="Create Note"
                    onPress={() => navigation.navigate('CreateNote', { task_id })}
                    color={styles.colors.primary}
                />
                <Button
                    title="Clear All Notes"
                    onPress={handleClearAllNotes}
                    color={styles.colors.secondary}
                />
            </View>
        </View>
    );
};

// Local styles specific to NoteList
const localStyles = StyleSheet.create({
    taskTitle: {
        ...styles.text.title,
        marginBottom: 10,
    },
    noteContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginTop: 10,
    },
    noteTitle: {
        ...styles.text.subtitle,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 20,
    }
});

export default NoteList;
