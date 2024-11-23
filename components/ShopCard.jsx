import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';

const ShopCard = ({ image, title, price, onPress }) => {
  const theme = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          opacity: pressed ? 0.8 : 1, // Reduces opacity when pressed
          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }], // Slightly scales down the card when pressed
        },
      ]}
      onPress={onPress}
    >
      {/* Full Image Background */}
      <ImageBackground source={image} style={styles.image}>
        {/* Price Badge */}
        <View
          style={[
            styles.priceBadge,
            {
              backgroundColor: theme.colors.secondaryContainer,
              shadowColor: theme.colors.onSecondaryContainer,
            },
          ]}
        >
          <Text style={[styles.priceText, { color: theme.colors.onSecondaryContainer }]}>
            HK${price}
          </Text>
        </View>
      </ImageBackground>

      {/* Title Below the Image */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff', // Ensures the background blends well
    elevation: 4, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4, // iOS shadow
  },
  image: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end', // Aligns badge properly
  },
  titleContainer: {
    backgroundColor: 'white', // Solid white background for the title section
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center-align the text
  },
  priceBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ShopCard;
