import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, useTheme } from 'react-native-paper';

export default function SocietyCard(props) {
  const theme = useTheme();

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: theme.colors.onSurface }]}>{props.name}</Text>
        
        <Text style={[styles.members, { color: theme.colors.onSurfaceVariant }]}>{props.members} members</Text>
        <View style={[styles.categoryLabel, { backgroundColor: 'darkmagenta' }]}>
          <Text style={styles.category}>{props.category}</Text>
          </View>
      </View>
      <View style={styles.logoContainer}>
        <Image source={props.logoUrl} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 25,
    elevation: 5,
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "white",
    alignItems: "center",
    margin: 5,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 1,
  },
  categoryLabel: {
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 20,
  },
  category: {
    color: 'white',
    fontSize: 10,
    fontWeight: "bold",
  },
  members: {
    fontSize: 12,
  },
});