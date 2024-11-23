import React from 'react';
import { View, StyleSheet, Image, ImageBackground, Text, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TabsProvider, Tabs, TabScreen } from 'react-native-paper-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShopCard from '../components/ShopCard';
import SocietyEventsCard from '../components/SocietyEventsCard'; // Import the SocietyEventsCard component
import { FlatList, TouchableOpacity } from 'react-native';


export default function SocietyPage() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      {/* Society Banner and Logo */}
      <ImageBackground
        source={require('../assets/images/banner.jpg')}
        style={styles.societyInfo}
        resizeMode="cover"
      >
        {/* Round Logo Container */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/hku.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      {/* Society Details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.name, { color: theme.colors.onBackground }]}>
          Society Name
        </Text>
        <Text style={[styles.details, { color: theme.colors.onBackground }]}>
          Description: A vibrant community for members to connect and grow.
        </Text>
      </View>

      {/* Tabs Section */}
      <View style={styles.tabsContainer}>
        <TabsProvider>
          <Tabs
            mode="fixed"
            uppercase={true}
            style={[styles.tabs, { backgroundColor: 'transparent' }]}
            theme={theme}
            dark={false}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.onSurfaceDisabled}
            underlineColor={theme.colors.primary}
          >
            <TabScreen label="Posts">
              <PostsTabContent label="Posts" />
            </TabScreen>
            <TabScreen label="Events">
              {/* <TabContent label="Events" />   */}
              <SocietyEventsCard/>
            </TabScreen>
            <TabScreen label="Shop">
              <ShopTabContent label="Shop" />
            </TabScreen>
          </Tabs>
        </TabsProvider>
      </View>
    </SafeAreaView>
  );
}

function TabContent({ label }) {
  const theme = useTheme();

  return (

    <View style={styles.tabContent}>
      <Text style={[styles.tabText, { color: theme.colors.text }]}>
        This is the {label} page.
      </Text>
    </View>

  );
}

function ShopTabContent() {
  const theme = useTheme();

  const items = [
    { id: 1, image: require('../assets/images/hoodie.jpg'), title: 'Unisex Hoodie', price: 199 },
    { id: 2, image: require('../assets/images/hoodie.jpg'), title: 'Tote Bag', price: 50 },
    { id: 3, image: require('../assets/images/hoodie.jpg'), title: 'Water Bottle', price: 75 },
    { id: 4, image: require('../assets/images/hoodie.jpg'), title: 'T-Shirt', price: 100 },
    { id: 5, image: require('../assets/images/hoodie.jpg'), title: 'Cap', price: 120 },
    { id: 6, image: require('../assets/images/hoodie.jpg'), title: 'Sweater', price: 150 },
  ];

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2} // This will create two columns
      renderItem={({ item }) => (
        <ShopCard
          key={item.id}
          image={item.image}
          title={item.title}
          price={item.price}
        />
      )}
      contentContainerStyle={styles.shopContainer}
    />
  );
}


function PostsTabContent() {
  const theme = useTheme();

  // Sample data for posts
  const posts = [
    { id: '1', image: require('../assets/images/hoodie.jpg'), caption: 'Enjoying the society vibes!' },
    { id: '2', image: require('../assets/images/hoodie.jpg'), caption: 'A great event by the community.' },
    { id: '3', image: require('../assets/images/hoodie.jpg'), caption: 'Moments that matter. ❤️' },
    { id: '4', image: require('../assets/images/hoodie.jpg'), caption: 'Stay connected, stay inspired!' },
  ];

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.postContainer}>
      <Image source={item.image} style={styles.postImage} />
      <Text style={[styles.caption, { color: theme.colors.onSurface }]} numberOfLines={2}>
        {item.caption}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderPost}
      numColumns={2}
      contentContainerStyle={styles.postsContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  
  safeArea: {
    flex: 1,
  },
  societyInfo: {
    height: 120,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -50,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  detailsContainer: {
    alignItems: 'center',
    marginTop: 40,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    marginBottom: 4,
  },
  tabsContainer: {
    flex: 1,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  shopContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  tabs: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tabText: {
    fontSize: 18,
    fontWeight: '500',
  },
  postsContainer: {
    padding: 10,
  },
  postContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4, // iOS shadow
  },
  postImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  caption: {
    fontSize: 16,
    padding: 8,
    textAlign: 'left',
    fontWeight: 'bold',
  },
});