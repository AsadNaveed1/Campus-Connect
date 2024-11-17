import React from "react";
import { View, StatusBar } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from "../../contexts/AuthContext";

export default function Home() {
  const user = useAuthContext();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: 24,
        }}
      >
        <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>Home
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: '100%',
          }}
        >
          {user ? (
            <Text variant="bodyMedium">This is your homepage.</Text>
          ) : (
            <Text variant="bodyMedium" style={{ marginBottom: 20 }}>Sign-in to see your personalised homepage.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}