import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Text, IconButton } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import SearchButton from '../../components/SearchButton';

export default function Home() {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Home
        </Text>
        <IconButton
          icon={() => <Ionicons name="add" size={24} color={theme.colors.onBackground} />}
          onPress={() => {}}
        />
      </View>
      <View style={styles.container}>
      </View>
      <SearchButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  container: {
    padding: 24,
    paddingBottom: 100,
  },
});