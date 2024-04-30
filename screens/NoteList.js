import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import { getNotesForTask, getTask, deleteAllNotesForTask } from "../services/Services";
import { useUser } from '../context/UserContext';

const NoteList = ({ route, navigation }) => {
    const { task_id } = route.params;
    const [notes, setNotes] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (user && user.user_id)
            fetchNotes();
            fetchTaskDetails();
        });

        fetchNotes();
        fetchTaskDetails();

        return () => unsubscribe();  // Cleanup the listener properly
    }, [navigation, task_id]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const fetchedNotes = await getNotesForTask(task_id);
            setNotes(fetchedNotes);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        }
        setLoading(false);
    };

    const fetchTaskDetails = async () => {
        try {
            const task = await getTask(task_id);
            setTaskTitle(task.title); // Assume getTask returns the task object with a title property
        } catch (error) {
            console.error("Failed to fetch task details:", error);
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
            style={styles.noteContainer} 
            onPress={() => navigation.navigate('NoteContent', {
                noteId: item.note_id, 
                title: item.title, 
                content: item.content,
                onGoBack: fetchNotes, // Pass a function to refresh notes upon going back
            })}
        >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text>{item.content}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.taskTitle}>{taskTitle}</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={notes}
                    renderItem={renderNote}
                    keyExtractor={item => item.note_id.toString()}
                />
            )}
            <View style={styles.buttonContainer}>
                <Button
                    title="Create Note"
                    onPress={() => navigation.navigate('CreateNote', { task_id })}
                    color="#007BFF"
                />
                <Button
                    title="Clear All Notes"
                    onPress={handleClearAllNotes}
                    color="#FF6347"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    taskTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    noteContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginTop: 10,
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 20,
    }
});

export default NoteList;
