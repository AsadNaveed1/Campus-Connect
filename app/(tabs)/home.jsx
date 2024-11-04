import React, { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Text, View } from "react-native";
import { getAuth } from '../../firebase';

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    setSignedIn(!!user);
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {signedIn ? (
        <Text>This is your homepage.</Text>
      ) : (
        <Text>Sign-in to see your personalised homepage.</Text>
      )}
    </View>
  );
}
