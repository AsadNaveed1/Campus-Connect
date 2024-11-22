import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const eventsData = [
  { id: 1, title: 'Event Title 1', location: 'Location', date: '2024-01-01', image: 'https://img2.storyblok.com/150x150/f/116532/1080x720/14bcac9b23/11clubroom_milan_club.jpg' },
  { id: 2, title: 'Event Title 2', date: '2024-02-01', image: 'https://via.placeholder.com/150' },
  { id: 3, title: 'Event Title 3', date: '2024-03-01', image: 'https://via.placeholder.com/150' },
  { id: 4, title: 'Event Title 4', date: '2024-04-01', image: 'https://via.placeholder.com/150' },
  { id: 5, title: 'Event Title 5', date: '2024-05-01', image: 'https://via.placeholder.com/150' },
  { id: 6, title: 'Event Title 6', date: '2024-06-01', image: 'https://via.placeholder.com/150' },
];

const SocietyEventsCard = () => {
  return (
    <ScrollView contentContainerStyle={styles.shopContainer}>
      <View style={styles.container}>
        {eventsData.map((event, index) => (
          <View key={event.id} style={[styles.card, (index % 2 === 0 ? styles.leftCard : styles.rightCard)]}>
            <Image source={{ uri: event.image }} style={styles.image} />
            <Text style={styles.date}>{event.date}</Text>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.location}>{event.location}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    position: 'relative',
    elevation: 5
  },
  leftCard: {
    marginRight: '2%',
  },
  rightCard: {
    marginLeft: '2%',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  location: {
    marginTop: 2,
    fontSize: 16,
    // fontWeight: 'bold'
  },
  date: {
    position: 'absolute',
    right: 13, // Adjusted to align to the top right
    top: 13, // Adjusted to align to the top right
    fontSize: 10, // Smaller font size
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'black',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    overflow: 'hidden' // Ensures nothing spills out of the container
  }
});

export default SocietyEventsCard;