import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, ToastAndroid, Image, ImageBackground } from 'react-native';
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
    logo: '',
    backgroundImage: '',
  });
  const [activeTab, setActiveTab] = useState('Events');
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

  const handleNewEventButton = () => {
    router.push({ pathname: '/eventAdmin', params: { societyId } });
  };

  const handleSave = async () => {
    try {
      const societyDocRef = doc(firebaseDB, 'societies', societyId);
      await updateDoc(societyDocRef, societyData);
      ToastAndroid.show('Society updated', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error updating society data:', error);
    }
  };

  const handleImageUpload = async (uri, type) => {
    try {
      const updatedData = { ...societyData, [type]: uri };
      setSocietyData(updatedData);
      const societyDocRef = doc(firebaseDB, 'societies', societyId);
      await updateDoc(societyDocRef, updatedData);
    } catch (error) {
      console.error('Error uploading image:', error);
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
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface }]}
        mode="outlined"
        label="Description"
        value={societyData.description}
        onChangeText={(text) => setSocietyData({ ...societyData, description: text })}
        multiline
        theme={{ roundness: 15 }}
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
              style={styles.categoryButton}
              contentStyle={{ flexDirection: 'row-reverse' }}
              icon={() => <Ionicons name="chevron-down" size={16} color={theme.colors.primary} />}>
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
      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        icon={() => <Ionicons name="save-outline" size={18} color={theme.colors.onPrimary} />}
      >
        Save
      </Button>
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
      <View style={styles.fixedHeader}>
        <ImageBackground
          source={{ uri: societyData.backgroundImage }}
          style={styles.societyInfo}
          resizeMode="cover"
        >
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: societyData.logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </ImageBackground>
      </View>
      <View style={styles.detailsContainer}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {societyData.name} Admin Panel
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: theme.colors.background }}>
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
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  societyInfo: {
    height: 160,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'lightgrey',
    borderWidth: 1,
    elevation: 5,
    bottom: -20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    zIndex: 1,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  detailsContainer: {
    marginVertical: 20,
    marginHorizontal: 16,
  },
  title: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
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