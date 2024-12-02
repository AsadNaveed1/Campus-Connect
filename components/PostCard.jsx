import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

const PostCard = ({ postId, caption, image, societyName, date, minimal, admin, societyId }) => {
  const theme = useTheme();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    if (admin) {
      router.push({ pathname: '/postAdmin', params: { postId, societyId } });
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      {({ pressed }) => (
        <View
          style={[
            styles.cardContainer,
            { backgroundColor: pressed ? theme.colors.surfaceVariant : theme.colors.surface },
          ]}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.headerContainer}>
              <Text style={[styles.societyName, { color: theme.colors.onSurface }]} numberOfLines={1} ellipsizeMode="tail">
                {!minimal && societyName}
              </Text>
              <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
                {date}
              </Text>
            </View>
            <Text
              style={[styles.caption, { color: theme.colors.onSurface }]}
              numberOfLines={expanded ? undefined : 2}
              ellipsizeMode="tail"
            >
              {caption}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    marginVertical: 10,
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  detailsContainer: {
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  societyName: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  date: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  caption: {
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'justify',
  },
});

export default PostCard;