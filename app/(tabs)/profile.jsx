import React, { useState, useEffect } from "react";
import { View, StyleSheet, ToastAndroid, ScrollView, KeyboardAvoidingView, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput, useTheme, IconButton } from "react-native-paper";
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { useUserContext } from "../../contexts/UserContext";
import { firebaseDB } from "../../firebaseConfig";

export default function Profile() {
  const auth = getAuth();
  const router = useRouter();
  const theme = useTheme();
  const { user, setUser } = useUserContext();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [universityID, setUniversityID] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio);
      setDegree(user.degree);
      setMajor(user.major);
      setYear(user.year);
      setUniversityID(user.universityID);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      ToastAndroid.show("Logged out", ToastAndroid.SHORT);
      router.push('/register');
    } catch (error) {
      ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
    }
  };

  const handleUpdate = async () => {
    try {
      const currentUser = auth.currentUser;
      const userDocRef = doc(firebaseDB, "users", currentUser.email);
      const updatedUserData = { name, bio, degree, major, year, universityID };
      await updateDoc(userDocRef, updatedUserData);
      setUser(updatedUserData);
      ToastAndroid.show("Profile updated", ToastAndroid.SHORT);
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

  const handleSignIn = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>Profile</Text>
        <IconButton
          icon={() => <Ionicons name={isEditable ? "checkmark" : "pencil"} size={24} color={theme.colors.onBackground} />}
          onPress={handleEditModeChange}
        />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.content}>
              <Image source={require('../../assets/images/hku.png')} style={styles.logo} />
              <Text variant="titleMedium" style={[styles.universityName, { color: theme.colors.onBackground }]}>
                The University of Hong Kong
              </Text>
              <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
                {user ? (
                  <>
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
                        value={year}
                        onChangeText={setYear}
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
                      numberOfLines={3}
                      placeholderTextColor={theme.colors.placeholder}
                      outlineColor={isEditable ? theme.colors.outline : 'transparent'}
                      theme={{ roundness: 15, colors: { background: 'transparent' } }}
                      editable={isEditable}
                    />
                    <Button
                      mode="contained"
                      onPress={handleLogout}
                      style={{ backgroundColor: theme.colors.error, marginTop: 16 }}
                      labelStyle={{ color: theme.colors.onError }}
                      icon={() => <Ionicons name="exit-outline" size={24} color={theme.colors.onError} />}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Text variant="bodyMedium" style={[styles.signInPrompt, { color: theme.colors.onBackground }]}>
                      Sign-in to see your profile.
                    </Text>
                    <Button
                      mode="contained"
                      onPress={handleSignIn}
                      icon={() => <Ionicons name="person-circle-outline" size={24} color={theme.colors.onPrimary} />}
                    >
                      Sign-in
                    </Button>
                  </>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: "center",
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  universityName: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    width: '100%',
    padding: 16,
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
});