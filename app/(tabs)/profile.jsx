import React, { useEffect } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from "react-native-paper";
import { getAuth, signOut } from 'firebase/auth';
import { useAuthContext } from '../../contexts/AuthContext';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const user = useAuthContext();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      ToastAndroid.show("Logged out!", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
    }
  };

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
        <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>Profile</Text>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: '100%',
          }}
        >
          {user ? (
            <>
              <Text variant="titleMedium" style={styles.title}>Welcome!</Text>
              <Button
                mode="contained"
                onPress={handleLogout}
                buttonColor="#ED0000"
                icon={() => <Ionicons name="exit-outline" size={24} color="white" />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Text variant="bodyMedium" style={{ marginBottom: 20 }}>Sign-in to see your profile.</Text>
              <Link replace href="/register" asChild>
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

const styles = StyleSheet.create({
  title: {
    marginBottom: 24,
    color: "#333",
  },
});