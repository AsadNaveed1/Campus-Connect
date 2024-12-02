import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput, ActivityIndicator, useTheme, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc, deleteDoc, addDoc, collection, Timestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { firebaseDB } from '../firebaseConfig';
import EditableImage from '../components/EditableImage';

const PostAdmin = () => {
  const { postId, societyId } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const [postData, setPostData] = useState({
    caption: '',
    image: '',
    date: '',
    society: societyId || '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        try {
          const postDoc = await getDoc(doc(firebaseDB, 'posts', postId));
          if (postDoc.exists()) {
            const data = postDoc.data();
            setPostData(data);
          }
        } catch (error) {
          console.error('Error fetching post data:', error);
        }
      } else {
        setIsEditable(true);
      }
      setLoading(false);
    };

    fetchPostData();
  }, [postId]);

  const handleSave = async () => {
    if (isEditable) {
      try {
        const postDocRef = doc(firebaseDB, 'posts', postId);
        const updatedPostData = {
          ...postData,
          date: Timestamp.fromDate(new Date()),
        };
        await updateDoc(postDocRef, updatedPostData);
        ToastAndroid.show('Post updated', ToastAndroid.SHORT);
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
    setIsEditable(!isEditable);
  };

  const handleCreate = async () => {
    try {
      const newPostData = {
        ...postData,
        date: Timestamp.fromDate(new Date()),
      };
      const postDocRef = await addDoc(collection(firebaseDB, 'posts'), newPostData);
      await updateDoc(doc(firebaseDB, 'societies', societyId), {
        posts: arrayUnion(postDocRef.id),
      });
      ToastAndroid.show('Post created', ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (postId) {
        const postDocRef = doc(firebaseDB, 'posts', postId);
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
          const postData = postDoc.data();
          if (postData.image) {
            const storage = getStorage();
            const imageRef = ref(storage, postData.image);
            await deleteObject(imageRef);
          }
        }
        await deleteDoc(postDocRef);
        await updateDoc(doc(firebaseDB, 'societies', societyId), {
          posts: arrayRemove(postId),
        });
        ToastAndroid.show('Post deleted', ToastAndroid.SHORT);
        router.back();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleImageUpload = async (uri) => {
    try {
      const postDocRef = doc(firebaseDB, 'posts', postId);
      await updateDoc(postDocRef, { image: uri });
      setPostData((prevData) => ({ ...prevData, image: uri }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleBackButton = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const screenHeight = Dimensions.get('window').height;
  const bannerHeight = screenHeight * 0.5;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <IconButton
          icon={() => <Ionicons name="chevron-back" size={24} color="#fff" />}
          size={24}
          onPress={handleBackButton}
          style={styles.backButton}
        />
        <View style={[styles.bannerContainer, { height: bannerHeight }]}>
          <EditableImage
            imageUri={postData.image}
            setImageUri={handleImageUpload}
            editable={!!postId && isEditable}
            imagePath={`posts/images/${postId}`}
            text={true}
          />
          {!postId && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Image can be added after post creation.</Text>
            </View>
          )}
        </View>
        <View style={styles.container}>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              mode="outlined"
              label="Caption"
              value={postData.caption}
              onChangeText={(text) => setPostData({ ...postData, caption: text })}
              theme={{ roundness: 15 }}
              editable={isEditable}
              multiline
              numberOfLines={12}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttonRow, { backgroundColor: theme.colors.background }]}>
        {postId ? (
          <>
            <Button
              mode="contained"
              onPress={handleDelete}
              style={[styles.button, { backgroundColor: theme.colors.error, marginRight: 8 }]}
              labelStyle={{ color: theme.colors.onError }}
              icon={() => <Ionicons name="trash-outline" size={18} color={theme.colors.onError} />}
            >
              Delete
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={[styles.button]}
              icon={() => <Ionicons name={isEditable ? "checkmark-outline" : "pencil-outline"} size={18} color={theme.colors.onPrimary} />}
            >
              {isEditable ? "Save" : "Edit"}
            </Button>
          </>
        ) : (
          <Button
            mode="contained"
            onPress={handleCreate}
            style={[styles.button]}
            icon={() => <Ionicons name="add-outline" size={18} color={theme.colors.onPrimary} />}
          >
            Create
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  bannerContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    padding: 16,
    borderRadius: 15,
    elevation: 5,
    marginTop: -60,
  },
  input: {
    width: '100%',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  button: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PostAdmin;