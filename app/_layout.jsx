import { AuthProvider } from "../contexts/AuthContext";
import { UserProvider } from "../contexts/UserContext";
import { Provider as PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <UserProvider>
        <PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
          <SafeAreaProvider>
            <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} backgroundColor={colorScheme === 'dark' ? darkTheme.colors.background : lightTheme.colors.background} />
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen name="search" options={{ headerShown: false }} />
              <Stack.Screen name="qrScanner" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="eventPage" options={{ headerShown: false }} />
              <Stack.Screen name="societyPage" options={{ headerShown: false }} />
              <Stack.Screen name="merchPage" options={{ headerShown: false }} />
              <Stack.Screen name="eventAdmin" options={{ headerShown: false }} />
            </Stack>
          </SafeAreaProvider>
        </PaperProvider>
      </UserProvider>
    </AuthProvider>
  );
}