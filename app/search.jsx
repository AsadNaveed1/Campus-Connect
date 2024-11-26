import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Text, IconButton, Searchbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { firebaseDB } from '../firebaseConfig';
import SearchResult from '../components/SearchResult';
import { useRouter } from 'expo-router';

export default function Search() {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [societies, setSocieties] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchBarHeight, setSearchBarHeight] = useState(0);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSocieties([]);
      setEvents([]);
      return;
    }

    const societiesQuery = query(
      collection(firebaseDB, "societies"),
      where("name", ">=", searchQuery),
      where("name", "<=", searchQuery + "\uf8ff")
    );

    const eventsQuery = query(
      collection(firebaseDB, "events"),
      where("name", ">=", searchQuery),
      where("name", "<=", searchQuery + "\uf8ff")
    );

    const unsubscribeSocieties = onSnapshot(societiesQuery, (querySnapshot) => {
      const societiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSocieties(societiesData);
    });

    const unsubscribeEvents = onSnapshot(eventsQuery, async (querySnapshot) => {
      const eventsData = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const eventData = { id: docSnapshot.id, ...docSnapshot.data() };
        const societyDoc = await getDoc(doc(firebaseDB, "societies", eventData.society));
        const societyName = societyDoc.get("name");
        return { ...eventData, societyName };
      }));
      setEvents(eventsData);
    });

    return () => {
      unsubscribeSocieties();
      unsubscribeEvents();
    };
  }, [searchQuery]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleBackButton = () => {
    router.back();
  };

  const handleQRButton = () => {
    router.replace("qrScanner");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search"
          onChangeText={handleSearchChange}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
          icon={() => (
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.colors.onSurface}
              onPress={handleBackButton}
            />
          )}
          inputStyle={{ color: theme.colors.onSurface }}
          autoFocus
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setSearchBarHeight(height);
          }}
        />
        <IconButton
          icon={() => <Ionicons name="qr-code-outline" size={24} color={theme.colors.onSurface} />}
          size={24}
          onPress={handleQRButton}
          style={[styles.qrButton, { backgroundColor: theme.colors.surface, height: searchBarHeight, width: searchBarHeight }]}
        />
      </View>
      <ScrollView style={styles.container}>
        {societies.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Societies</Text>
            {societies.map(society => (
              <SearchResult
                key={society.id}
                id={society.id}
                title={society.name}
                type="society"
              />
            ))}
          </>
        )}
        {events.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Events</Text>
            {events.map(event => (
              <SearchResult
                key={event.id}
                id={event.id}
                title={event.name}
                subtitle={event.societyName}
                type="event"
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 24,
  },
  searchBar: {
    flex: 1,
  },
  qrButton: {
    borderRadius: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
  },
});