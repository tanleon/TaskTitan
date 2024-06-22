import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { getTasks, getNotes } from '../services/Services';
import { useUser } from '../context/UserContext';
import { useIsFocused } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;

const Statistics = () => {
    const { user } = useUser();
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (user && user.user_id && isFocused) {
            fetchTasksAndNotes();
        }
    }, [isFocused, user.user_id]);

    const fetchTasksAndNotes = async () => {
        const allTasks = await getTasks(user.user_id);
        const allNotes = await getNotes(user.user_id);
        setTasks(allTasks);
        setNotes(allNotes);
    };

    // Calculate task and note statistics
    const activeTasksCount = tasks.filter(task => task.status === 'Pending').length;
    const completedTasksCount = tasks.filter(task => task.status === 'Completed').length;
    const totalTasksCount = tasks.length;
    const totalNotesCount = notes.length;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 14);

    let dateLabels = [];
    let tasksData = [];
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        dateLabels.push(dateString);
        tasksData.push(tasks.filter(task => 
            new Date(task.due_date).getFullYear() === date.getFullYear() &&
            new Date(task.due_date).getMonth() === date.getMonth() &&
            new Date(task.due_date).getDate() === date.getDate()
        ).length);
    }

    const chartData = JSON.stringify({
        labels: dateLabels,
        datasets: [{
            label: 'Number of Tasks',
            data: tasksData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    });

    const htmlContent = `
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; }
          #chartContainer { width: 100%; max-width: ${screenWidth}px; height: 400px; }
          canvas { width: 100% !important; height: 100% !important; }
        </style>
      </head>
      <body>
        <div id="chartContainer">
          <canvas id="myChart"></canvas>
        </div>
        <script>
          var ctx = document.getElementById('myChart').getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: ${chartData},
            options: { 
              responsive: true, 
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true }
              }
            }
          });
        </script>
      </body>
    </html>
    `;

    return (
        <View style={statstyles.container}>
            <Text style={statstyles.header}>Tasks To Be Completed Over The Next Two Weeks</Text>
            <WebView
                originWhitelist={['*']}
                style={statstyles.webview}
                source={{ html: htmlContent }}
                scalesPageToFit={false}
            />
            <Text style={statstyles.summaryText}>Active Tasks: {activeTasksCount}</Text>
            <Text style={statstyles.summaryText}>Completed Tasks: {completedTasksCount}</Text>
            <Text style={statstyles.summaryText}>Total Tasks: {totalTasksCount}</Text>
            <Text style={statstyles.summaryText}>Total Notes: {totalNotesCount}</Text>
        </View>
    );
};

const statstyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    webview: {
        flex: 1,
        height: 400 // Ensure fixed height to prevent stretching
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10
    }
});

export default Statistics;
