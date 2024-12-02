import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from "../../contexts/AuthContext";
import { useTheme, Text } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import EventCard from "../../components/EventCard";
import MyEventCard from "../../components/MyEventCard";
import SearchButton from "../../components/SearchButton";
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { firebaseDB } from '../../firebaseConfig';

export default function Events() {
  const user = useAuthContext();
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const eventsRef = useRef([]);
  const userRef = useRef(user);

  useEffect(() => {
    if (!user) return;

    const unsubscribeEvents = onSnapshot(collection(firebaseDB, 'events'), async (snapshot) => {
      const eventsData = await Promise.all(snapshot.docs.map(async (eventDoc) => {
        const eventData = eventDoc.data();
        const societyDoc = await getDoc(doc(firebaseDB, 'societies', eventData.society));
        const societyData = societyDoc.exists() ? societyDoc.data() : {};
        return {
          ...eventData,
          id: eventDoc.id,
          societyName: societyData.name,
          societyLogo: societyData.logo,
        };
      }));
      eventsData.sort((a, b) => a.time.seconds - b.time.seconds);
      eventsRef.current = eventsData;
      setEvents(eventsData);

      if (userRef.current && userRef.current.joinedEvents) {
        const joinedEvents = eventsData.filter(event => userRef.current.joinedEvents.includes(event.id));
        setMyEvents(joinedEvents);
      }
    }, (error) => {
      console.error("Error fetching events:", error);
    });

    const unsubscribeUser = onSnapshot(doc(firebaseDB, 'users', user.email), (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userRef.current = userData;
        const joinedEvents = eventsRef.current.filter(event => userData.joinedEvents.includes(event.id));
        setMyEvents(joinedEvents);
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeUser();
    };
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Events
        </Text>
      </View>
      {user ? (
        <>
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}> 
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              My Events
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.myEventsScroll}>
              {myEvents.length > 0 ? (
                myEvents.map((event) => (
                  <MyEventCard
                    key={event.id}
                    eventId={event.id}
                    eventDate={new Date(event.time.seconds * 1000).toLocaleDateString()}
                    eventName={event.name}
                    societyName={event.societyName}
                    circleImageUrl={{ uri: event.societyLogo }}
                  />
                ))
              ) : (
                <Text style={{ color: theme.colors.onBackground }}>You have not joined any events.</Text>
              )}
            </ScrollView>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              All Events
            </Text>
            <View>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  eventId={event.id}
                  date={new Date(event.time.seconds * 1000).toLocaleDateString()}
                  title={event.name}
                  subtitle={event.societyName}
                  location={event.location}
                  imageUrl={event.backgroundImage}
                  circleImageUrl={{ uri: event.societyLogo }}
                />
              ))}
            </View>
          </ScrollView>
          <SearchButton />
        </>
      ) : null}
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
    marginTop: 8,
    fontWeight: 'bold',
  },
  container: {
    padding: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  myEventsScroll: {
    marginBottom: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});