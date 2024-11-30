import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Pressable, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, Dialog, Portal, Button, Text } from "react-native-paper";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { firebaseStorage } from "../firebaseConfig";

const EditableImage = ({ imagePath, imageId, editable }) => {
  const [imageUri, setImageUri] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storageRef = ref(firebaseStorage, `${imagePath}/${imageId}`);
        const downloadURL = await getDownloadURL(storageRef);
        setImageUri(downloadURL);
      } catch (error) {
      }
    };

    fetchImage();
  }, [imagePath, imageId]);

  const handleImagePicker = async () => {
    if (!editable) return;
    setDialogVisible(true);
  };

  const openCamera = async () => {
    setDialogVisible(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    setDialogVisible(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const deleteImage = async () => {
    setDialogVisible(false);
    try {
      const storageRef = ref(firebaseStorage, `${imagePath}/${imageId}`);
      await deleteObject(storageRef);
      setImageUri(null);
    } catch (error) {
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(firebaseStorage, `${imagePath}/${imageId}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setImageUri(downloadURL);
    } catch (error) {
    }
  };

  return (
    <View style={styles.container}>
      {editable ? (
        <Pressable
          onPress={handleImagePicker}
          style={({ pressed }) => [
            styles.pressable,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <View style={styles.iconOverlay}>
                <Ionicons name="add" size={40} color={'white'} />
              </View>
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="add" size={40} color={theme.colors.outline} />
            </View>
          )}
        </Pressable>
      ) : (
        <View style={styles.pressable}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera-outline" size={40} color={theme.colors.outline} />
            </View>
          )}
        </View>
      )}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title style={styles.dialogTitle}>Upload Image</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <View style={styles.buttonContainer}>
              <Button onPress={openCamera} style={styles.button}>Camera</Button>
              <Button onPress={openGallery} style={styles.button}>Gallery</Button>
              {imageUri && ( <Button onPress={deleteImage}>Delete</Button> )}
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressable: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  iconOverlay: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  dialogContent: {
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
});

export default EditableImage;