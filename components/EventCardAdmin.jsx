import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const EventCardAdmin = (props) => {
  const { eventId, date, title, subtitle, location, imageUrl, circleImageUrl, minimal } = props;
  const theme = useTheme();
  const router = useRouter();
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    router.push({ pathname: "/eventAdmin", params: { eventId } });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={[styles.cardContainer, { backgroundColor: theme.colors.surface, transform: [{ scale }] }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={[styles.dateBadge, { backgroundColor: `${theme.colors.background}` }]}>
            <Text style={[styles.dateText, { color: theme.colors.onBackground }]}>{date}</Text>
          </View>
        </View>
        {!minimal && (
          <View style={styles.circleImageContainer}>
            <Image source={circleImageUrl} style={styles.circleImage} />
          </View>
        )}
        <View style={[styles.detailsContainer, minimal && styles.minimalDetailsContainer]}>
          <Text style={[styles.title, { color: theme.colors.onSurface }, minimal && styles.minimalTitle]}>{title}</Text>
          {!minimal && (
            <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>{subtitle}</Text>
          )}
          <View style={styles.bottomRow}>
            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" size={16} color={theme.colors.onSurface} />
              <Text style={[styles.location, { color: theme.colors.onSurface }]}>{location}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    marginVertical: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
  },
  dateBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    borderRadius: 15,
    padding: 5,
    elevation: 5,
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
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 15,
    paddingTop: 30,
  },
  minimalDetailsContainer: {
    paddingTop: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  minimalTitle: {
    marginBottom: 0,
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
});

export default EventCardAdmin;