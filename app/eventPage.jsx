import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Image, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDB } from '../firebaseConfig';
import MapCard from '../components/MapCard';

const { height: screenHeight } = Dimensions.get('window');

const EventPage = () => {
  const { eventId } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [societyData, setSocietyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventDoc = await getDoc(doc(firebaseDB, 'events', eventId));
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          const societyDoc = await getDoc(doc(firebaseDB, 'societies', eventData.society));
          if (societyDoc.exists()) {
            setTimeout(() => {
              setEventData(eventData);
              setSocietyData(societyDoc.data());
              setLoading(false);
            }, 200);
          }
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

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

  if(loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface }]}>
          <Image
            source={{ uri: eventData.backgroundImage }}
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
          <Image source={{ uri: societyData.logo }} style={styles.circleImage} />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onSurface }]}>{eventData.name}</Text>
            <View style={[styles.feeBadge, { backgroundColor: theme.colors.surface }]}>
              <Text variant="bodyMedium" style={[styles.feeText, { color: theme.colors.onSurface, fontWeight: 'bold' }]}>${eventData.fee}</Text>
            </View>
          </View>
          <Text variant="bodyMedium" style={[styles.societyName, { color: 'grey' }]}>{societyData.name}</Text>
          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="grey" />
              <Text variant="bodyMedium" style={[styles.detailText, { color: 'grey' }]}>{new Date(eventData.time.seconds * 1000).toLocaleDateString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={16} color="grey" />
              <Text variant="bodyMedium" style={[styles.detailText, { color: 'grey' }]}>{new Date(eventData.time.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-sharp" size={16} color="grey" />
              <Text variant="bodyMedium" style={[styles.detailText, { color: 'grey' }]}>{eventData.location}</Text>
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            <Text variant="bodyMedium" style={[styles.descriptionText, { color: theme.colors.onSurface }]}>
              {eventData.description}
            </Text>
          </View>
        </View>
        {/* <MapCard
          latitude={eventData?.latitude || 22.3193}
          longitude={eventData?.longitude || 114.1694}
          title={eventData?.name || ""}
          description={eventData?.location || ""}
        /> */}
      </ScrollView>
      <View style={styles.buttonContainer}>
      <Button mode="contained" onPress={() => setHasJoined(!hasJoined)} style={styles.joinButton}>
        {hasJoined ? (
          'Joined'
        ) : (
          'Join'
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: screenHeight * 0.4,
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  circleImageContainer: {
    position: 'absolute',
    top: screenHeight * 0.33,
    left: 20,
    zIndex: 1,
    width: 80,
    height: 80,
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 5,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
    borderWidth: 1,
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