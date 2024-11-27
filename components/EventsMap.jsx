import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking';

// Dummy event data
const dummyEvents = [
  {
    id: 1,
    name: 'Art Exhibition',
    location: 'Central Art Gallery',
    latitude: 22.2819,
    longitude: 114.1582,
  },
  {
    id: 2,
    name: 'Tech Meetup',
    location: 'Cyberport',
    latitude: 22.2635,
    longitude: 114.1304,
  },
  {
    id: 3,
    name: 'Food Festival',
    location: 'Victoria Park',
    latitude: 22.2804,
    longitude: 114.1896,
  },
];

const EventsMap = () => {
  const openInGoogleMaps = (latitude, longitude, title) => {
    if (latitude && longitude) {
      const geoUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${title || 'Event Location'})`;

      Linking.canOpenURL(geoUrl)
        .then((supported) => {
          if (supported) {
            Linking.openURL(geoUrl);
          } else {
            const browserUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            Linking.openURL(browserUrl);
          }
        })
        .catch((err) => {
          console.error('An error occurred', err);
          Alert.alert('Error', 'Unable to open Google Maps.');
        });
    } else {
      Alert.alert('Error', 'Location is not available.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 22.3193,
          longitude: 114.1694,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {dummyEvents.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            title={event.name}
            description={event.location}
            onCalloutPress={() =>
              openInGoogleMaps(event.latitude, event.longitude, event.name)
            }
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: 'white',
  },
  map: {
    height: 400,
  },
});

export default EventsMap;
