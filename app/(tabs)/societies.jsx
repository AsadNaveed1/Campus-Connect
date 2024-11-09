import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from "../../contexts/AuthContext";

export default function Societies() {
  const user = useAuthContext();

  return (
    <SafeAreaView style={{ flex: 1 }}>
    </SafeAreaView>
  );
}