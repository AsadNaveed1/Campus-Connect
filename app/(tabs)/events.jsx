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
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>Events</Text>
        <IconButton
          icon={() => <Ionicons name="add" size={24} color={theme.colors.onBackground} />}
          onPress={() => {}}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
      <MyEventCard
          circleImageUrl={require('../../assets/images/hku.png')}
          eventName="Event Name"
          societyName="Society Name"
          eventDate="25/09/2024"
        />
        <EventCard
          date="25/09/2024"
          title="Event Name"
          subtitle="Society Name"
          location="Location"
          onJoinPress={() => {}}
          imageUrl="https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg"
          circleImageUrl={require('../../assets/images/hku.png')}
        />
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
  },
});