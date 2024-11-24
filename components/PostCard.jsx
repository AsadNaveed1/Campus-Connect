import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';

const PostCard = (props) => {
  const { image, caption } = props;
  const theme = useTheme();
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

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
        <Image source={image} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={[styles.caption, { color: theme.colors.onSurface }]}>{caption}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 10,
  },
  caption: {
    fontSize: 14,
    textAlign: 'left',
  },
});

export default PostCard;