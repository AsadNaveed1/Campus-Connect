import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, TextInput, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getFirestore, collection, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig'; 

const firebaseDB = getFirestore(firebaseApp);

const AddEvent = () => {
  const router = useRouter();
  const { societyId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    fee: '',
    location: '',
    time: new Date(),
    backgroundImage: '',
    society: societyId,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAddEvent = async () => {
    if (!eventData.name || !eventData.time || !eventData.society || !eventData.location) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const newEvent = await addDoc(collection(firebaseDB, 'events'), {
        ...eventData,
        fee: parseFloat(eventData.fee), 
      });

      const societyRef = doc(firebaseDB, 'societies', eventData.society);
      await updateDoc(societyRef, {
        events: arrayUnion(newEvent.id),
      });

      alert('Event added successfully!');
      router.back();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || eventData.time;
    setShowDatePicker(false);
    setEventData({ ...eventData, time: currentDate });
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || eventData.time;
    setShowTimePicker(false);
    setEventData({ ...eventData, time: currentTime });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon={() => <Ionicons name="chevron-back" size={24} color="#fff" />}
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text style={styles.title}>Add Event</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            placeholder="Event Name"
            value={eventData.name}
            onChangeText={(text) => setEventData({ ...eventData, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={eventData.description}
            multiline
            onChangeText={(text) => setEventData({ ...eventData, description: text })}
            style={[styles.input, styles.textArea]}
          />
          <TextInput
            placeholder="Fee"
            value={eventData.fee}
            keyboardType="numeric"
            onChangeText={(text) => setEventData({ ...eventData, fee: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Background Image URL"
            value={eventData.backgroundImage}
            onChangeText={(text) => setEventData({ ...eventData, backgroundImage: text })}
            style={styles.input}
          />
          
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{eventData.time.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={eventData.time}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
            <Text>{eventData.time.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={eventData.time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          <TextInput
            placeholder="Location"
            value={eventData.location}
            onChangeText={(text) => setEventData({ ...eventData, location: text })}
            style={styles.input}
          />
        </View>
        <Button mode="contained" onPress={handleAddEvent} style={styles.submitButton}>
          Add Event
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
    color: 'white',
  },
  form: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
  },
  submitButton: {
    marginTop: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default AddEvent;
