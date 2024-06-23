import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LogBox } from 'react-native';
import styles from './styles';
import { UserProvider } from './context/UserContext';

// Import task management screens
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import TaskList from "./screens/TaskList";
import TaskDetails from "./screens/TaskDetails";
import CreateTask from "./screens/CreateTask";
import UserProfile from "./screens/UserProfile";
import CreateNote from "./screens/CreateNote";
import NoteList from "./screens/NoteList";
import Notes from "./screens/Notes";
import NoteContent from "./screens/NoteContent";
import Statistics from "./screens/Statistics";
import Pomodoro from "./screens/Pomodoro";
import Feedback from "./screens/Feedback";
import Weather from "./screens/Weather";

LogBox.ignoreLogs(['EventEmitter.removeListener']);

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: '#FF8551' }}>
      <View style={{alignSelf: 'center', marginTop: 20, marginBottom: 10, width: '100%', alignItems: 'center'}}>
        <Image
          style={{width: 280, height: 280 * (71 / 340)}}
          source={require('./assets/TaskTitanLogo.png')}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.text.subtitle, {alignSelf: 'center', marginBottom: 20, fontWeight: 'bold', fontSize: 20, color: 'blue'}]}>Primed for Productivity</Text>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}
        onPress={() => props.navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={30} color="blue" />
        <Text style={[styles.text.subtitle, {marginLeft: 10, fontWeight: 'bold', fontSize: 20, color: 'black'}]}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}
        onPress={() => props.navigation.navigate('Feedback')}>
        <Ionicons name="mail-outline" size={30} color="blue" />
        <Text style={[styles.text.subtitle, {marginLeft: 10, fontWeight: 'bold', fontSize: 20, color: 'black'}]}>Send Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}
        onPress={() => props.navigation.navigate('Login')}>
        <Ionicons name="exit-outline" size={30} color="blue" />
        <Text style={[styles.text.subtitle, {marginLeft: 10, fontWeight: 'bold', fontSize: 20, color: 'black'}]}>Switch Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}
        onPress={() => props.navigation.navigate('Home')}>
        <Ionicons name="list" size={30} color="blue" />
        <Text style={[styles.text.subtitle, {marginLeft: 10, fontWeight: 'bold', fontSize: 20, color: 'black'}]}>Back to Home</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Tasks': iconName = focused ? 'list' : 'list-outline'; break;
            case 'Notes': iconName = focused ? 'book' : 'book-outline'; break;
            case 'Statistics': iconName = focused ? 'stats-chart' : 'stats-chart-outline'; break;
            case 'Pomodoro': iconName = focused ? 'timer' : 'timer-outline'; break;
            case 'Weather': iconName = focused ? 'cloud' : 'cloud-outline'; break;
            default: break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarButton: (props) => <TouchableOpacity {...props} />,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Tasks" component={TaskList} options={{ title: 'Tasks' }} />
      <Tab.Screen name="Notes" component={Notes} options={{ title: 'Notes' }} />
      <Tab.Screen name="Statistics" component={Statistics} options={{ title: 'Statistics' }} />
      <Tab.Screen name="Pomodoro" component={Pomodoro} options={{ title: 'Pomodoro' }} />
      <Tab.Screen name="Weather" component={Weather} options={{ title: 'Weather' }} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{ backgroundColor: '#FF8551' }}
      screenOptions={{
          headerStyle: { backgroundColor: '#FF8551' },
          headerTintColor: 'white',
          drawerLabelStyle: { fontSize: 18, color: 'white' }
      }}>
      <Drawer.Screen name="Home" component={HomeTabs} />
      <Drawer.Screen name="Profile" component={UserProfile} />
      <Drawer.Screen name="Feedback" component={Feedback} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="TaskDetails" component={TaskDetails} />
          <Stack.Screen name="CreateTask" component={CreateTask} />
          <Stack.Screen name="CreateNote" component={CreateNote} />
          <Stack.Screen name="NoteList" component={NoteList} />
          <Stack.Screen name="NoteContent" component={NoteContent} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
