import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LogBox } from 'react-native';

// Context
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

LogBox.ignoreLogs(['EventEmitter.removeListener']);

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#FF8551',
  },
  logoContainer: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '100%', // Ensure the container uses the full width of the drawer
    alignItems: 'center', // Center the logo horizontally
  },
  logo: {
    width: 280, // Adjusted width to fit within the drawer
    height: 280 * (71 / 340), // Maintain aspect ratio
  },
  profileText: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 23,
    color: 'white',
    marginLeft: 10,
  }
});

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('./assets/TaskTitanLogo.png')}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.profileText}>Primed for productivity</Text>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={23} color="white" />
        <Text style={styles.menuItemText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Feedback')}>
        <Ionicons name="mail-outline" size={23} color="white" />
        <Text style={styles.menuItemText}>Send Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Login')}>
        <Ionicons name="exit-outline" size={23} color="white" />
        <Text style={styles.menuItemText}>Switch Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Home')}>
        <Ionicons name="list" size={23} color="white" />
        <Text style={styles.menuItemText}>Back to Home</Text>
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
            case 'TabTasks': iconName = focused ? 'list' : 'list-outline'; break;
            case 'TabNotes': iconName = focused ? 'book' : 'book-outline'; break;
            case 'TabStatistics': iconName = focused ? 'stats-chart' : 'stats-chart-outline'; break;
            case 'TabPomodoro': iconName = focused ? 'timer' : 'timer-outline'; break;
            default: break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarButton: (props) => <TouchableOpacity {...props} />,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="TabTasks" component={TaskList} options={{ title: 'Tasks' }} />
      <Tab.Screen name="TabNotes" component={Notes} options={{ title: 'Notes' }} />
      <Tab.Screen name="TabStatistics" component={Statistics} options={{ title: 'Statistics' }} />
      <Tab.Screen name="TabPomodoro" component={Pomodoro} options={{ title: 'Pomodoro' }} />
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
          <Stack.Screen name="CreateNote" component={CreateNote} />
          <Stack.Screen name="NoteList" component={NoteList} />
          <Stack.Screen name="NoteContent" component={NoteContent} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
