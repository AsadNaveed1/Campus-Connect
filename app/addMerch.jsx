import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { firebaseDB } from '../firebaseConfig';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
// import * as ImagePicker from 'expo-image-picker'; // Commented out for now

const { width } = Dimensions.get('window');

const AddMerch = () => {
  const theme = useTheme();
  const router = useRouter();
  const { societyId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [merchData, setMerchData] = useState({
    name: '',
    description: '',
    price: '',
    availability: false,
    image: '', 
    society: societyId, 
  });

  const handleAddMerch = async () => {
    if (!merchData.name || !merchData.price || !merchData.society) {
      alert('Please fill out all required fields.');
      return;
    }
  
    setLoading(true);
    try {
      const merchDocRef = await addDoc(collection(firebaseDB, 'merch'), {
        ...merchData,
        price: parseFloat(merchData.price), 
      });
  
      const merchId = merchDocRef.id; 

      const societyDocRef = doc(firebaseDB, 'societies', merchData.society);

      await updateDoc(societyDocRef, {
        merch: arrayUnion(merchId),
      });
  
      console.log('Merchandise ID added to society array successfully.');
      alert('Merchandise added successfully!');
      router.back();
    } catch (error) {
      console.error('Error adding merchandise or updating society:', error);
      alert('Failed to add merchandise.');
    } finally {
      setLoading(false);
    }
  };
  

  // Commented-out ImagePicker functionality
  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.cancelled) {
  //     setMerchData({ ...merchData, image: result.uri });
  //   }
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
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
          <Text style={styles.title}>Add Merchandise</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            placeholder="Merch Name"
            value={merchData.name}
            onChangeText={(text) => setMerchData({ ...merchData, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={merchData.description}
            multiline
            onChangeText={(text) => setMerchData({ ...merchData, description: text })}
            style={[styles.input, styles.textArea]}
          />
          <TextInput
            placeholder="Price"
            value={merchData.price}
            keyboardType="numeric"
            onChangeText={(text) => setMerchData({ ...merchData, price: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Image URL"
            value={merchData.image}
            onChangeText={(text) => setMerchData({ ...merchData, image: text })}
            style={styles.input}
          />
          {/* ImagePicker logic (commented out)
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {merchData.image ? (
              <Image source={{ uri: merchData.image }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>Pick an Image</Text>
            )}
          </TouchableOpacity>
          */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Availability:</Text>
            <Button
              mode={merchData.availability ? 'contained' : 'outlined'}
              onPress={() => setMerchData({ ...merchData, availability: !merchData.availability })}
            >
              {merchData.availability ? 'Available' : 'Not Available'}
            </Button>
          </View>
        </View>
        <Button mode="contained" onPress={handleAddMerch} style={styles.submitButton}>
          Add Merchandise
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
    padding: 8,
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
  imagePicker: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
  },
  imagePickerText: {
    color: 'gray',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 8,
  },
  toggleLabel: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#6200ee',
    borderRadius: 8,
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

export default AddMerch;
