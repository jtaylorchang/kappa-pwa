import React from 'react';
import { StyleSheet, Image, StatusBar, View } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { RemoveScroll } from 'react-remove-scroll';

import { GalioProvider } from '@galio';

import { TRedux } from '@reducers';
import { _auth, _prefs } from '@reducers/actions';
import useWindowSize from '@services/useWindowSize';
import { Ghost, EventDrawer, BrotherDrawer, ToastController, VotingController, ModalController } from '@components';
import { Images, theme } from '@constants';
import AppNavigator from '@navigation/AppNavigator';

import './styles/global.css';

enableScreens();

const assetImages = [Images.Kappa];

const cacheImages = (images: any) => {
  return images.map((image: any) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

const _loadResourcesAsync = async () => {
  await Promise.all([
    ...cacheImages(assetImages),
    Font.loadAsync({
      OpenSans: require('../assets/font/OpenSans-Regular.ttf'),
      'OpenSans-Bold': require('../assets/font/OpenSans-Bold.ttf'),
      'OpenSans-SemiBold': require('../assets/font/OpenSans-SemiBold.ttf'),
      'OpenSans-Light': require('../assets/font/OpenSans-Light.ttf'),
      'PlayfairDisplay-Bold': require('../assets/font/PlayfairDisplay-Bold.ttf')
    })
  ]);
};

const _handleLoadingError = (error: any) => {
  // In this case, you might want to report the error to your error
  // reporting service, for example Sentry
  console.warn(error);
};

const App = () => {
  const loadedUser = useSelector((state: TRedux) => state.auth.loadedUser);
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const loadedPrefs = useSelector((state: TRedux) => state.prefs.loaded);

  const [isLoadingComplete, setIsLoadingComplete] = React.useState<boolean>(false);
  const [innerWidth, innerHeight] = useWindowSize();

  const dispatch = useDispatch();
  const dispatchShowLogin = React.useCallback(() => dispatch(_auth.showModal()), [dispatch]);
  const dispatchLoadUser = React.useCallback(() => dispatch(_auth.loadUser()), [dispatch]);
  const dispatchLoadPrefs = React.useCallback(() => dispatch(_prefs.loadPrefs()), [dispatch]);

  const _handleFinishLoading = React.useCallback(() => {
    setIsLoadingComplete(true);
  }, []);

  const handleLoading = React.useCallback(async () => {
    await _loadResourcesAsync();
    _handleFinishLoading();
  }, [_handleFinishLoading]);

  React.useEffect(() => {
    if (!loadedUser) {
      dispatchLoadUser();
    }
  }, [dispatchLoadUser, loadedUser]);

  React.useEffect(() => {
    if (loadedUser && !authorized) {
      dispatchShowLogin();
    }
  }, [loadedUser, authorized, dispatchShowLogin]);

  React.useEffect(() => {
    if (!loadedPrefs) {
      dispatchLoadPrefs();
    }
  }, [dispatchLoadPrefs, loadedPrefs]);

  React.useEffect(() => {
    handleLoading();
  }, [handleLoading]);

  if (!isLoadingComplete) {
    return (
      <AppLoading startAsync={_loadResourcesAsync} onError={_handleLoadingError} onFinish={_handleFinishLoading} />
    );
  } else {
    return (
      <GalioProvider theme={theme}>
        <StatusBar animated={true} translucent={true} backgroundColor="transparent" barStyle="dark-content" />

        <SafeAreaProvider>
          <RemoveScroll>
            <View
              style={[
                styles.container,
                {
                  width: innerWidth,
                  height: innerHeight
                }
              ]}
            >
              <AppNavigator />

              <Ghost style={styles.overlay}>
                <EventDrawer />
              </Ghost>

              <Ghost style={styles.overlay}>
                <BrotherDrawer />
              </Ghost>

              <ModalController />

              <ToastController />

              <VotingController />
            </View>
          </RemoveScroll>
        </SafeAreaProvider>
      </GalioProvider>
    );
  }
};

const styles = StyleSheet.create({
  container: {},
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default App;
