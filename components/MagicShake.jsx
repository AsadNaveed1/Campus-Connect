import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Button, Text, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { firebaseDB } from '../firebaseConfig';

const phrases = ["Check this out!", "Here's something cool!", "Something's cooking here 👀", "Take a look at this!"];

const MagicShake = () => {
  const [subscription, setSubscription] = useState(null);
  const [visible, setVisible] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [phrase, setPhrase] = useState("");
  const [society, setSociety] = useState(null);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const subscribe = () => {
      Accelerometer.setUpdateInterval(200);
      setSubscription(
        Accelerometer.addListener(accelerometerData => {
          const { x, y, z } = accelerometerData;
          const totalForce = Math.sqrt(x * x + y * y + z * z);
          if (totalForce > 1.75) {
            handleShake();
          }
        })
      );
    };

    if (!visible) {
      subscribe();
    } else if (subscription) {
      subscription.remove();
      setSubscription(null);
    }

    return () => subscription && subscription.remove();
  }, [visible]);

  const handleShake = async () => {
    const randomSuggestion = await fetchRandomSuggestion();
    setSuggestion(randomSuggestion);
    setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    if (randomSuggestion.type === 'Event') {
      const societyDoc = await getDoc(doc(firebaseDB, 'societies', randomSuggestion.society));
      if (societyDoc.exists()) {
        setSociety(societyDoc.data());
      }
    }
    setVisible(true);
  };

  const fetchRandomSuggestion = async () => {
    const eventsSnapshot = await getDocs(collection(firebaseDB, 'events'));
    const societiesSnapshot = await getDocs(collection(firebaseDB, 'societies'));

    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Event' }));
    const societies = societiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Society' }));

    const allSuggestions = [...events, ...societies];
    const randomIndex = Math.floor(Math.random() * allSuggestions.length);
    return allSuggestions[randomIndex];
  };

  const handleGoToPage = () => {
    if (suggestion) {
      if (suggestion.type === 'Event') {
        router.push({ pathname: '/eventPage', params: { eventId: suggestion.id } });
      } else {
        router.push({ pathname: '/societyPage', params: { societyId: suggestion.id } });
      }
      setVisible(false);
    }
  };

  const handleNewSuggestion = async () => {
    const randomSuggestion = await fetchRandomSuggestion();
    setSuggestion(randomSuggestion);
    setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    if (randomSuggestion.type === 'Event') {
      const societyDoc = await getDoc(doc(firebaseDB, 'societies', randomSuggestion.society));
      if (societyDoc.exists()) {
        setSociety(societyDoc.data());
      }
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <IconButton
              icon={() => <Ionicons name="close" size={24} color={theme.colors.onSurface} />}
              size={24}
              onPress={() => setVisible(false)}
              style={styles.closeButton}
            />
            {suggestion && (
              <>
                <Text style={[styles.modalTitle, { color: theme.colors.primary, textAlign: 'center' }]}>{phrase}</Text>
                <Text style={[styles.modalText, { color: theme.colors.onSurface, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }]}>
                  {suggestion.name}
                </Text>
                {suggestion.type === 'Event' && society && (
                  <Text style={[styles.modalText, { color: theme.colors.onSurface, textAlign: 'center' }]}>
                    {`${society.name}`}
                  </Text>
                )}
                <View style={styles.modalActions}>
                  <Button mode="contained" onPress={handleGoToPage} style={styles.modalButton}>
                    {`Go to ${suggestion.type}`}
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={handleNewSuggestion}
                    style={styles.modalButton}
                    icon={() => <Ionicons name="shuffle" size={24} color={theme.colors.primary} />}
                  >
                    New Suggestion
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MagicShake;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    height: '50%',
    padding: 20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    alignItems: 'center',
    elevation: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  modalButton: {
    marginVertical: 5,
  },
});