import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

import HomeScreen from './src/screens/HomeScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FirstSplashScreen from './src/screens/FirstSplashScreen';
import DailySplashScreen from './src/screens/DailySplashScreen';

import { ExpenseProvider } from './ExpenseContext';
import UserDetailsScreen from './src/screens/UserDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
        const checkFirstTime = async () => {
          try {
            const isFirstTime = await AsyncStorage.getItem('isFirstTime');
            
            if (isFirstTime === null) {
              // If no value, it's the first time, set the route to 'FirstSplash'
              setInitialRoute('FirstSplash');
              await AsyncStorage.setItem('isFirstTime', 'false'); // Set 'isFirstTime' to 'false'
            } else {
              // If value exists, it's not the first time, set route to 'DailySplash'
              setInitialRoute('DailySplash');
            }
          } catch (error) {
            console.error("Error reading 'isFirstTime' from AsyncStorage:", error);
            setInitialRoute('FirstSplash'); // Fallback route
          }
        };
    
        checkFirstTime();
      }, []);

    if (initialRoute === null) return null; // Optionally show a spinner or loading indicator here

    const MainApp = () => (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Analytics') {
                        iconName = 'stats-chart';
                    } else if (route.name === 'Profile') {
                        iconName = 'person';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarStyle: {
                    backgroundColor: 'black', // Change the background color of the tab bar
                  },
                tabBarActiveTintColor: '#06D001',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Analytics" component={AnalyticsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );

    return (
        <ExpenseProvider>
            <GestureHandlerRootView style={{ flex: 1 }}> {/* Wrap the NavigationContainer inside GestureHandlerRootView */}
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        {initialRoute === 'FirstSplash' && (
                            <Stack.Screen
                                name="FirstSplash"
                                component={FirstSplashScreen}
                            />
                        )}
                        {initialRoute === 'DailySplash' && (
                            <Stack.Screen
                                name="DailySplash"
                                component={DailySplashScreen}
                            />
                        )}
                        <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
                        <Stack.Screen name="MainApp" component={MainApp} />
                    </Stack.Navigator>
                </NavigationContainer>
            </GestureHandlerRootView>
        </ExpenseProvider>
    );
}
