import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const ImageUploader = () => {
  const [imageUri, setImageUri] = useState(null);

  const handleImagePicker = async () => {
    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: openGallery },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Camera access is required to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Gallery access is required to upload an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={40} color="#ccc" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  placeholder: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
});

export default ImageUploader;