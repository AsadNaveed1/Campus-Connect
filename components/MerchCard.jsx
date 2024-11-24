import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

const MerchCard = ({ id, name, price, image, societyId }) => {
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
    router.push({ pathname: "/merchPage", params: { merchId: id, societyId } });
  };

  return (
    <View>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <Animated.View style={[styles.cardContainer, { backgroundColor: theme.colors.surface, transform: [{ scale }] }]}>
          <View style={styles.imageContainer}>
            <Image source={ image } style={styles.image} />
            <View style={[styles.feeBadge, { backgroundColor: `${theme.colors.background}` }]}>
              <Text style={[styles.feeText, { color: theme.colors.onBackground }]}>{`$${price}`}</Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
      <View style={styles.labelContainer}>
        <Text style={[styles.name, { color: theme.colors.onSurface }]}>{name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    marginVertical: 10,
    width: 150,
    height: 200,
  },
  imageContainer: {
    position: 'relative',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  feeBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    borderRadius: 15,
    padding: 5,
    elevation: 5,
  },
  feeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  labelContainer: {
    alignItems: 'flex-start', 
    marginTop: 2,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MerchCard;