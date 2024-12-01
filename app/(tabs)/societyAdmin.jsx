import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, ToastAndroid } from 'react-native';
import { useTheme, Text, ActivityIndicator, Button, TextInput, IconButton, Menu, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, onSnapshot, getDoc, updateDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
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
  const [categories, setCategories] = useState([]);
  const [societyData, setSocietyData] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [activeTab, setActiveTab] = useState('Events');
  const [isEditable, setIsEditable] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryQuery = query(collection(firebaseDB, 'categories'), orderBy('name'));
        const categoryDocs = await getDocs(categoryQuery);
        const categoryData = categoryDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

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

    fetchCategories();
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

  const handleSave = async () => {
    try {
      const societyDocRef = doc(firebaseDB, 'societies', societyId);
      await updateDoc(societyDocRef, societyData);
      ToastAndroid.show('Society updated', ToastAndroid.SHORT);
      setIsEditable(false);
    } catch (error) {
      console.error('Error updating society data:', error);
    }
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
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface }]}
        mode="outlined"
        label="Society Name"
        value={societyData.name}
        onChangeText={(text) => setSocietyData({ ...societyData, name: text })}
        theme={{ roundness: 15 }}
        editable={isEditable}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface }]}
        mode="outlined"
        label="Description"
        value={societyData.description}
        onChangeText={(text) => setSocietyData({ ...societyData, description: text })}
        multiline
        theme={{ roundness: 15 }}
        editable={isEditable}
      />
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Category:</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="text"
              onPress={() => setMenuVisible(true)}
              disabled={!isEditable}
              style={styles.categoryButton}
              contentStyle={{ flexDirection: 'row-reverse' }}
              icon={isEditable ? () => <Ionicons name="chevron-down" size={16} color={theme.colors.primary} /> : null}>
              {categories.find(category => category.id === societyData.category)?.name || 'Select Category'}
            </Button>
          }
        >
          {categories.map(category => (
            <Menu.Item
              key={category.id}
              onPress={() => {
                setSocietyData({ ...societyData, category: category.id });
                setMenuVisible(false);
              }}
              title={category.name}
            />
          ))}
        </Menu>
      </View>
      {isEditable && (
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          icon={() => <Ionicons name="save-outline" size={18} color={theme.colors.onPrimary} />}
        >
          Save
        </Button>
      )}
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
          <IconButton
            icon={() => <Ionicons name={isEditable ? "checkmark-outline" : "pencil-outline"} size={24} color={theme.colors.primary} />}
            onPress={() => setIsEditable(!isEditable)}
          />
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
    flex: 1,
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
  input: {
    width: '100%',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    marginRight: 8,
    fontSize: 16,
  },
  categoryButton: {
    flex: 1,
  },
  saveButton: {
    marginTop: 16,
  },
  newEventButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 30,
  },
});

export default SocietyAdmin;