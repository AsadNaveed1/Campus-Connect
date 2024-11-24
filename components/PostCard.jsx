import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

const PostCard = (props) => {
  const { id, image, caption, numLikes } = props;
  const theme = useTheme();
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [likes, setLikes] = useState(numLikes);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const toggleHeart = () => {
    setIsHeartFilled(!isHeartFilled);
    setLikes(isHeartFilled ? likes - 1 : likes + 1);
  };

  const toggleCaption = () => {
    setIsCaptionExpanded(!isCaptionExpanded);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Image source={{ uri: image }} style={styles.image} />
      
      <View style={[styles.captionContainer, { color: theme.colors.onSurface }]}>
        <TouchableOpacity onPress={toggleCaption} style={styles.captionWrapper}>
          <Text
            variant="bodyMedium"
            style={[styles.caption, { color: theme.colors.onBackground }]}
            numberOfLines={isCaptionExpanded ? 0 : 1}
            ellipsizeMode="tail"
          >
            {caption}
          </Text>
        </TouchableOpacity>
        <View style={styles.likesContainer}>
          <TouchableOpacity style={styles.heartButton} onPress={toggleHeart}>
            <Ionicons name={isHeartFilled ? "heart" : "heart-outline"} size={24} color="red" />
          </TouchableOpacity>
          <Text variant="bodyMedium" style={[styles.likes, { color: theme.colors.onBackground }]}>{likes}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginBottom: 16,
    overflow: 'hidden',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  captionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: 8,
    paddingBottom: 8,
  },
  captionWrapper: {
    flex: 1,
    paddingRight: 75, // Add padding to the right to create space for the likes icon
  },
  caption: {
    fontSize: 16,
    textAlign: 'left',
    paddingLeft: 8,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 4,
    top: -4,
    // marginLeft: 8,
    // paddingBottom: 8,

  },
  heartButton: {
    marginLeft: 12,
  },
  likes: {
    marginLeft: 4,
    fontSize: 16,
    paddingRight: 8,
  },
  imageSeparator: {
    height: 1,
    paddingTop: 0,
  },
});

export default PostCard;