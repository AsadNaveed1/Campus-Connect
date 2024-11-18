import React from "react";
import { View, StatusBar } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from "../../contexts/AuthContext";

export default function Home() {
  const user = useAuthContext();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: 24,
        }}
      >
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>Home</Text>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: '100%',
          }}
        >
          {user ? (
            <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>This is your homepage.</Text>
          ) : (
            <Text variant="bodyMedium" style={{ marginBottom: 20, color: theme.colors.onBackground }}>Sign-in to see your personalised homepage.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}