import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, TextInput } from "react-native-paper";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthContext } from '../../contexts/AuthContext';

export default function Auth() {
  const user = useAuthContext();
  const auth = getAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      ToastAndroid.show("Account created!", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
    }
  };
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      ToastAndroid.show("Logged in!", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
    }
  };
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
      <View style={styles.container}>
        {user ? (
          <>
            <Text variant="headlineMedium" style={styles.title}>Welcome!</Text>
            <Button mode="contained" onPress={handleLogout} buttonColor="#ED0000">
              Logout
            </Button>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#aaa"
              outlineColor="#ccc"
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor="#aaa"
              outlineColor="#ccc"
            />
            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={handleSignup}>
                Signup
              </Button>
              <Button mode="contained" onPress={handleLogin}>
                Login
              </Button>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    marginBottom: 24,
    color: "#333",
  },
  input: {
    width: "80%",
    marginVertical: 3,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});