import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

const SearchResult = ({ id, title, subtitle, type }) => {
  const router = useRouter();
  const theme = useTheme();

  const handlePress = () => {
    if (type === 'society') {
      router.push({ pathname: '/societyPage', params: { societyId: id } });
    } else if (type === 'event') {
      router.push({ pathname: '/eventPage', params: { eventId: id } });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
    >
      {type === 'event' && (
        <>
          <Text style={[styles.title, { color: theme.colors.onPrimaryContainer }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: theme.colors.onPrimaryContainer }]}>{subtitle}</Text>}
        </>
      )}
      {type === 'society' && (
        <Text style={[styles.title, { color: theme.colors.onPrimaryContainer }]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  pressed: {
    opacity: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
});

export default SearchResult;