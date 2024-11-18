import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, TextInput, useTheme } from "react-native-paper";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const auth = getAuth();
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      ToastAndroid.show("Logged in", ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          ToastAndroid.show("Invalid email address", ToastAndroid.SHORT);
          break;
        case 'auth/user-disabled':
          ToastAndroid.show("User account is disabled", ToastAndroid.SHORT);
          break;
        case 'auth/user-not-found':
          ToastAndroid.show("User not found", ToastAndroid.SHORT);
          break;
        case 'auth/wrong-password':
          ToastAndroid.show("Incorrect password", ToastAndroid.SHORT);
          break;
        default:
          ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
          break;
      }
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      ToastAndroid.show("Account created", ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          ToastAndroid.show("Email is already in use", ToastAndroid.SHORT);
          break;
        case 'auth/invalid-email':
          ToastAndroid.show("Invalid email address", ToastAndroid.SHORT);
          break;
        case 'auth/operation-not-allowed':
          ToastAndroid.show("Operation not allowed", ToastAndroid.SHORT);
          break;
        case 'auth/weak-password':
          ToastAndroid.show("Password is too weak", ToastAndroid.SHORT);
          break;
        default:
          ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
          break;
      }
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="close" size={24} color={theme.colors.onBackground} onPress={handleClose} />
        </View>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text variant="titleMedium" style={[styles.text, { color: theme.colors.onBackground }]}>
              {isSigningUp ? "" : "Sign into"}
            </Text>
            <Text variant="headlineMedium" style={[styles.text, { color: theme.colors.onBackground }]}>
              {isSigningUp ? "Create your account" : "Campus Connect"}
            </Text>
            {isSigningUp ? (
              <>
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={theme.colors.placeholder}
                  outlineColor={theme.colors.outline}
                  theme={{ roundness: 15 }}
                />
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="Bio"
                  value={bio}
                  multiline={true}
                  onChangeText={setBio}
                  placeholderTextColor={theme.colors.placeholder}
                  outlineColor={theme.colors.outline}
                  theme={{ roundness: 15 }}
                />
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
                  placeholderTextColor={theme.colors.placeholder}
                  outlineColor={theme.colors.outline}
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
                  placeholderTextColor={theme.colors.placeholder}
                  outlineColor={theme.colors.outline}
                  theme={{ roundness: 15 }}
                />
              </>
            )}
          </View>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.buttonContainer}>
            {isSigningUp ? (
              <Button
                mode="contained"
                onPress={handleSignup}
                style={styles.button}
              >
                Create Account
              </Button>
            ) : (
              <>
                <Button
                  mode="contained"
                  onPress={() => {
                    if (!email || !password) {
                      ToastAndroid.show("Email and password cannot be empty", ToastAndroid.SHORT);
                    } else {
                      handleLogin();
                    }
                  }}
                  style={styles.button}
                >
                  Login
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {
                    if (!email || !password) {
                      ToastAndroid.show("Email and password cannot be empty", ToastAndroid.SHORT);
                    } else {
                      setIsSigningUp(true);
                    }
                  }}
                  style={styles.button}
                >
                  Sign Up
                </Button>
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#CDCDCD',
    borderBottomWidth: 0,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: 8,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
});