import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from "../../contexts/AuthContext";
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
            <>
              <Text variant="bodyMedium" style={{ marginBottom: 20 }}>Sign-in to see your personalised homepage.</Text>
              <Link href="/profile" asChild>
                <Button
                  mode="contained"
                  icon={() => <Ionicons name="person-circle-outline" size={24} color="white" />}
                >
                  Sign-in
                </Button>
              </Link>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}