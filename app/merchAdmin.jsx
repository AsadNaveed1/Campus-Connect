import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput, ActivityIndicator, useTheme, IconButton, Switch } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc, deleteDoc, addDoc, collection, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { firebaseDB } from '../firebaseConfig';
import EditableImage from '../components/EditableImage';

const MerchAdmin = () => {
  const { merchId, societyId } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const [merchData, setMerchData] = useState({
    name: '',
    description: '',
    price: '',
    availability: true,
    image: '',
    society: societyId || '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchMerchData = async () => {
      if (merchId) {
        try {
          const merchDoc = await getDoc(doc(firebaseDB, 'merch', merchId));
          if (merchDoc.exists()) {
            const data = merchDoc.data();
            setMerchData(data);
          }
        } catch (error) {
        }
      } else {
        setIsEditable(true);
      }
      setLoading(false);
    };

    fetchMerchData();
  }, [merchId]);

  const handleSave = async () => {
    if (isEditable) {
      try {
        const merchDocRef = doc(firebaseDB, 'merch', merchId);
        await updateDoc(merchDocRef, merchData);
        ToastAndroid.show('Merch updated', ToastAndroid.SHORT);
      } catch (error) {
      }
    }
    setIsEditable(!isEditable);
  };

  const handleCreate = async () => {
    try {
      const merchDocRef = await addDoc(collection(firebaseDB, 'merch'), merchData);
      await updateDoc(doc(firebaseDB, 'societies', societyId), {
        merch: arrayUnion(merchDocRef.id),
      });
      ToastAndroid.show('Merch created', ToastAndroid.SHORT);
      router.back();
    } catch (error) {
    }
  };

  const handleDelete = async () => {
    try {
      if (merchId) {
        const merchDocRef = doc(firebaseDB, 'merch', merchId);
        const merchDoc = await getDoc(merchDocRef);
        if (merchDoc.exists()) {
          const merchData = merchDoc.data();
          if (merchData.image) {
            const storage = getStorage();
            const imageRef = ref(storage, merchData.image);
            await deleteObject(imageRef);
          }
        }
        await deleteDoc(merchDocRef);
        await updateDoc(doc(firebaseDB, 'societies', societyId), {
          merch: arrayRemove(merchId),
        });
        ToastAndroid.show('Merch deleted', ToastAndroid.SHORT);
        router.back();
      }
    } catch (error) {
    }
  };

  const handleImageUpload = async (uri) => {
    try {
      const merchDocRef = doc(firebaseDB, 'merch', merchId);
      await updateDoc(merchDocRef, { image: uri });
      setMerchData((prevData) => ({ ...prevData, image: uri }));
    } catch (error) {
    }
  };

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

  const screenHeight = Dimensions.get('window').height;
  const bannerHeight = screenHeight * 0.5;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <IconButton
          icon={() => <Ionicons name="chevron-back" size={24} color="#fff" />}
          size={24}
          onPress={handleBackButton}
          style={styles.backButton}
        />
        <View style={[styles.bannerContainer, { height: bannerHeight }]}>
          <EditableImage
            imageUri={merchData.image}
            setImageUri={handleImageUpload}
            editable={!!merchId && isEditable}
            imagePath={`merch/images/${merchId}`}
          />
          {!merchId && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Image can be added after merch creation.</Text>
            </View>
          )}
        </View>
        <View style={styles.container}>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              mode="outlined"
              label="Merch Name"
              value={merchData.name}
              onChangeText={(text) => setMerchData({ ...merchData, name: text })}
              theme={{ roundness: 15 }}
              editable={isEditable}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              mode="outlined"
              label="Description"
              value={merchData.description}
              onChangeText={(text) => setMerchData({ ...merchData, description: text })}
              multiline
              theme={{ roundness: 15 }}
              editable={isEditable}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              mode="outlined"
              label="Price"
              value={merchData.price.toString()}
              onChangeText={(text) => setMerchData({ ...merchData, price: parseFloat(text) })}
              keyboardType="numeric"
              theme={{ roundness: 15 }}
              editable={isEditable}
            />
            <View style={styles.switchContainer}>
              <Text style={{ fontWeight: 'bold' }}>Available</Text>  
              <Switch
                value={merchData.availability}
                onValueChange={(value) => setMerchData({ ...merchData, availability: value })}
                disabled={!isEditable}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttonRow, { backgroundColor: theme.colors.background }]}>
        {merchId ? (
          <>
            <Button
              mode="contained"
              onPress={handleDelete}
              style={[styles.button, { backgroundColor: theme.colors.error, marginRight: 8 }]}
              labelStyle={{ color: theme.colors.onError }}
              icon={() => <Ionicons name="trash-outline" size={18} color={theme.colors.onError} />}
            >
              Delete
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={[styles.button]}
              icon={() => <Ionicons name={isEditable ? "checkmark-outline" : "pencil-outline"} size={18} color={theme.colors.onPrimary} />}
            >
              {isEditable ? "Save" : "Edit"}
            </Button>
          </>
        ) : (
          <Button
            mode="contained"
            onPress={handleCreate}
            style={[styles.button]}
            icon={() => <Ionicons name="add-outline" size={18} color={theme.colors.onPrimary} />}
          >
            Create
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  bannerContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    padding: 16,
    borderRadius: 15,
    elevation: 5,
    marginTop: -60,
  },
  input: {
    width: '100%',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInput: {
    width: '48%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  button: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    padding: 8,
  },
});

export default MerchAdmin;