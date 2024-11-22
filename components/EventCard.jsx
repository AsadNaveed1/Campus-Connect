import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const EventCard = ({ date, title, subtitle, location, onJoinPress, imageUrl, circleImageUrl }) => {
  const theme = useTheme();

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={[styles.dateBadge, { backgroundColor: `${theme.colors.secondaryContainer}` }]}>
          <Text style={[styles.dateText, { color: theme.colors.onSecondaryContainer }]}>{date}</Text>
        </View>
      </View>
      <View style={styles.circleImageContainer}>
        <Image source={circleImageUrl} style={styles.circleImage} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>{subtitle}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={16} color={theme.colors.onSurface} />
            <Text style={[styles.location, { color: theme.colors.onSurface }]}>{location}</Text>
          </View>
          <Button
            mode="contained" 
            onPress={onJoinPress} 
            labelStyle={styles.joinButtonText}
          >
            Join
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
  },
  dateBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    borderRadius: 15,
    padding: 5,
  },
  dateText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  circleImageContainer: {
    position: 'absolute',
    top: '37%',
    left: '4%',
    zIndex: 1,
    width: 60,
    height: 60,
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'white',
    borderColor: 'lightgrey',
    borderWidth: 1,
    padding: 8,
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 15,
    paddingTop: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    marginLeft: 5,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default EventCard;