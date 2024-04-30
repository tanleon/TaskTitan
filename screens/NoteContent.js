import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { updateNote, deleteNote } from "../services/Services";

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
                style={styles.input}
                onChangeText={setNoteTitle}
                value={noteTitle}
                placeholder="Note Title"
            />
            <TextInput
                style={[styles.input, styles.inputContent]}
                onChangeText={setNoteContent}
                value={noteContent}
                placeholder="Note Content"
                multiline={true}
                numberOfLines={4}
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateNote}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteNote}>
                <Text style={styles.buttonText}>Delete Note</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        fontSize: 18,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'white'
    },
    inputContent: {
        height: 150,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    deleteButton: {
        backgroundColor: 'red',  // Make delete button red for caution
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    }
});

export default NoteContent;
