import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { useTheme, Text, IconButton, Button, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDB } from '../firebaseConfig';
import EventCard from '../components/EventCard';
import MerchCard from '../components/MerchCard';
import PostCard from '../components/PostCard';

const SocietyPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { societyId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Posts');
  const [societyData, setSocietyData] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [merch, setMerch] = useState([]);

  useEffect(() => {
    const fetchSocietyData = async () => {
      try {
        const societyDoc = await getDoc(doc(firebaseDB, 'societies', societyId));
        if (societyDoc.exists()) {
          const data = societyDoc.data();
          const categoryDoc = await getDoc(doc(firebaseDB, 'categories', data.category));
          if (categoryDoc.exists()) {
            setCategoryName(categoryDoc.data().name);
          }
          setSocietyData(data);
          fetchEventDetails(data.events);
          fetchMerchDetails(data.merch);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching society data:', error);
      }
    };

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

    if (societyId) {
      fetchSocietyData();
    }
  }, [societyId]);

  const handleBackButton = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const posts = [
    {id: 1, image: 'https://image.jimcdn.com/app/cms/image/transf/dimension=1190x10000:format=jpg/path/sa6549607c78f5c11/image/ia549b5935af7218d/version/1554203275/glastonbury-festival-best-summer-music-festivals.jpg',
      caption: 'This is a wonderful moment captured during our recent society event. The energy and enthusiasm of our members were truly inspiring. We had a fantastic time engaging in various activities, sharing knowledge, and building lasting connections. The event was a testament to the vibrant community we have built together. Looking forward to many more such memorable moments with all of you. Stay tuned for more updates and events. #SocietyLife #Community #Events #Memories', 
      numLikes: 106,
    },
    
    { id: 2, image: 'https://www.anarapublishing.com/wp-content/uploads/elementor/thumbs/photo-1506157786151-b8491531f063-o67khcr8g8y3egfjh6eh010ougiroekqaq5cd8ly88.jpeg', 
      caption: 'A great event by the community.',
      numLikes: 92,
    },

    { id: 3, image: 'https://s1.it.atcdn.net/wp-content/uploads/2020/01/Hero-Holi-Festival-India-800x600.jpg', 
      caption: 'Moments that matter.',
      numLikes: 37,
    },

    { id: 4, image: 'https://www.discoverhongkong.com/content/dam/dhk/intl/explore/culture/mid-autumn-festival-traditions-festivities-and-delicacies/mid-autumn-festival-traditions-festivities-and-delicacies-1920x1080.jpg', 
      caption: 'Stay connected, stay inspired!',
      numLikes: 54,
    },
  ];

  const renderHeader = () => (
    <>
      <IconButton
        icon={() => <Ionicons name="chevron-back" size={24} color="#fff" />}
        size={24}
        onPress={handleBackButton}
        style={styles.backButton}
      />

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

      <View style={styles.detailsContainer}>
        <View style={styles.nameContainer}>
          <Text style={[styles.name, { color: theme.colors.onBackground }]}>
            {societyData.name}
          </Text>
          <IconButton
            icon={() => <Ionicons name="qr-code" size={16} color="grey" />}
            size={18}
            style={[styles.qrButton, { backgroundColor: 'rgba(128, 128, 128, 0.1)' }]}
          />
        </View>
        <Button mode="text" style={styles.joinButton}>Join Us</Button>
        <View style={styles.tagsContainer}>
          <Text style={[styles.tag, { backgroundColor: theme.colors.primaryContainer, color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }]}>{societyData.members} Members</Text>
          <Text style={[styles.tag, { backgroundColor: theme.colors.primaryContainer, color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }]}>{categoryName}</Text>
        </View>
        <Text style={[styles.details, { color: theme.colors.onBackground }]}>
          {societyData.description}
        </Text>
      </View>
    </>
  );

  const renderPosts = () => (
    <View style={styles.postsContainer}>
      <View style={styles.postsRow}>
        {posts.map(item => (
          <PostCard 
            key={item.id} 
            image={item.image} 
            caption={item.caption} 
            numLikes={item.numLikes}
          />
        ))}
      </View>
    </View>
  );

  const renderShop = () => (
    <View style={styles.shopContainer}>
      <View style={styles.shopRow}>
        {merch.map(item => (
          <MerchCard 
            key={item.id} 
            image={{ uri: item.image }} 
            title={item.name} 
            price={item.price} 
            onPress={() => {}}
          />
        ))}
      </View>
    </View>
  );

  const renderEvents = () => (
    <View style={styles.eventsContainer}>
      {events.map(event => (
        <View key={event.id}>
          <EventCard
            eventId={event.id}
            date={new Date(event.time.seconds * 1000).toLocaleDateString()}
            title={event.name}
            location={event.location}
            imageUrl={event.backgroundImage}
            minimal
          />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: theme.colors.background }}>
        {renderHeader()}

        <View style={styles.tabContainer}>
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
            style={[styles.tabButton, activeTab === 'Shop' && { ...styles.activeTab, borderColor: theme.colors.primary }]}
            onPress={() => setActiveTab('Shop')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'Shop' ? theme.colors.primary : theme.colors.onSurface }]}>Shop</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'Posts' && renderPosts()}
        {activeTab === 'Shop' && renderShop()}
        {activeTab === 'Events' && renderEvents()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  societyInfo: {
    height: 160,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    zIndex: 1,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 12.5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 12,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  tag: {
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 2,
    fontSize: 10,
  },
  section: {
    padding: 16,
    marginTop: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
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
  postsContainer: {
    padding: 0,
  },
  postsRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContainer: {
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation:5,
    // marginBottom: 0,
    padding: 0,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  shopContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  shopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  eventsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  joinButton: {
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  qrButton: {
    borderRadius: 20,
    padding: 5,
  },
});

export default SocietyPage;