/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { CameraScreen } from 'react-native-camera-kit';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';

import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const App = () => {
  const [isPermitted, setIsPermitted] = useState(false);
  const [captureImage, setCaptureImage] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    icon: {
      width: 30,
      height: 30,
    },
  });

  async function requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Acceso a cámara',
          message: 'Solicitamos permiso para validar identidad',
          buttonPositive: 'Aceptar',
          buttonNegative: 'Cancelar',
        }
      );
      //if CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('Error  Camera_permission ==>', error);
    }
    return false;
  }

  async function requestExternalReadPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Acceso a archivo',
          message: 'Solicitamos acceso para ver fotografia',
          buttonPositive: 'Aceptar',
          buttonNegative: 'Cancelar'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('Error_external_read_Permission ===>', error);
    }
    return false;
  }

  async function requestExternalWritePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Acceso a archivo',
          message: 'Solicitamos acceso para ver fotografia',
          buttonPositive: 'Aceptar',
          buttonNegative: 'Cancelar'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('Error_external_read_Permission ===>', error);
    }
    return false;
  }

  async function openCamera() {
    if (Platform.OS === 'android') {
      if (await requestCameraPermission()) {
        if (await requestExternalWritePermission()) {
          if (await requestExternalReadPermission()) {
            setIsPermitted(true);
          } else {
            Alert.alert('READ_EXTERNAL_STORAGE permission denied');
          }
        } else {
          Alert.alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } else {
        Alert.alert('CAMERA permission denied');
      }
    }
    else {
      setIsPermitted(true);
    }
  }

  async function onBottomButtonPressed(event: any) {
    const image = event.image;
    cropImage(image.uri);
    if (event.type === 'left') {
      setIsPermitted(false);
    }
  }

  async function cropImage(imageUri: string) {
    const anchoRecomendado = 600;
    const altoRecomendado = 720;
    const result = await ImageResizer.createResizedImage(
      imageUri,
      anchoRecomendado,
      altoRecomendado,
      'JPEG',
      50,
      0,
      undefined,
      false,
      {
        mode: 'contain',
        onlyScaleDown: true,
      }
    );
    console.log({ result });
    const img64 = await RNFS.readFile(result.uri, 'base64');
    console.log({ img64 });
    setCaptureImage(result.uri);

  }

  if (captureImage !== (undefined || '')) {
    return (
      <>
        <View style={{ flex: 1 }}>
          <Image source={{ uri: captureImage }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
        </View>
        <Pressable onPress={() => { setIsPermitted(false); }}>
          <Text>volver</Text>
        </Pressable>
      </>);
  }

  return (
    <SafeAreaView style={styles.container}>
      {isPermitted ? (
        <CameraScreen
          actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
          onBottomButtonPressed={(event) => onBottomButtonPressed(event)}
          flashImages={{
            // optional, images for flash state
            on: require('./assets/images/flashOn.png'),
            off: require('./assets/images/flashOff.png'),
            auto: require('./assets/images/flashAuto.png'),
          }}
          cameraFlipImage={require('./assets/images/cameraFlipIcon.png')} // optional, image for flipping camera button
          captureButtonImage={require('./assets/images/cameraButton.png')} // optional, image capture button
          torchOnImage={require('./assets/images/torchOn.png')} // optional, image for toggling on flash light
          torchOffImage={require('./assets/images/flashOff.png')} // optional, image for toggling off flash light
          hideControls={false} // (default false) optional, hides camera controls
          showCapturedImageCount={false} // (default false) optional, show count for photos taken during that capture session
          cameraRatioOverlay={undefined}
          captureButtonImageStyle={styles.icon}
          cameraFlipImageStyle={styles.icon}
          showFrame={undefined}
          scanBarcode={undefined}
          laserColor={undefined}
          frameColor={undefined}
          torchImageStyle={styles.icon}
        />
      )
        : (
          <View>
            <Pressable onPress={openCamera}>
              <Text>Open camera</Text>
            </Pressable>
          </View>
        )
      }
    </SafeAreaView>
  );
};

export default App;
