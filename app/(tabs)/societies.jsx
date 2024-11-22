import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Text, IconButton, Chip } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import SocietyCard from "../../components/SocietyCard";
import MySocietyCard from "../../components/MySocietyCard";

export default function Societies() {
  const theme = useTheme();
  const [selectedChips, setSelectedChips] = useState([]);

  const chips = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"];

  const handleChipPress = (chip) => {
    setSelectedChips((prevSelectedChips) => {
      if (prevSelectedChips.includes(chip)) {
        return prevSelectedChips.filter((item) => item !== chip);
      } else {
        return [chip, ...prevSelectedChips];
      }
    });
  };

  const renderChip = (chip) => {
    const isSelected = selectedChips.includes(chip);
    return (
      <Chip
        key={chip}
        style={[styles.chip, isSelected && styles.selectedChip]}
        textStyle={styles.chipText}
        onPress={() => handleChipPress(chip)}
        icon={isSelected ? () => <Ionicons name="checkmark" size={16} color="white" /> : null}
      >
        {chip}
      </Chip>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>Societies</Text>
        <IconButton
          icon={() => <Ionicons name="add" size={24} color={theme.colors.onBackground} />}
          onPress={() => {}}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>My Societies</Text>
        <ScrollView horizontal contentContainerStyle={styles.horizontalScroll} showsHorizontalScrollIndicator={false}>
          <MySocietyCard style={styles.card} logo={require('../../assets/images/hku.png')} name="Society 1" />
          <MySocietyCard style={styles.card} logo={require('../../assets/images/hku.png')} name="Society 2" />
          <MySocietyCard style={styles.card} logo={require('../../assets/images/hku.png')} name="Society 3" />
          <MySocietyCard style={styles.card} logo={require('../../assets/images/hku.png')} name="Society 4" />
          <MySocietyCard style={styles.card} logo={require('../../assets/images/hku.png')} name="Society 5" />
        </ScrollView>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>All Societies</Text>
        <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
          {selectedChips.concat(chips.filter(chip => !selectedChips.includes(chip))).map(renderChip)}
        </ScrollView>
        <SocietyCard style={styles.card} name="Society A" members="100" category="Category 1" logoUrl={require('../../assets/images/hku.png')} />
        <SocietyCard style={styles.card} name="Society B" members="150" category="Category 2" logoUrl={require('../../assets/images/hku.png')} />
        <SocietyCard style={styles.card} name="Society C" members="200" category="Category 3" logoUrl={require('../../assets/images/hku.png')} />
        <SocietyCard style={styles.card} name="Society D" members="200" category="Category 4" logoUrl={require('../../assets/images/hku.png')} />
        <SocietyCard style={styles.card} name="Society E" members="200" category="Category 5" logoUrl={require('../../assets/images/hku.png')} />
      </ScrollView>
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
    fontWeight: 'bold',
  },
  container: {
    padding: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  horizontalScroll: {
    paddingBottom: 20,
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
    backgroundColor: 'darkmagenta',
  },
  selectedChip: {
    backgroundColor: 'darkmagenta',
  },
  chipText: {
    color: 'white',
  },
});