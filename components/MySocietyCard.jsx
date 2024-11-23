import React from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useRouter } from 'expo-router';

export default function MySocietyCard(props) {
  const theme = useTheme();
  const router = useRouter();

  const handlePress = () => {
    router.push('/societyPage');
  };

  return (
    <Pressable 
      onPress={handlePress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? theme.colors.surfaceVariant : theme.colors.surface,
          transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
        },
        styles.card
      ]}
    >
      <View style={[styles.logoContainer, { borderColor: theme.colors.surface }]}>
        <Image source={props.logo} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={[styles.name, { color: theme.colors.onSurface }]}>{props.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 90,
    height: 125,
    borderRadius: 15,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    transition: 'transform 0.1s',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: 'white',
    borderWidth: 3,
    elevation: 5,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: "center",
    marginTop: 8,
  },
});