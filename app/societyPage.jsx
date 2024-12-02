import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, ImageBackground, SafeAreaView, Dimensions } from 'react-native';
import { useTheme, Text, IconButton, Button, ActivityIndicator, Dialog, Portal } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, collection, query, where, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firebaseDB } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useUserContext } from '../contexts/UserContext';
import EventCard from '../components/EventCard';
import MerchCard from '../components/MerchCard';
import PostCard from '../components/PostCard';
import QRCode from 'react-native-qrcode-svg';

const SocietyPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { societyId } = useLocalSearchParams();
  const { user, setUser } = useUserContext();
  const auth = getAuth();
  const [activeTab, setActiveTab] = useState('Posts');
  const [societyData, setSocietyData] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [merch, setMerch] = useState([]);
  const [posts, setPosts] = useState([]);
  const [qrVisible, setQrVisible] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const qrCodeSize = screenWidth * 0.6;

  useEffect(() => {
    if (!user) {
      return;
    }

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
          fetchPosts();
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
        eventData.sort((a, b) => a.time.seconds - b.time.seconds);
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
        merchData.sort((a, b) => a.name.localeCompare(b.name));
        setMerch(merchData);
      } catch (error) {
        console.error('Error fetching merch details:', error);
      }
    };

    const fetchPosts = () => {
      const postsQuery = query(collection(firebaseDB, 'posts'), where('society', '==', societyId));
      const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
        const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        postsData.sort((a, b) => b.date.seconds - a.date.seconds);
        setPosts(postsData);
      }, (error) => {
        console.error('Error fetching posts:', error);
      });

      return () => unsubscribe();
    };

    if (societyId) {
      fetchSocietyData();
    }
  }, [societyId, user]);

  useEffect(() => {
    if (user && user.joinedSocieties.includes(societyId)) {
      setHasJoined(true);
    }
  }, [user, societyId]);

  const handleJoinButton = async () => {
    if (!auth.currentUser) {
      console.error('User not authenticated');
      return;
    }
    setHasJoined(true);
    const userDocRef = doc(firebaseDB, 'users', auth.currentUser.email);
    await updateDoc(userDocRef, {
      joinedSocieties: arrayUnion(societyId),
    });
    setUser({ ...user, joinedSocieties: [...user.joinedSocieties, societyId] });
  };

  const handleLeaveButton = async () => {
    if (!auth.currentUser) {
      console.error('User not authenticated');
      return;
    }
    setHasJoined(false);
    const userDocRef = doc(firebaseDB, 'users', auth.currentUser.email);
    await updateDoc(userDocRef, {
      joinedSocieties: arrayRemove(societyId),
    });
    setUser({ ...user, joinedSocieties: user.joinedSocieties.filter(id => id !== societyId) });
  };

  const handleBackButton = () => {
    router.back();
  };

  const toggleQrDialog = () => {
    setQrVisible(!qrVisible);
  };

  if (!user) {
    return;
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
            resizeMode="cover"
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
            onPress={toggleQrDialog}
          />
        </View>
        <View style={styles.tagsContainer}>
          <Text style={[styles.tag, { backgroundColor: theme.colors.primaryContainer, color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }]}>{categoryName}</Text>
        </View>
        <Text style={[styles.details, { color: theme.colors.onBackground }]}>
          {societyData.description}
        </Text>
        <Button
          mode="text"
          onPress={hasJoined ? handleLeaveButton : handleJoinButton}
          style={styles.joinButton}
          icon={() => (
            <Ionicons
              name={hasJoined ? "checkmark" : "add"}
              size={20}
              color={theme.colors.primary}
            />
          )}
        >
          {hasJoined ? "Joined" : "Join Us"}
        </Button>
      </View>
    </>
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
            image={item.image} 
            caption={item.caption} 
            societyName={societyData.name}
            date={formattedDate}
            minimal
          />
        );
      })}
    </View>
  );

  const renderMerch = () => (
    <View style={styles.merchContainer}>
      {merch.map((item) => (
        <View key={item.id} style={styles.merchItem}>
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
            style={[styles.tabButton, activeTab === 'Merch' && { ...styles.activeTab, borderColor: theme.colors.primary }]}
            onPress={() => setActiveTab('Merch')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'Merch' ? theme.colors.primary : theme.colors.onSurface }]}>Merch</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'Posts' && renderPosts()}
        {activeTab === 'Merch' && renderMerch()}
        {activeTab === 'Events' && renderEvents()}
      </ScrollView>

      <Portal>
        <Dialog visible={qrVisible} onDismiss={() => toggleQrDialog()} style={styles.qrDialog}>
          <Dialog.Title>
            <Text style={styles.qrDialogTitle}>Society Code</Text>
          </Dialog.Title>
          <Dialog.Content style={styles.qrDialogContent}>
            <View>
              <QRCode value={'soc:' + societyId} size={qrCodeSize} />
            </View>
          </Dialog.Content>
          <Dialog.Actions></Dialog.Actions>
        </Dialog>
      </Portal>
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
    marginTop: 16,
    paddingHorizontal: 10,
    marginBottom: 4,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    flex: 1,
    paddingHorizontal: 24,
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
  eventsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  joinButton: {
    width: '40%',
    alignSelf: 'center',
    marginBottom: 4,
  },
  qrButton: {
    borderRadius: 20,
    padding: 5,
  },
  qrDialog: {
    borderRadius: 15,
  },
  qrDialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  qrDialogContent: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  qrDialogActions: {
    justifyContent: 'center',
  },
});

export default SocietyPage;