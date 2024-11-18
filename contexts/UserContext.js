import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseAuth, firebaseDB } from '../firebaseConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async (user) => {
      try {
        const userDoc = await getDoc(doc(firebaseDB, "users", user.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to load user data from Firestore", error);
      }
    };

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          await loadUserData(user);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};