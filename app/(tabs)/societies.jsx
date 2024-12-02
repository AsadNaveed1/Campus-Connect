import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Text, Chip } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { firebaseDB } from '../../firebaseConfig';
import { useAuthContext } from "../../contexts/AuthContext";
import SocietyCard from "../../components/SocietyCard";
import MySocietyCard from "../../components/MySocietyCard";
import SearchButton from '../../components/SearchButton';

export default function Societies() {
  const theme = useTheme();
  const user = useAuthContext();
  const [chips, setChips] = useState([]);
  const [selectedChip, setSelectedChip] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [mySocieties, setMySocieties] = useState([]);
  const [categories, setCategories] = useState({});
  const societiesRef = useRef([]);
  const userRef = useRef(user);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const categoriesQuery = query(collection(firebaseDB, "categories"), orderBy("name", "asc"));
    const unsubscribeCategories = onSnapshot(categoriesQuery, (querySnapshot) => {
      const categoriesData = {};
      querySnapshot.docs.forEach(doc => {
        categoriesData[doc.id] = doc.data();
      });
      setCategories(categoriesData);
      setChips(Object.values(categoriesData));
    });

    const societiesQuery = query(collection(firebaseDB, "societies"), orderBy("name", "asc"));
    const unsubscribeSocieties = onSnapshot(societiesQuery, (querySnapshot) => {
      const societiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      societiesRef.current = societiesData;
      setSocieties(societiesData);

      if (userRef.current && userRef.current.joinedSocieties) {
        const joinedSocieties = societiesData.filter(society => userRef.current.joinedSocieties.includes(society.id));
        setMySocieties(joinedSocieties);
      }
    });

    const unsubscribeUser = onSnapshot(doc(firebaseDB, 'users', user.email), (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userRef.current = userData;
        const joinedSocieties = societiesRef.current.filter(society => userData.joinedSocieties.includes(society.id));
        setMySocieties(joinedSocieties);
      }
    });

    return () => {
      unsubscribeCategories();
      unsubscribeSocieties();
      unsubscribeUser();
    };
  }, [user]);

  useEffect(() => {
    if (user && user.joinedSocieties) {
      const joinedSocieties = societies.filter(society => user.joinedSocieties.includes(society.id));
      setMySocieties(joinedSocieties);
    }
  }, [societies, user]);

  const handleChipPress = (chipName) => {
    if (chipName === selectedChip) {
      setSelectedChip(null);
      setChips(Object.values(categories));
    } else {
      setSelectedChip(chipName);
      setChips(Object.values(categories));
    }
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>Societies</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>My Societies</Text>
        <ScrollView horizontal contentContainerStyle={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
          {mySocieties.length > 0 ? (
            mySocieties.map(society => (
              <MySocietyCard
                key={society.id}
                societyId={society.id}
                style={styles.card}
                name={society.name}
                logo={society.logo}
              />
            ))
          ) : (
            <Text style={{ color: theme.colors.onBackground }}>You have not joined any societies.</Text>
          )}
        </ScrollView>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>All Societies</Text>
        <ScrollView
          horizontal
          contentContainerStyle={styles.chipContainer}
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
        >
          {chips
            .sort((a, b) => (a.name === selectedChip ? -1 : b.name === selectedChip ? 1 : 0))
            .map(chip => {
              const isSelected = selectedChip === chip.name;
              const backgroundColor = `#${chip.backgroundColor}`;
              const textColor = `#${chip.textColor}`;
              return (
                <Chip
                  key={chip.name}
                  style={[styles.chip, { backgroundColor }]}
                  textStyle={{ color: textColor }}
                  mode="contained"
                  onPress={() => handleChipPress(chip.name)}
                  icon={isSelected ? () => <Ionicons name="checkmark" size={16} color={textColor} /> : null}
                >
                  {chip.name}
                </Chip>
              );
            })}
        </ScrollView>
        {societies
          .filter(society => !selectedChip || categories[society.category]?.name === selectedChip)
          .map(society => {
            const category = categories[society.category];
            return (
              <SocietyCard
                key={society.id}
                societyId={society.id}
                style={styles.card}
                name={society.name}
                members={`${society.members}`}
                category={category ? category.name : ''}
                categoryColor={category ? `#${category.backgroundColor}` : 'lightcoral'}
                categoryTextColor={category ? `#${category.textColor}` : 'white'}
                logoUrl={society.logo}
              />
            );
          })}
      </ScrollView>
      <SearchButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  container: {
    padding: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  horizontalScroll: {
    marginBottom: 28,
  },
  card: {
    marginRight: 16,
    marginBottom: 16,
  },
  chipContainer: {
    paddingBottom: 16,
  },
  chip: {
    borderRadius: 25,
    marginRight: 8,
  },
});