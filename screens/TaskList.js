import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import Checkbox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/Ionicons';
import { getTasks, updateTask } from "../services/Services";
import { useUser } from '../context/UserContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import styles from '../styles'; // Importing global styles

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('dueDate');
    const { user } = useUser();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && user && user.user_id) {
            fetchTasks();
        }
    }, [isFocused, user, showCompleted, sortBy]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const fetchedTasks = await getTasks(user.user_id);
            let filteredTasks = fetchedTasks.filter(task => showCompleted ? task.status === 'Completed' : task.status === 'Pending');
            if (sortBy === 'dueDate') {
                filteredTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
            } else if (sortBy === 'title') {
                filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
            }
            setTasks(filteredTasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (task, newValue) => {
        const newStatus = newValue ? 'Completed' : 'Pending';
        await updateTask(task.task_id, { status: newStatus });
        fetchTasks();
    };

    const toggleSort = () => {
        setSortBy(sortBy === 'dueDate' ? 'title' : 'dueDate');
    };

    const renderItem = ({ item }) => {
        const isOverdue = new Date(item.due_date) < new Date();
        return (
            <TouchableOpacity style={localStyles.itemContainer} onPress={() => navigation.navigate('TaskDetails', { task_id: item.task_id })}>
                <Checkbox
                    value={item.status === 'Completed'}
                    onValueChange={(newValue) => handleStatusChange(item, newValue)}
                    tintColors={{ true: styles.colors.primary, false: styles.colors.grey }}
                />
                <View style={localStyles.itemTextContainer}>
                    <Text style={styles.text.title}>{item.title}</Text>
                    <Text style={styles.text.subtitle}>{item.description}</Text>
                    <Text style={[styles.dueDate, isOverdue && localStyles.overdue]}>{item.due_date}</Text>
                </View>
                <Icon name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={localStyles.header}>
                <Text style={styles.text.title}>{sortBy === 'dueDate' ? 'Sort by Title' : 'Sort by Due Date'}</Text>
                <TouchableOpacity style={styles.button} onPress={toggleSort}>
                    <Text style={styles.buttonText}>Toggle Sort</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={item => item.task_id.toString()}
            />
            {loading && <ActivityIndicator size="large" color={styles.colors.primary} />}
            <View style={localStyles.footer}>
                <TouchableOpacity style={styles.button} onPress={() => setShowCompleted(!showCompleted)}>
                    <Text style={styles.buttonText}>{showCompleted ? 'Show Pending' : 'Show Completed'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateTask')}>
                    <Text style={styles.buttonText}>Create Task</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Local styles specific to TaskList
const localStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: styles.colors.background,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: styles.colors.grey,
        padding: 10,
        backgroundColor: styles.colors.white,
    },
    itemTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    overdue: {
        color: styles.colors.error,
    },
    footer: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-evenly',
        borderTopWidth: 1,
        borderTopColor: styles.colors.grey,
    },
});

export default TaskList;
