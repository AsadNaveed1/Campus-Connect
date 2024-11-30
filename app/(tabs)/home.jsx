import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import SearchButton from "../../components/SearchButton";
import MagicShake from "../../components/MagicShake";

export default function Home() {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Home
        </Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      </ScrollView>

      <SearchButton />
      <MagicShake />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    marginTop: 8,
    fontWeight: "bold",
  },
  container: {
    padding: 24,
    paddingBottom: 100,
  },
});