import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function MySocietyCard({ logo, name }) {
  const theme = useTheme();

  return (
    <View style={styles.card}>
      <View style={[styles.logoContainer, { borderColor: theme.colors.primary}]}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={[styles.name, { color: theme.colors.onSurface }]}>{name}</Text>
    </View>
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
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: 'white',
    borderWidth: 1,
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