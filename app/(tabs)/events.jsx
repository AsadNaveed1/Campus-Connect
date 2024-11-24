import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from "../../contexts/AuthContext";
import { useTheme, Text, IconButton } from "react-native-paper";
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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firebaseDB, 'events'), async (snapshot) => {
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
      setEvents(eventsData);
    }, (error) => {
      console.error("Error fetching events:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Events
        </Text>
        <IconButton
          icon={() => <Ionicons name="" size={24} color={theme.colors.onBackground} />}
          onPress={() => {}}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}> 
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          My Events
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.myEventsScroll}>
          {/* <MyEventCard
            circleImageUrl={require('../../assets/images/hku.png')}
            eventName="Event Name"
            societyName="Society Name"
            eventDate="25/09/2024"
          />
          <MyEventCard
            circleImageUrl={require('../../assets/images/hku.png')}
            eventName="Another Event"
            societyName="Another Society"
            eventDate="30/09/2024"
          />
          <MyEventCard
            circleImageUrl={require('../../assets/images/hku.png')}
            eventName="Yet Another Event"
            societyName="Cool Society"
            eventDate="05/10/2024"
          /> */}
          {events.map((event) => (
            <MyEventCard
              key={event.id}
              eventId={event.id}
              eventDate={new Date(event.time.seconds * 1000).toLocaleDateString()}
              eventName={event.name}
              societyName={event.societyName}
              circleImageUrl={{ uri: event.societyLogo }}
            />
          ))}
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
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  myEventsScroll: {
    marginBottom: 16,
  },
});