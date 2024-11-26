import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Image, StyleSheet, Dimensions } from 'react-native';
import { Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDB } from '../firebaseConfig';

const { width, height } = Dimensions.get('window');

const MerchPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { merchId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [merchData, setMerchData] = useState(null);
  const [societyData, setSocietyData] = useState(null);

  useEffect(() => {
    const fetchMerchData = async () => {
      try {
        const merchDoc = await getDoc(doc(firebaseDB, 'merch', merchId));
        if (merchDoc.exists()) {
          const merchData = merchDoc.data();
          const societyDoc = await getDoc(doc(firebaseDB, 'societies', merchData.society));
          if (societyDoc.exists()) {
            setTimeout(() => {
              setMerchData(merchData);
              setSocietyData(societyDoc.data());
              setLoading(false);
            }, 200);
          }
        }
      } catch (error) {
        console.error('Error fetching merch data:', error);
      }
    };

    if (merchId) {
      fetchMerchData();
    }
  }, [merchId]);

  const handleBackButton = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface }]}>
          <Image
            source={{ uri: merchData.image }}
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
            <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onSurface }]}>{merchData.name}</Text>
            <View style={[styles.priceBadge, { backgroundColor: theme.colors.surface }]}>
              <Text variant="bodyMedium" style={[styles.priceText, { color: theme.colors.onSurface, fontWeight: 'bold' }]}>${merchData.price}</Text>
            </View>
          </View>
          <Text variant="bodyMedium" style={[styles.societyName, { color: 'grey' }]}>{societyData.name}</Text>
          <View style={styles.merchDetails}>
            <View style={styles.detailRow}>
              <Ionicons name={merchData.availability ? "checkmark-circle" : "close-circle"} size={16} color={merchData.availability ? "green" : "red"} />
              <Text variant="bodyMedium" style={[styles.detailText, { color: merchData.availability ? "green" : "red" }]}>
                {merchData.availability ? "Available" : "Not Available"}
              </Text>
            </View>
          </View>
          <ScrollView style={styles.descriptionContainer} showsVerticalScrollIndicator={false}>
            <Text variant="bodyMedium" style={[styles.descriptionText, { color: theme.colors.onSurface }]}>
              {merchData.description}
            </Text>
          </ScrollView>
        </View>
      </ScrollView>
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
  imageContainer: {
    position: 'relative',
    width: width,
    height: height * 0.6,
    overflow: 'hidden',
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
    top: height * 0.53,
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
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  priceBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: '60%',
    flexShrink: 1,
  },
  priceText: {
    fontWeight: 'bold',
  },
  societyName: {
    fontWeight: 'bold',
    marginTop: 4,
    marginLeft: 8,
  },
  merchDetails: {
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
    maxHeight: 200,
    marginTop: 15,
  },
  descriptionText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default MerchPage;