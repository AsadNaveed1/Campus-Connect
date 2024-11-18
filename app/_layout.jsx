import { AuthProvider } from "../contexts/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

export default function RootLayout() {
  const isDarkMode = false;

  return (
    <AuthProvider>
      <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? darkTheme.colors.background : lightTheme.colors.background} />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}