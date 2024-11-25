import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text, IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import SearchButton from "../../components/SearchButton";
import EventCard from "../../components/EventCard";
import SocietyCard from "../../components/SocietyCard";

export default function Home() {
  const theme = useTheme();

  const societies = [
    {
      societyId: "1",
      name: "Art Society",
      members: 120,
      category: "Art",
      categoryColor: "#FFD700",
      categoryTextColor: "#000",
      logoUrl: "https://via.placeholder.com/80",
    },
    {
      societyId: "2",
      name: "Music Club",
      members: 80,
      category: "Music",
      categoryColor: "#FF6347",
      categoryTextColor: "#FFF",
      logoUrl: "https://via.placeholder.com/80",
    },
    {
      societyId: "3",
      name: "Tech Society",
      members: 200,
      category: "Tech",
      categoryColor: "#00BFFF",
      categoryTextColor: "#FFF",
      logoUrl: "https://via.placeholder.com/80",
    },
  ];

  const events = [
    {
      eventId: "1",
      date: "24 Nov",
      title: "Art Exhibition",
      subtitle: "Explore local artworks",
      location: "Art Hall",
      imageUrl: "https://via.placeholder.com/200x120",
      circleImageUrl: "https://via.placeholder.com/60",
    },
    {
      eventId: "2",
      date: "25 Nov",
      title: "Music Fest",
      subtitle: "Live performances",
      location: "Auditorium",
      imageUrl: "https://via.placeholder.com/200x120",
      circleImageUrl: "https://via.placeholder.com/60",
    },
    {
      eventId: "3",
      date: "26 Nov",
      title: "Tech Meetup",
      subtitle: "Networking event",
      location: "Conference Room",
      imageUrl: "https://via.placeholder.com/200x120",
      circleImageUrl: "https://via.placeholder.com/60",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Home
        </Text>
        <IconButton
          icon={() => <Ionicons name="" size={24} color={theme.colors.onBackground} />}
          onPress={() => {}}
        />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Recommended Societies
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {societies.map((society) => (
            <View key={society.societyId} style={styles.cardWrapper}>
              <SocietyCard {...society} />
            </View>
          ))}
        </ScrollView>

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Recommended Events
        </Text>
        <View style={styles.verticalScroll}>
          {events.map((event) => (
            <View key={event.eventId}>
              <EventCard {...event} />
            </View>
          ))}
        </View>
      </ScrollView>

      <SearchButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontWeight: "bold",
  },
  container: {
    padding: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  horizontalScroll: {
    padding: 2,
    marginBottom: 16,
  },
  cardWrapper: {
    marginRight: 12,
  },
  verticalScroll: {
    width: '100%',
    paddingBottom: 125,
  },
  eventCardWrapper: {
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
});