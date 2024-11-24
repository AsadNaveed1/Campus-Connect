import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';

export default function Search() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <View style={[styles.searchBar, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search" size={24} color={theme.colors.onSurface} style={styles.searchIcon} />
          <TextInput
            style={[styles.textInput, { color: theme.colors.onSurface }]}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoFocus
            placeholderTextColor={theme.colors.onSurface}
            selectionColor={theme.colors.primary}
          />
          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="qr-code-outline"
              size={24}
              color={theme.colors.onSurface}
              style={styles.qrIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 5,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  qrIcon: {
    marginLeft: 8,
    marginRight: 4,
  },
});