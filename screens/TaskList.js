import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import Checkbox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/Ionicons';
import { getTasks, updateTask } from "../services/Services";
import { useUser } from '../context/UserContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' or 'title'
    const { user } = useUser();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && user && user.user_id) {
            fetchTasks(user.user_id);
        }
    }, [isFocused, user, showCompleted, sortBy]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const fetchedTasks = await getTasks(user.user_id);
            const filteredTasks = fetchedTasks.filter(task => showCompleted ? task.status === 'Completed' : task.status === 'Pending');
            filteredTasks.sort((a, b) => sortBy === 'dueDate' ? new Date(a.due_date) - new Date(b.due_date) : a.title.localeCompare(b.title));
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

    const renderItem = ({ item }) => {
        const isOverdue = new Date(item.due_date) < new Date();
        return (
            <View style={styles.itemContainer}>
                <Checkbox
                    value={item.status === 'Completed'}
                    onValueChange={(newValue) => handleStatusChange(item, newValue)}
                    tintColors={{ true: '#007BFF', false: '#000' }}
                />
                <TouchableOpacity
                    style={styles.itemTextContainer}
                    onPress={() => navigation.navigate('TaskDetails', { task_id: item.task_id })}
                >
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={[styles.dueDate, isOverdue && styles.overdue]}>{item.due_date}</Text>
                </TouchableOpacity>
                <Icon name="chevron-forward-outline" size={24} color="black" />
            </View>
        );
    };

    const toggleSort = () => {
        setSortBy(sortBy === 'dueDate' ? 'title' : 'dueDate');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{showCompleted ? 'Completed Tasks' : 'Tasks'}</Text>
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowCompleted(!showCompleted)}
                >
                    <Text style={styles.toggleButtonText}>{showCompleted ? 'Show Pending' : 'Show Completed'}</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={item => item.task_id.toString()}
            />
            {loading && (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            <View style={styles.sortSwitch}>
                <Text>Sort by:{sortBy === 'dueDate' ? 'DUE DATE|Title' : 'Due Date|TITLE'}</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={sortBy === 'dueDate' ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSort}
                    value={sortBy === 'title'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    toggleButton: {
        backgroundColor: '#007BFF',
        padding: 8,
        borderRadius: 5,
    },
    toggleButtonText: {
        color: 'white',
        fontSize: 14,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 10,
        backgroundColor: '#fff',
    },
    itemTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
    },
    dueDate: {
        fontSize: 14,
        color: '#000',
    },
    overdue: {
        color: 'red',
    },
    sortSwitch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        marginHorizontal: 10,
    },
    sortButtonText: {
        fontSize: 16,
    },
});

export default TaskList;
