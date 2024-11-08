import React, { useState } from "react";
import { Alert, View, TextInput, StyleSheet, Text, Button } from "react-native";
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
      Alert.alert("Account created!");
    } catch (error) {
      Alert.alert("Error: ", error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Logged in!");
    } catch (error) {
      Alert.alert("Error: ", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged out!");
    } catch (error) {
      Alert.alert("Error: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome!</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title="Logout" onPress={handleLogout} color="#FF0000" />
            </View>
          </View>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title="Signup" onPress={handleSignup} color="#007BFF" />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Login" onPress={handleLogin} color="#007BFF" />
            </View>
          </View>
        </>
      )}
    </View>
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
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
});