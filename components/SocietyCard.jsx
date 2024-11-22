import React from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function SocietyCard(props) {
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
        },
        styles.cardContainer
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: theme.colors.onSurface }]}>{props.name}</Text>
        <Text style={[styles.members, { color: theme.colors.onSurfaceVariant }]}>{props.members} members</Text>
        <View style={[styles.categoryLabel, { backgroundColor: props.categoryColor }]}>
          <Text style={[styles.category, { color: props.categoryTextColor }]}>{props.category}</Text>
        </View>
      </View>
      <View style={styles.logoContainer}>
        <Image source={props.logoUrl} style={styles.logo} resizeMode="contain" />
      </View>
    </Pressable>
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
    fontSize: 10,
    fontWeight: "bold",
  },
  members: {
    fontSize: 12,
  },
});