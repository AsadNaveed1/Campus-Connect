import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Text } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { firebaseDB } from '../firebaseConfig';
import SearchResult from '../components/SearchResult';

export default function Search() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [societies, setSocieties] = useState([]);
  const [events, setEvents] = useState([]);

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
        const societyName = societyDoc.data().name;
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <View style={[styles.searchBar, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search" size={24} color={theme.colors.onSurface} style={styles.searchIcon} />
          <TextInput
            style={[styles.textInput, { color: theme.colors.onSurface }]}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoFocus
            placeholderTextColor={theme.colors.onSurface}
            selectionColor={theme.colors.primary}
          />
          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="qr-code-outline"
              size={24}
              color={theme.colors.onSurface}
              style={styles.qrIcon}
            />
          </TouchableOpacity>
        </View>
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
  },
  container: {
    paddingHorizontal: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 5,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  qrIcon: {
    marginLeft: 8,
    marginRight: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
  },
});