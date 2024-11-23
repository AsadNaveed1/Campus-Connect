import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from "../../contexts/AuthContext";
import { useTheme, Text, IconButton } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import EventCard from "../../components/EventCard";
import MyEventCard from "../../components/MyEventCard";

export default function Events() {
  const user = useAuthContext();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Events
        </Text>
        <IconButton
          icon={() => <Ionicons name="add" size={24} color={theme.colors.onBackground} />}
          onPress={() => {}}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}> 
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          My Events
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.myEventsScroll}>
          <MyEventCard
            circleImageUrl={require('../../assets/images/hku.png')}
            eventName="Event Name"
            societyName="Society Name"
            eventDate="25/09/2024"
          />
          <MyEventCard
            circleImageUrl={require('../../assets/images/hku.png')}
            eventName="Another Event"
            societyName="Another Society"
            eventDate="30/09/2024"
          />
          <MyEventCard
            circleImageUrl={require('../../assets/images/hku.png')}
            eventName="Yet Another Event"
            societyName="Cool Society"
            eventDate="05/10/2024"
          />
        </ScrollView>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          All Events
        </Text>
        <View>
          <EventCard
            date="25/09/2024"
            title="Event Name"
            subtitle="Society Name"
            location="Location"
            onJoinPress={() => {}}
            imageUrl="https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg"
            circleImageUrl={require('../../assets/images/hku.png')}
          />
          <EventCard
            date="30/09/2024"
            title="Another Event"
            subtitle="Another Society"
            location="Another Location"
            onJoinPress={() => {}}
            imageUrl="https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg"
            circleImageUrl={require('../../assets/images/hku.png')}
          />
        </View>
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
    marginBottom: 8,
  },
  myEventsScroll: {
    marginBottom: 16,
  },
});
