import React from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, useTheme } from "react-native-paper";
import { getAuth, signOut } from 'firebase/auth';
import { useAuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const user = useAuthContext();
  const auth = getAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      ToastAndroid.show("Logged out!", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
    }
  };

  const handleSignIn = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>Profile</Text>
        <View style={styles.content}>
          {user ? (
            <>
              <Text variant="titleMedium" style={[styles.welcome, { color: theme.colors.onBackground }]}>Welcome!</Text>
              <Button
                mode="contained"
                onPress={handleLogout}
                style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
                icon={() => <Ionicons name="exit-outline" size={24} color={theme.colors.onError} />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Text variant="bodyMedium" style={[styles.signInPrompt, { color: theme.colors.onBackground }]}>Sign-in to see your profile.</Text>
              <Button
                mode="contained"
                onPress={handleSignIn}
                icon={() => <Ionicons name="person-circle-outline" size={24} color={theme.colors.onPrimary} />}
              >
                Sign-in
              </Button>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  welcome: {
    marginBottom: 24,
  },
  signInPrompt: {
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 16,
  },
});