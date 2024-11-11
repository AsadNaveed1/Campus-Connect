import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, TextInput } from "react-native-paper";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      ToastAndroid.show("Logged in!", ToastAndroid.SHORT);
      router.push('/profile');
    } catch (error) {
      ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      ToastAndroid.show("Account created!", ToastAndroid.SHORT);
      router.replace('/profile');
    } catch (error) {
      ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
    }
  };

  const handleClose = () => {
    router.replace('/profile');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="close" size={24} color="black" onPress={handleClose} />
        </View>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>Sign into</Text>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 42 }}>Campus Connect</Text>
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
              theme={{ roundness: 15 }}
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
              theme={{ roundness: 15 }}
            />
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleLogin} style={styles.button}>
              Login
            </Button>
            <Button mode="outlined" onPress={handleSignup} style={styles.button}>
              Sign Up
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "flex-end",
    right: 8,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    marginBottom: 5,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    elevation: 10,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: 8,
  },
});