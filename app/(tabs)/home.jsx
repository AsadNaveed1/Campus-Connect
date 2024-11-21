import React from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import { Text, useTheme, FAB } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from "../../contexts/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Home() {
  const user = useAuthContext();
  const theme = useTheme();
  const router = useRouter();

  const handleFabPress = () => {
    router.push('/search');
  };

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
        <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>Home</Text>
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
        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          icon={() => <Ionicons name="search" size={24} color={theme.colors.onPrimary} />}
          onPress={handleFabPress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: '2%',
    bottom: '15%',
  },
});