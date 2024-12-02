import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, TextInput, useTheme } from "react-native-paper";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useUserContext } from "../contexts/UserContext";
import { firebaseDB } from "../firebaseConfig";

export default function Register() {
  const auth = getAuth();
  const router = useRouter();
  const theme = useTheme();
  const { setUser } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [universityID, setUniversityID] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(firebaseDB, "users", user.email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
      }
      ToastAndroid.show("Logged in", ToastAndroid.SHORT);
      router.replace('/home');
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        name: name,
        bio: bio,
        degree: degree,
        major: major,
        year: parseInt(year, 10),
        universityID: universityID,
        joinedEvents: [],
        joinedSocieties: [],
        profilePicture: ""
      };

      await setDoc(doc(firebaseDB, "users", user.email), userData);
      setUser(userData);
      ToastAndroid.show("Account created", ToastAndroid.SHORT);
      router.replace('/home');
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
                  label="Degree"
                  value={degree}
                  onChangeText={setDegree}
                  placeholderTextColor={theme.colors.placeholder}
                  outlineColor={theme.colors.outline}
                  theme={{ roundness: 15 }}
                />
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="Major"
                  value={major}
                  onChangeText={setMajor}
                  placeholderTextColor={theme.colors.placeholder}
                  outlineColor={theme.colors.outline}
                  theme={{ roundness: 15 }}
                />
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="Year"
                  value={year}
                  onChangeText={(text) => setYear(text.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.placeholder}
                  outlineColor={theme.colors.outline}
                  theme={{ roundness: 15 }}
                />
                <TextInput
                  style={styles.input}
                  mode="outlined"
                  label="University ID"
                  value={universityID}
                  onChangeText={setUniversityID}
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
    elevation: 5,
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