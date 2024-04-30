import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SectionList, StyleSheet, TouchableOpacity } from 'react-native';
import { getNotes, getTasks } from '../services/Services';
import { useUser } from '../context/UserContext';

const Notes = ({ navigation }) => {
    const { user } = useUser();
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState({});
    const [search, setSearch] = useState('');
    const [sections, setSections] = useState([]);

    useEffect(() => {
        if (user && user.user_id) {
            const unsubscribe = navigation.addListener('focus', () => {
                fetchNotesAndTasks(); // Refresh data when the screen is focused
            });

            fetchNotesAndTasks(); // Initial data fetch

            return unsubscribe; // Clean up the event listener
        }
    }, [navigation, user]); // Also depend on `user` to handle changes

    const fetchNotesAndTasks = async () => {
        if (!user) return; // Guard clause to ensure user exists
        const fetchedNotes = await getNotes(user.user_id);
        const fetchedTasks = await getTasks(user.user_id);
        const tasksMap = fetchedTasks.reduce((acc, task) => ({ ...acc, [task.task_id]: task }), {});
        setTasks(tasksMap);
        setNotes(fetchedNotes);
        filterAndGroupNotes(fetchedNotes, '');
    };

    const handleSearch = (text) => {
        setSearch(text);
        filterAndGroupNotes(notes, text);
    };

    const filterAndGroupNotes = (notes, searchText) => {
        let filteredNotes = notes.filter(note => note.title.toLowerCase().includes(searchText.toLowerCase()));
        let groupedNotes = filteredNotes.reduce((acc, note) => {
            const taskTitle = tasks[note.task_id] ? tasks[note.task_id].title : 'All';
            const statusGroup = tasks[note.task_id] && tasks[note.task_id].status === 'Pending' ? 'Active' : 'Completed';

            if (!acc[statusGroup]) {
                acc[statusGroup] = { title: statusGroup, data: [] };
            }
            if (!acc[statusGroup].data.find(t => t.title === taskTitle)) {
                acc[statusGroup].data.push({ title: taskTitle, data: [] });
            }
            const taskGroup = acc[statusGroup].data.find(t => t.title === taskTitle);
            taskGroup.data.push(note);

            return acc;
        }, {});

        setSections([
            ...Object.values(groupedNotes.Active ? groupedNotes.Active.data : []),
            ...Object.values(groupedNotes.Completed ? groupedNotes.Completed.data : [])
        ]);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('NoteContent', {
                noteId: item.note_id,
                title: item.title,
                content: item.content,
                onGoBack: fetchNotesAndTasks // Refresh notes list upon returning
            })}
        >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content}</Text>
        </TouchableOpacity>
    );

    const renderSectionHeader = ({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBox}
                placeholder="Search by note title..."
                value={search}
                onChangeText={handleSearch}
            />
            <SectionList
                sections={sections.map(section => ({ title: section.title, data: section.data }))}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                keyExtractor={(item) => item.note_id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    searchBox: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        fontSize: 14,
    }
});

export default Notes;
