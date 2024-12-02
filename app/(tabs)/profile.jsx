import React, { useState, useEffect } from "react";
import { View, StyleSheet, ToastAndroid, ScrollView, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput, useTheme, IconButton } from "react-native-paper";
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUserContext } from "../../contexts/UserContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { firebaseDB } from "../../firebaseConfig";
import EditableImage from "../../components/EditableImage";

export default function Profile() {
  const auth = useAuthContext();
  const router = useRouter();
  const theme = useTheme();
  const { user, setUser } = useUserContext();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState(0);
  const [universityID, setUniversityID] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(firebaseDB, "users", auth.email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name);
          setBio(userData.bio);
          setDegree(userData.degree);
          setMajor(userData.major);
          setYear(Number(userData.year));
          setUniversityID(userData.universityID);
          setProfilePicture(userData.profilePicture);
          setUser(userData);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const authObj = getAuth();
      await signOut(authObj);
      setUser(null);
      ToastAndroid.show("Logged out", ToastAndroid.SHORT);
      router.replace('/');
    } catch (error) {
      ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
    }
  };

  const handleUpdate = async () => {
    try {
      const userDocRef = doc(firebaseDB, "users", auth.email);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedUserData = {
          name,
          bio,
          degree,
          major,
          year,
          universityID,
          profilePicture,
          joinedEvents: userData.joinedEvents || [],
          joinedSocieties: userData.joinedSocieties || []
        };
        await updateDoc(userDocRef, updatedUserData);
        setUser(updatedUserData);
        ToastAndroid.show("Profile updated", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
    }
  };

  const handleEditModeChange = () => {
    if (isEditable) {
      handleUpdate();
    }
    setIsEditable(!isEditable);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.content}>
              {user ? (
                <>
                  <View style={styles.imageContainer}>
                    <EditableImage imageUri={profilePicture} setImageUri={setProfilePicture} editable={isEditable} imagePath={`users/profilePictures/${auth.email}`} />
                  </View>
                  <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
                    <TextInput
                      style={[styles.input, { backgroundColor: isEditable ? theme.colors.surface : 'transparent' }]}
                      mode="outlined"
                      label="Name"
                      value={name}
                      onChangeText={setName}
                      placeholderTextColor={theme.colors.placeholder}
                      outlineColor={isEditable ? theme.colors.outline : 'transparent'}
                      theme={{ roundness: 15, colors: { background: 'transparent' } }}
                      editable={isEditable}
                      pointerEvents={isEditable ? 'auto' : 'none'}
                    />
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, styles.smallInput, { backgroundColor: isEditable ? theme.colors.surface : 'transparent' }]}
                        mode="outlined"
                        label="Degree"
                        value={degree}
                        onChangeText={setDegree}
                        placeholderTextColor={theme.colors.placeholder}
                        outlineColor={isEditable ? theme.colors.outline : 'transparent'}
                        theme={{ roundness: 15, colors: { background: 'transparent' } }}
                        editable={isEditable}
                        pointerEvents={isEditable ? 'auto' : 'none'}
                      />
                      <TextInput
                        style={[styles.input, styles.largeInput, { backgroundColor: isEditable ? theme.colors.surface : 'transparent' }]}
                        mode="outlined"
                        label="Major"
                        value={major}
                        onChangeText={setMajor}
                        placeholderTextColor={theme.colors.placeholder}
                        outlineColor={isEditable ? theme.colors.outline : 'transparent'}
                        theme={{ roundness: 15, colors: { background: 'transparent' } }}
                        editable={isEditable}
                        pointerEvents={isEditable ? 'auto' : 'none'}
                      />
                    </View>
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, styles.smallInput, { backgroundColor: isEditable ? theme.colors.surface : 'transparent' }]}
                        mode="outlined"
                        label="Year"
                        value={year.toString()}
                        onChangeText={(text) => setYear(Number(text))}
                        keyboardType="numeric"
                        placeholderTextColor={theme.colors.placeholder}
                        outlineColor={isEditable ? theme.colors.outline : 'transparent'}
                        theme={{ roundness: 15, colors: { background: 'transparent' } }}
                        editable={isEditable}
                        pointerEvents={isEditable ? 'auto' : 'none'}
                      />
                      <TextInput
                        style={[styles.input, styles.largeInput, { backgroundColor: isEditable ? theme.colors.surface : 'transparent' }]}
                        mode="outlined"
                        label="University ID"
                        value={universityID}
                        onChangeText={setUniversityID}
                        placeholderTextColor={theme.colors.placeholder}
                        outlineColor={isEditable ? theme.colors.outline : 'transparent'}
                        theme={{ roundness: 15, colors: { background: 'transparent' } }}
                        editable={isEditable}
                      />
                    </View>
                    <TextInput
                      style={[styles.input, { backgroundColor: isEditable ? theme.colors.surface : 'transparent' }]}
                      mode="outlined"
                      label="Bio"
                      value={bio}
                      onChangeText={setBio}
                      multiline={true}
                      numberOfLines={1}
                      placeholderTextColor={theme.colors.placeholder}
                      outlineColor={isEditable ? theme.colors.outline : 'transparent'}
                      theme={{ roundness: 15, colors: { background: 'transparent' } }}
                      editable={isEditable}
                    />
                    <View style={styles.buttonRow}>
                      <Button
                        mode="outlined"
                        style={[styles.button, { marginRight: 8 }]}
                        onPress={handleEditModeChange}
                        icon={() => <Ionicons name={isEditable ? "checkmark-outline" : "pencil-outline"} size={18} color={theme.colors.primary} />}
                      >
                        {isEditable ? "Save" : "Edit"}
                      </Button>
                      <Button
                        mode="contained"
                        onPress={handleLogout}
                        style={[styles.button, { backgroundColor: theme.colors.error }]}
                        labelStyle={{ color: theme.colors.onError }}
                        icon={() => <Ionicons name="exit-outline" size={18} color={theme.colors.onError} />}
                      >
                        Logout
                      </Button>
                    </View>
                  </View>
                </>
              ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  signInButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: "center",
    width: '100%',
  },
  signInPrompt: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  card: {
    marginTop: 125,
    width: '100%',
    padding: 16,
    paddingTop: 55,
    borderRadius: 15,
    elevation: 5,
  },
  smallInput: {
    width: '25%',
    marginRight: '2%',
  },
  largeInput: {
    width: '73%',
  },
  imageContainer: {
    marginTop: 36,
    width: 140,
    height: 140,
    borderRadius: 100,
    overflow: 'hidden',
    borderColor: 'lightgrey',
    borderWidth: 2,
    zIndex: 1,
    position: 'absolute',
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
  },
});