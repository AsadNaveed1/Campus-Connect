import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleBackButton = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
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