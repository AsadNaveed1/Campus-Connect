import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking'; 

const MapCard = ({ latitude, longitude, title, description }) => {
  const openInGoogleMaps = () => {
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
    <TouchableOpacity onPress={openInGoogleMaps}>
      <View style={styles.card}>
        {latitude && longitude ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude, 
              longitude: longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false} 
            zoomEnabled={false} 
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              title={title || 'Event Location'} 
              description={description || 'Description of the location'}
            />
          </MapView>
        ) : (
          <View style={styles.map}>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 10, 
    overflow: 'hidden', 
    elevation: 3,
    backgroundColor: 'white',
  },
  map: {
    width: 330,
    height: 250,
  },
});

export default MapCard;