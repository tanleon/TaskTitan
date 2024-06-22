import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { updateNote, deleteNote } from "../services/Services";
import styles from '../styles'; // Import global styles

const NoteContent = ({ route, navigation }) => {
    const { noteId, title, content } = route.params;
    const [noteTitle, setNoteTitle] = useState(title);
    const [noteContent, setNoteContent] = useState(content);

    const handleUpdateNote = async () => {
        if (!noteTitle || !noteContent) {
            Alert.alert('Error', 'Note title and content cannot be empty.');
            return;
        }
        try {
            await updateNote(noteId, { title: noteTitle, content: noteContent });
            Alert.alert('Success', 'Note updated successfully.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to update note.');
        }
    };

    const handleDeleteNote = async () => {
        try {
            await deleteNote(noteId);
            Alert.alert('Success', 'Note deleted successfully.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to delete note.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={localStyles.input}
                onChangeText={setNoteTitle}
                value={noteTitle}
                placeholder="Note Title"
            />
            <TextInput
                style={[localStyles.input, localStyles.inputContent]}
                onChangeText={setNoteContent}
                value={noteContent}
                placeholder="Note Content"
                multiline={true}
                numberOfLines={4}
            />
            <TouchableOpacity style={localStyles.button} onPress={handleUpdateNote}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[localStyles.button, localStyles.deleteButton]} onPress={handleDeleteNote}>
                <Text style={styles.buttonText}>Delete Note</Text>
            </TouchableOpacity>
        </View>
    );
};

// Local styles specific to NoteContent
const localStyles = StyleSheet.create({
    input: {
        ...styles.input,
        marginBottom: 15,
        backgroundColor: 'white' // Example of overriding a specific style
    },
    inputContent: {
        height: 150,
        textAlignVertical: 'top',
    },
    button: {
        ...styles.button,
        marginTop: 10,
    },
    deleteButton: {
        backgroundColor: 'red', // Example of adding specific styles for this component
    },
});

export default NoteContent;
