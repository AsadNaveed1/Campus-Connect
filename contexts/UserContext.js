import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { firebaseAuth, firebaseDB } from '../firebaseConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);

  const setUser = (userData) => {
    setUserState(userData);
  };

  useEffect(() => {
    let unsubscribeFromUserDoc = null;

    const subscribeToUserDoc = (email) => {
      const userDocRef = doc(firebaseDB, "users", email);
      unsubscribeFromUserDoc = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUser(userData);
        } else {
          setUser(null);
        }
      }, (error) => {
        console.error("Failed to subscribe to user document", error);
      });
    };

    const unsubscribeFromAuth = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        subscribeToUserDoc(user.email);
      } else {
        setUser(null);
        if (unsubscribeFromUserDoc) {
          unsubscribeFromUserDoc();
        }
      }
    });

    return () => {
      if (unsubscribeFromUserDoc) {
        unsubscribeFromUserDoc();
      }
      unsubscribeFromAuth();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};