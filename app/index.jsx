import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserContext } from "../contexts/UserContext";

const Index = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user, setUser } = useUserContext();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/home");
      }
    });

    return () => unsubscribe();
  }, [auth, router, setUser]);

  const handleUserSignIn = () => {
    router.push("/register");
  };

  const handleSocietySignIn = () => {
    router.push("/admin");
  };

  if (user) {
    return null;
  }

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