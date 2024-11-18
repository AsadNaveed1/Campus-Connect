import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from "../../contexts/AuthContext";
import { useTheme } from "react-native-paper";

export default function Societies() {
  const user = useAuthContext();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
    </SafeAreaView>
  );
}