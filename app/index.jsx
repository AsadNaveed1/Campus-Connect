import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebaseConfig";

const Index = () => {
  const theme = useTheme();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        router.replace("/home");
      }
      unsubscribe();
    });
  }, []);

  const handleUserSignIn = () => {
    router.replace("/register");
  };

  const handleSocietySignIn = () => {
    router.replace("/admin");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Text variant="titleMedium" style={[styles.subtitle, { color: theme.colors.onBackground }]}>
          Welcome to
        </Text>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Campus Connect
        </Text>
        <Button mode="contained" onPress={handleUserSignIn} style={styles.button}>
          Sign in as User
        </Button>
        <Button mode="contained" onPress={handleSocietySignIn} style={styles.button}>
          Sign in as Society
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  subtitle: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  title: {
    marginBottom: 24,
    fontWeight: "bold",
  },
  button: {
    marginTop: 16,
    width: "80%",
  },
});

export default Index;