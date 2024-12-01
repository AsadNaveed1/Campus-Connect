import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SocietyAdmin = () => {
  const theme = useTheme();
  const router = useRouter();
  const societyId = 'eNcXrya4mPAfX7CbIDbE';

  const navigateToEventAdminWithId = () => {
    router.push({ pathname: '/eventAdmin', params: { eventId: '', societyId } });
  };

  const navigateToEventAdminWithoutId = () => {
    router.push({ pathname: '/eventAdmin', params: { societyId } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={navigateToEventAdminWithId}
          style={styles.button}
          icon={() => <Ionicons name="navigate" size={18} color={theme.colors.onPrimary} />}
        >
          Go to EventAdmin with eventId
        </Button>
        <Button
          mode="contained"
          onPress={navigateToEventAdminWithoutId}
          style={styles.button}
          icon={() => <Ionicons name="navigate" size={18} color={theme.colors.onPrimary} />}
        >
          Go to EventAdmin without eventId
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  button: {
    marginBottom: 16,
    width: '80%',
  },
});

export default SocietyAdmin;