import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ToastAndroid } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { firebaseDB } from '../firebaseConfig';
import { Dropdown } from 'react-native-paper-dropdown';
import { Ionicons } from '@expo/vector-icons';

export default function Admin() {
  const theme = useTheme();
  const router = useRouter();
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const societiesQuery = query(collection(firebaseDB, 'societies'));
    const unsubscribe = onSnapshot(societiesQuery, (querySnapshot) => {
      const societiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      societiesData.sort((a, b) => a.name.localeCompare(b.name));
      setSocieties(societiesData);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (selectedSociety) {
      const societyDoc = await getDoc(doc(firebaseDB, 'societies', selectedSociety.id));
      if (societyDoc.exists() && societyDoc.data().passkey === password) {
        router.replace({ pathname: '/societyAdmin', params: { societyId: selectedSociety.id } });
      } else {
        ToastAndroid.show('Incorrect password', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Please select a society', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="close" size={24} color={theme.colors.onBackground} onPress={() => router.replace('/')} />
        </View>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text variant="headlineSmall" style={[styles.title, styles.text, { color: theme.colors.onBackground }]}>Sign into your society</Text>
            <Dropdown
              label="Select Society"
              placeholder="Select Society"
              options={societies.map(society => ({ label: society.name, value: society.id }))}
              value={selectedSociety?.id}
              onSelect={(value) => {
                const selected = societies.find(society => society.id === value);
                setSelectedSociety(selected);
              }}
              style={styles.dropdown}
              hideMenuHeader
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              autoCapitalize='none'
            />
          </View>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
            >
              Login
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "flex-end",
    right: 8,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  inputContainer: {
    width: "80%",
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  dropdown: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: 8,
  },
  card: {
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    elevation: 5,
    borderBottomWidth: 0,
    elevation: 5,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});