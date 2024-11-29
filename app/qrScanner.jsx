import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function QRScanner() {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={[styles.container, { backgroundColor: theme.colors.background }]}></View>;
  }
  if (hasPermission === false) {
    return <View style={[styles.container, { backgroundColor: theme.colors.background }]}><Text>Please enable camera permissions to use this feature.</Text></View>;
  }

  const handleBackButton = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
            barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(scannedValue) => {
            const qrValue = scannedValue.data;
            const type = qrValue.substring(0, 3);
            const pageId = qrValue.substring(4);
            if(type == "soc") {
                router.replace({ pathname: "/societyPage", params: { societyId: pageId } });
            } else if(type == "eve") {
                router.replace({ pathname: "/eventPage", params: { eventId: pageId } });
            }
        }}
      >
      </CameraView>
      <View style={styles.overlayContainer}>
        <Ionicons name="qr-code-outline" size={18} color="white" />
        <Text style={styles.overlayText}>Scan code</Text>
      </View>
      <IconButton
        icon={() => <Ionicons name="chevron-back" size={24} color="#fff" />}
        size={24}
        onPress={handleBackButton}
        style={styles.backButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    height: '10%',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  overlayText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 8,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});