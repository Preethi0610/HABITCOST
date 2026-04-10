import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { CurrencyProvider } from "./src/contexts/CurrencyContext";
import AppNavigator from "./src/navigation/AppNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import { COLORS } from "./src/constants/theme";

function RootNavigator() {
  const { user, loading, onboardingDone, completeOnboarding } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  if (!user) return <LoginScreen />;

  if (!onboardingDone) {
    return (
      <CurrencyProvider>
        <OnboardingScreen onComplete={completeOnboarding} />
      </CurrencyProvider>
    );
  }

  return (
    <CurrencyProvider>
      <AppNavigator />
    </CurrencyProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
