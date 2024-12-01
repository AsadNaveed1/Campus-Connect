import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme, Text, ActivityIndicator, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { firebaseDB } from '../../firebaseConfig';
import EventCard from '../../components/EventCard';
import MerchCard from '../../components/MerchCard';

const SocietyAdmin = () => {
  const theme = useTheme();
  const router = useRouter();
  const societyId = 'un3uYwBfO7O3nxqD67Xi';
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [merch, setMerch] = useState([]);
  const [societyData, setSocietyData] = useState(null);
  const [activeTab, setActiveTab] = useState('Events');

  useEffect(() => {
    const unsubscribeSociety = onSnapshot(doc(firebaseDB, 'societies', societyId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSocietyData(data);
        fetchEventDetails(data.events);
        fetchMerchDetails(data.merch);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching society data:', error);
      setLoading(false);
    });

    const fetchEventDetails = async (eventIds) => {
      try {
        const eventPromises = eventIds.map(eventId => getDoc(doc(firebaseDB, 'events', eventId)));
        const eventDocs = await Promise.all(eventPromises);
        const eventData = eventDocs.map(eventDoc => ({ id: eventDoc.id, ...eventDoc.data() }));
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    const fetchMerchDetails = async (merchIds) => {
      try {
        const merchPromises = merchIds.map(merchId => getDoc(doc(firebaseDB, 'merch', merchId)));
        const merchDocs = await Promise.all(merchPromises);
        const merchData = merchDocs.map(merchDoc => ({ id: merchDoc.id, ...merchDoc.data() }));
        setMerch(merchData);
      } catch (error) {
        console.error('Error fetching merch details:', error);
      }
    };

    return () => {
      unsubscribeSociety();
    };
  }, [societyId]);

  const handleBackButton = () => {
    router.back();
  };

  const handleNewEventButton = () => {
    router.push({ pathname: '/eventAdmin', params: { societyId } });
  };

  const renderEvents = () => (
    <View style={styles.eventsContainer}>
      {events.map(event => (
        <EventCard
          key={event.id}
          eventId={event.id}
          date={new Date(event.time.seconds * 1000).toLocaleDateString()}
          title={event.name}
          location={event.location}
          imageUrl={event.backgroundImage}
          admin={true}
          societyId={societyId}
          minimal={true}
        />
      ))}
    </View>
  );

  const renderMerch = () => (
    <View style={styles.merchContainer}>
      {merch.map(item => (
        <MerchCard
          key={item.id}
          id={item.id}
          name={item.name}
          price={item.price}
          image={{ uri: item.image }}
          societyId={societyId}
        />
      ))}
    </View>
  );

  const renderAbout = () => (
    <View style={styles.aboutContainer}>
      <Text style={[styles.aboutText, { color: theme.colors.onBackground }]}>
        {societyData.description}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
            {societyData.name} Admin Panel
          </Text>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'About' && { ...styles.activeTab, borderColor: theme.colors.primary }]}
            onPress={() => setActiveTab('About')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'About' ? theme.colors.primary : theme.colors.onSurface }]}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Events' && { ...styles.activeTab, borderColor: theme.colors.primary }]}
            onPress={() => setActiveTab('Events')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'Events' ? theme.colors.primary : theme.colors.onSurface }]}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Merch' && { ...styles.activeTab, borderColor: theme.colors.primary }]}
            onPress={() => setActiveTab('Merch')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'Merch' ? theme.colors.primary : theme.colors.onSurface }]}>Merch</Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'About' && renderAbout()}
        {activeTab === 'Events' && renderEvents()}
        {activeTab === 'Merch' && renderMerch()}
      </ScrollView>
      {activeTab === 'Events' && (
        <Button
          mode="contained"
          onPress={handleNewEventButton}
          style={styles.newEventButton}
          icon={() => <Ionicons name="add" size={24} color={theme.colors.onPrimary} />}
        >
          New Event
        </Button>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginLeft: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 2,
    width: '75%',
    alignSelf: 'center',
  },
  tabButton: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  merchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  aboutContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  aboutText: {
    fontSize: 16,
  },
  newEventButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 30,
  },
});

export default SocietyAdmin;