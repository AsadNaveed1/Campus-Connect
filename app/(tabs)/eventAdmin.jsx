import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput, ActivityIndicator, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firebaseDB } from '../../firebaseConfig';
import EditableImage from '../../components/EditableImage';

const EventAdmin = () => {
  const eventId = 'RaOugCIWbxNicp7gaJMK';
  const theme = useTheme();
  const router = useRouter();
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    fee: '',
    time: '',
    location: '',
    backgroundImage: '',
    society: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (eventId) {
        try {
          const eventDoc = await getDoc(doc(firebaseDB, 'events', eventId));
          if (eventDoc.exists()) {
            setEventData(eventDoc.data());
          }
        } catch (error) {
          console.error('Error fetching event data:', error);
        }
      }
      setLoading(false);
    };

    fetchEventData();
  }, [eventId]);

  const handleSave = async () => {
    try {
      const eventDocRef = doc(firebaseDB, 'events', eventId);
      await updateDoc(eventDocRef, eventData);
      ToastAndroid.show('Event updated', ToastAndroid.SHORT);
      router.push('/events');
    } catch (error) {
      ToastAndroid.show('Error: ' + error.message, ToastAndroid.SHORT);
    }
  };

  const handleDelete = async () => {
    try {
      if (eventId) {
        await deleteDoc(doc(firebaseDB, 'events', eventId));
        ToastAndroid.show('Event deleted', ToastAndroid.SHORT);
        router.push('/events');
      }
    } catch (error) {
      ToastAndroid.show('Error: ' + error.message, ToastAndroid.SHORT);
    }
  };

  const handleImageUpload = async (uri) => {
    try {
      const eventDocRef = doc(firebaseDB, 'events', eventId);
      await updateDoc(eventDocRef, { backgroundImage: uri });
      setEventData((prevData) => ({ ...prevData, backgroundImage: uri }));
    } catch (error) {
      console.error('Error updating image URL in Firestore:', error);
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
  const bannerHeight = screenHeight * 0.4;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <IconButton
        icon={() => <Ionicons name="chevron-back" size={24} color="#fff" />}
        size={24}
        onPress={handleBackButton}
        style={styles.backButton}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.bannerContainer, { height: bannerHeight }]}>
          <EditableImage
            imageUri={eventData.backgroundImage}
            setImageUri={handleImageUpload}
            editable={true}
            imagePath={`events/backgroundImages/${eventId}`}
          />
        </View>
        <View style={styles.container}>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              mode="outlined"
              label="Event Name"
              value={eventData.name}
              onChangeText={(text) => setEventData({ ...eventData, name: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              mode="outlined"
              label="Description"
              value={eventData.description}
              onChangeText={(text) => setEventData({ ...eventData, description: text })}
              multiline
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              mode="outlined"
              label="Fee"
              value={eventData.fee.toString()}
              onChangeText={(text) => setEventData({ ...eventData, fee: parseFloat(text) })}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              mode="outlined"
              label="Time"
              value={eventData.time}
              onChangeText={(text) => setEventData({ ...eventData, time: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              mode="outlined"
              label="Location"
              value={eventData.location}
              onChangeText={(text) => setEventData({ ...eventData, location: text })}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              mode="outlined"
              label="Society"
              value={eventData.society}
              onChangeText={(text) => setEventData({ ...eventData, society: text })}
            />
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttonRow, { backgroundColor: theme.colors.background }]}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={[styles.button, { marginRight: 8 }]}
          icon={() => <Ionicons name="save-outline" size={18} color={theme.colors.onPrimary} />}
        >
          Save
        </Button>
        {eventId && (
          <Button
            mode="contained"
            onPress={handleDelete}
            style={[styles.button, { backgroundColor: theme.colors.error }]}
            labelStyle={{ color: theme.colors.onError }}
            icon={() => <Ionicons name="trash-outline" size={18} color={theme.colors.onError} />}
          >
            Delete
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
});

export default EventAdmin;