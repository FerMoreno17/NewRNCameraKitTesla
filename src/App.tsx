import React from 'react';
import { CameraScreen } from 'react-native-camera-kit';

import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';

const App = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <CameraScreen
        actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
        onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
        flashImages={{
          // optional, images for flash state
          on: require('path/to/image'),
          off: require('path/to/image'),
          auto: require('path/to/image'),
        }}
        cameraFlipImage={require('path/to/image')} // optional, image for flipping camera button
        captureButtonImage={require('path/to/image')} // optional, image capture button
        torchOnImage={require('path/to/image')} // optional, image for toggling on flash light
        torchOffImage={require('path/to/image')} // optional, image for toggling off flash light
        hideControls={false} // (default false) optional, hides camera controls
        showCapturedImageCount={false} // (default false) optional, show count for photos taken during that capture session
      />
    </SafeAreaView>
  );
};

export default App;
