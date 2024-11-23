import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const MyEventCard = ({ circleImageUrl, eventName, societyName, eventDate }) => {
  const theme = useTheme();

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.circleOverlay}>
        <Image source={circleImageUrl} style={styles.circleImage} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.eventName} numberOfLines={1} ellipsizeMode="tail">
          {eventName}
        </Text>
        <Text style={styles.societyName}>{societyName}</Text>
        <Text style={styles.eventDate}>{eventDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    height: 80,
    width: 210,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  circleOverlay: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    padding: 10,
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
  },
  eventName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  societyName: {
    fontWeight: 'bold',
    color: 'grey',
    fontSize: 12,
  },
  eventDate: {
    fontSize: 12,
    color: 'grey',
  },
});

export default MyEventCard;