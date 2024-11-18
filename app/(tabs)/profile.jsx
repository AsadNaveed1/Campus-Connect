import React from "react";
import { View, StyleSheet, ToastAndroid, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, useTheme } from "react-native-paper";
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from "../../contexts/UserContext";

export default function Profile() {
  const auth = getAuth();
  const router = useRouter();
  const theme = useTheme();
  const user = useUserContext();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      ToastAndroid.show("Logged out", ToastAndroid.SHORT);
      router.push('/register');
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
        {user && (
          <Card style={[styles.idCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleLarge" style={[styles.name, { color: theme.colors.onSurface }]}>{user.name}</Text>
                <Image
                  source={require('../../assets/images/hku.png')} 
                  style={styles.profileImage}
                />
              </View>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{user.bio}</Text>
            </Card.Content>
          </Card>
        )}
        <View style={styles.content}>
          {user ? (
            <Button
              mode="contained"
              onPress={handleLogout}
              style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
              icon={() => <Ionicons name="exit-outline" size={24} color={theme.colors.onError} />}
            >
              Logout
            </Button>
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
    marginBottom: 16,
  },
  idCard: {
    width: '100%',
    minHeight: 180,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#CDCDCD',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  signInPrompt: {
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 16,
  },
});