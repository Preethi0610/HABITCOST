import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Home, List, BarChart2, Award } from "lucide-react-native";

import HomeScreen from "../screens/HomeScreen";
import HabitsScreen from "../screens/HabitsScreen";
import InsightsScreen from "../screens/InsightsScreen";
import GoalsScreen from "../screens/GoalsScreen";
import AddHabitScreen from "../screens/AddHabitScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopColor: "transparent",
          height: 62,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.darkGray,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "500" },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2} /> }} />
      <Tab.Screen name="Habits" component={HabitsScreen}
        options={{ tabBarIcon: ({ color, size }) => <List size={size} color={color} strokeWidth={2} /> }} />
      <Tab.Screen name="Insights" component={InsightsScreen}
        options={{ tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} strokeWidth={2} /> }} />
      <Tab.Screen name="Goals" component={GoalsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Award size={size} color={color} strokeWidth={2} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="AddHabit" component={AddHabitScreen} options={{ presentation: "modal" }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ presentation: "modal" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
