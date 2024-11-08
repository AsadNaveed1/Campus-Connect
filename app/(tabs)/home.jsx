import React from "react";
import { Text, View } from "react-native";
import { useAuthContext } from "../../contexts/AuthContext";

export default function Home() {
  const user = useAuthContext();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user ? (
        <Text>This is your homepage.</Text>
      ) : (
        <Text>Sign-in to see your personalised homepage.</Text>
      )}
    </View>
  );
}
