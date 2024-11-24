import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function SearchButton() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <FAB
      style={[styles.searchButton, { backgroundColor: theme.colors.primary }]}
      icon={() => <Ionicons name="search" size={24} color={theme.colors.onPrimary} />}
      onPress={() => router.push('/search')}
    />
  );
}

const styles = StyleSheet.create({
  searchButton: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 100,
    borderRadius: 30,
  },
});