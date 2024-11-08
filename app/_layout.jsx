import { AuthProvider } from "../contexts/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </AuthProvider>
  );
}