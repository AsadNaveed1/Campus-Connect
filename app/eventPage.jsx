import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Image, StyleSheet } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

const EventPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const enableNotifications = async () => {
    setNotificationsEnabled(true);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notifications Enabled",
        body: "You will receive notifications for this event.",
      },
      trigger: null,
    });
  };

  const disableNotifications = async () => {
    setNotificationsEnabled(false);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notifications Disabled",
        body: "You will not receive notifications for this event.",
      },
      trigger: null,
    });
  };

  const handleBackButton = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface }]}>
          <Image
            source={{ uri: 'https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg' }}
            style={styles.image}
          />
          <IconButton
            icon={() => <Ionicons name="chevron-back" size={24} color="#fff" />}
            size={24}
            onPress={handleBackButton}
            style={styles.backButton}
          />
        </View>
        <View style={styles.circleImageContainer}>
          <Image source={require('../assets/images/hku.png')} style={styles.circleImage} />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onSurface }]}>Dummy Event Title</Text>
            <View style={[styles.feeBadge, { backgroundColor: theme.colors.surface }]}>
              <Text variant="bodyMedium" style={[styles.feeText, { color: theme.colors.onSurface, fontWeight: 'bold' }]}>$0</Text>
            </View>
          </View>
          <Text variant="bodyMedium" style={[styles.societyName, { color: 'grey' }]}>Dummy Society</Text>
          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="grey" />
              <Text variant="bodyMedium" style={[styles.detailText, { color: 'grey' }]}>January 1, 2025</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={16} color="grey" />
              <Text variant="bodyMedium" style={[styles.detailText, { color: 'grey' }]}>12:00 PM - 3:00 PM</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-sharp" size={16} color="grey" />
              <Text variant="bodyMedium" style={[styles.detailText, { color: 'grey' }]}>Dummy Location</Text>
            </View>
          </View>
          <ScrollView style={styles.descriptionContainer} showsVerticalScrollIndicator={false}>
            <Text variant="bodyMedium" style={[styles.descriptionText, { color: theme.colors.onSurface }]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </ScrollView>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => {}} style={styles.joinButton}>
          Join
        </Button>
        <IconButton
          icon={() => (
            <Ionicons
              name={notificationsEnabled ? "notifications-off" : "notifications"}
              size={24}
              color={theme.colors.onBackground}
            />
          )}
          size={24}
          onPress={notificationsEnabled ? disableNotifications : enableNotifications}
          style={styles.iconButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '40%',
  },
  image: {
    resizeMode: 'fill',
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  circleImageContainer: {
    position: 'absolute',
    top: '33%',
    left: '5%',
    zIndex: 1,
    width: 80,
    height: 80,
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 5,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 12,
  },
  detailsContainer: {
    padding: 15,
    paddingTop: 30,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 8,
    marginBottom: 2,
    marginTop: 8,
  },
  feeBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: '60%',
    flexShrink: 1,
  },
  feeText: {
    fontWeight: 'bold',
  },
  societyName: {
    fontWeight: 'bold',
    marginTop: 4,
    marginLeft: 8,
  },
  eventDetails: {
    marginTop: 15,
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 6,
  },
  descriptionContainer: {
    maxHeight: 200,
    marginTop: 15,
  },
  descriptionText: {
    fontSize: 14,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  joinButton: {
    flex: 1,
    marginRight: 8,
  },
  iconButton: {
    marginLeft: 8,
  },
});

export default EventPage;