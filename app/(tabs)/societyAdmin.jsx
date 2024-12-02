import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, ToastAndroid } from 'react-native';
import { useTheme, Text, ActivityIndicator, Button, TextInput, Menu } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, onSnapshot, getDoc, updateDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firebaseDB } from '../../firebaseConfig';
import EventCard from '../../components/EventCard';
import EditableImage from '../../components/EditableImage';
import PostCard from '../../components/PostCard';
import MerchCard from '../../components/MerchCard';

const SocietyAdmin = () => {
  const theme = useTheme();
  const router = useRouter();
  const societyId = 'un3uYwBfO7O3nxqD67Xi';
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [merch, setMerch] = useState([]);
  const [categories, setCategories] = useState([]);
  const [societyData, setSocietyData] = useState({
    name: '',
    description: '',
    category: '',
    logo: '',
    backgroundImage: '',
  });
  const [activeTab, setActiveTab] = useState('About');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

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
        fetchPostDetails(data.posts);
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
        eventData.sort((a, b) => a.time.seconds - b.time.seconds); // Sort events by date (oldest first)
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    const fetchPostDetails = async (postIds) => {
      try {
        const postPromises = postIds.map(postId => getDoc(doc(firebaseDB, 'posts', postId)));
        const postDocs = await Promise.all(postPromises);
        const postData = postDocs.map(postDoc => ({ id: postDoc.id, ...postDoc.data() }));
        postData.sort((a, b) => b.date.seconds - a.date.seconds); // Sort posts by date (newest first)
        setPosts(postData);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    const fetchMerchDetails = async (merchIds) => {
      try {
        const merchPromises = merchIds.map(merchId => getDoc(doc(firebaseDB, 'merch', merchId)));
        const merchDocs = await Promise.all(merchPromises);
        const merchData = merchDocs.map(merchDoc => ({ id: merchDoc.id, ...merchDoc.data() }));
        merchData.sort((a, b) => a.name.localeCompare(b.name)); // Sort merch by name
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

  const handleNewPostButton = () => {
    router.push({ pathname: '/postAdmin', params: { societyId } });
  };

  const handleNewMerchButton = () => {
    router.push({ pathname: '/merchAdmin', params: { societyId } });
  };

  const handleSave = async () => {
    if (isEditable) {
      try {
        const societyDocRef = doc(firebaseDB, 'societies', societyId);
        await updateDoc(societyDocRef, societyData);
        ToastAndroid.show('Society updated', ToastAndroid.SHORT);
      } catch (error) {
        console.error('Error updating society data:', error);
      }
    }
    setIsEditable(!isEditable);
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

  const renderPosts = () => (
    <View style={styles.postsContainer}>
      {posts.map(item => {
        const currentDate = new Date();
        const itemDate = new Date(item.date.seconds * 1000);
        const isSameDate = currentDate.toDateString() === itemDate.toDateString();

        const formattedDate = isSameDate
          ? itemDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
          : itemDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

        return (
          <PostCard 
            key={item.id} 
            postId={item.id}
            image={item.image} 
            caption={item.caption} 
            societyName={societyData.name}
            date={formattedDate}
            minimal={true}
            admin={true}
            societyId={societyId}
          />
        );
      })}
    </View>
  );

  const renderMerch = () => (
    <View style={styles.merchContainer}>
      {merch.map((item, index) => (
        <View key={item.id} style={index % 2 === 0 ? styles.merchRow : null}>
          <MerchCard 
            id={item.id}
            name={item.name} 
            price={item.price} 
            image={{ uri: item.image }}
            societyId={societyId}
          />
        </View>
      ))}
    </View>
  );

  const renderAbout = () => (
    <View style={styles.aboutContainer}>
      <TextInput
        style={[styles.input]}
        mode="outlined"
        label="Society Name"
        value={societyData.name}
        onChangeText={(text) => setSocietyData({ ...societyData, name: text })}
        theme={{ roundness: 15 }}
        editable={isEditable}
      />
      <TextInput
        style={[styles.input]}
        mode="outlined"
        label="Description"
        value={societyData.description}
        onChangeText={(text) => setSocietyData({ ...societyData, description: text })}
        multiline
        numberOfLines={6}
        theme={{ roundness: 15 }}
        editable={isEditable}
      />
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Category:</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.categoryButton}
              disabled={!isEditable}
            >
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                <Ionicons name="chevron-down" size={16} color={theme.colors.primary} />
                <Text style={{ color: theme.colors.primary, fontSize: 16 }}>
                  {categories.find(category => category.id === societyData.category)?.name || 'Select Category'}
                </Text>
              </View>
            </TouchableOpacity>
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
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.fixedHeader}>
          <View style={styles.bannerContainer}>
            <EditableImage
              imageUri={societyData.backgroundImage}
              setImageUri={(uri) => handleImageUpload(uri, 'backgroundImage')}
              editable={isEditable}
              imagePath={`societies/${societyId}/backgroundImage`}
            />
          </View>
          <View style={styles.logoWrapper}>
            <View style={styles.logoContainer}>
              <EditableImage
                imageUri={societyData.logo}
                setImageUri={(uri) => handleImageUpload(uri, 'logo')}
                editable={isEditable}
                imagePath={`societies/${societyId}/logo`}
              />
            </View>
          </View>
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
            style={[styles.tabButton, activeTab === 'Posts' && { ...styles.activeTab, borderColor: theme.colors.primary }]}
            onPress={() => setActiveTab('Posts')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'Posts' ? theme.colors.primary : theme.colors.onSurface }]}>Posts</Text>
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
        {activeTab === 'Posts' && renderPosts()}
        {activeTab === 'Events' && renderEvents()}
        {activeTab === 'Merch' && renderMerch()}
      </ScrollView>
      <View style={styles.buttonContainer}>
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
        {activeTab === 'Posts' && (
          <Button
            mode="contained"
            onPress={handleNewPostButton}
            style={styles.newEventButton}
            icon={() => <Ionicons name="add" size={24} color={theme.colors.onPrimary} />}
          >
            New Post
          </Button>
        )}
        {activeTab === 'Merch' && (
          <Button
            mode="contained"
            onPress={handleNewMerchButton}
            style={styles.newEventButton}
            icon={() => <Ionicons name="add" size={24} color={theme.colors.onPrimary} />}
          >
            New Merch
          </Button>
        )}
        {activeTab === 'About' && (
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            icon={() => <Ionicons name={isEditable ? "checkmark-outline" : "pencil-outline"} size={18} color={theme.colors.onPrimary} />}
          >
            {isEditable ? "Save" : "Edit"}
          </Button>
        )}
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
  },
  fixedHeader: {
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 160,
  },
  logoWrapper: {
    position: 'absolute',
    top: 120,
    zIndex: 1,
    alignSelf: 'center',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: 'lightgrey',
    borderWidth: 1,
    elevation: 5,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    overflow: 'hidden',
  },
  title: {
    marginTop: 72,
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 2,
    width: '90%',
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
  postsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  merchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  merchRow: {
    flexDirection: 'row',
    flex: 2,
    width: '100%',
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
    marginVertical: 8,
  },
  categoryLabel: {
    marginRight: 8,
    fontSize: 16,
  },
  categoryButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  newEventButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default SocietyAdmin;