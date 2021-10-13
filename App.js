import './shim'; //babel.config와 역할이 비슷하다
import './global'; //babel.config와 역할이 비슷하다
import React, { useState, useEffect } from 'react';
import {
  Platform,
  Alert,
  StatusBar,
  Linking,
  Text,
  AppState,
} from 'react-native';
import RNExitApp from 'react-native-exit-app'; //리액트 네이티브 앱을 종료하는 모듈
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';
import options from './apollo';
import { ThemeProvider } from 'styled-components';
import styles from './styles';
import NavController from './components/NavController';
import NetInfo from '@react-native-community/netinfo';
import LocalAuthentication from 'rn-local-authentication';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
import { PERMISSIONS, RESULTS, request, check } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import IntentLauncher from 'react-native-intent-launcher';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import { Notifications } from 'react-native-notifications';
import { RecoilRoot } from 'recoil';
import codePush from 'react-native-code-push';

const App = () => {
  const [loaded, setloaded] = useState(false);
  const [client, setClient] = useState(null);
  const [netConnect, setNetConnect] = useState(true);

  const [state, setState] = useState({
    walletExist: false,
    beginning: false,
    policy: false,
    authType: 'pin',
    useAuthenticationPossible: 0,
    alreadyAuthenticatie: false,
  });

  // ============== 폰트 사이즈 모바일 시스템 영향 받지 않는 props ==============
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  const preLoad = async () => {
    console.log('preLoad start');
    try {
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage,
      });

      // 디바이스 네트워크 실행여부 확인
      NetInfo.fetch().then(({ isConnected }) => {
        if (isConnected) {
          return setNetConnect(true);
        } else {
          return Alert.alert(
            '알림',
            '모바일 데이터 또는 와이파이가 실행중이어야 합니다\n잠시 후 다시 실행해 주세요',
            [
              {
                text: '앱 종료',
                onPress: () => RNExitApp.exitApp(),
              },
            ],
            { cancelable: false },
          );
        }
      });

      //※※※ build.gradle의 versionName값을 불러온다 (gradle은 android에만 있으므로, android===ios 버전을 항상 동일하게 맞춰야 한다)
      const currentVersion = VersionCheck.getCurrentVersion();
      const storeLastVersion = await VersionCheck.getLatestVersion({
        provider: Platform.OS === 'ios' ? 'appStore' : 'playStore',
      });

      let needUpdate = null;
      if (storeLastVersion) {
        needUpdate = await VersionCheck.needUpdate({
          forceUpdate: true,
          currentVersion,
          latestVersion: storeLastVersion,
        });
      }

      if (needUpdate && needUpdate.isNeeded) {
        if (Platform.OS === 'ios') {
          const appStoreUrl = await VersionCheck.getAppStoreUrl({
            appID: '1539402792',
          });
          return Alert.alert(
            '알림',
            '스토어에 최신버전이 출시되었습니다.\n앱스토어로 이동합니다',
            [
              {
                text: '업데이트',
                onPress: () => Linking.openURL(appStoreUrl),
              },
            ],
          );
        } else {
          const playStoreUrl = await VersionCheck.getPlayStoreUrl({
            packageName: 'com.lawdians.gru_wallet_rn',
          });
          // console.log(`playStoreUrl : ${playStoreUrl}`);
          return Alert.alert(
            '알림',
            '스토어에 최신버전이 출시되었습니다.\n플레이스토어로 이동합니다',
            [
              {
                text: '업데이트',
                onPress: () => Linking.openURL(playStoreUrl),
              },
            ],
          );
        }
      }

      //코드 푸시 버전 체크
      codePushSync();
      //앱이 켜졌을 때 마다 codePushSync() 실행해서 업데이트 체크한다.
      AppState.addEventListener('change', (state) => {
        state === 'active' && codePushSync();
      });

      // await AsyncStorage.removeItem("jwt");
      const token = await AsyncStorage.getItem('jwt'); //앱이 실행될 때, jwt를 체크
      // console.log(`Authorization: Bearer ${token}`);
      const client = new ApolloClient({
        cache,
        request: async (operation) => {
          const token = await AsyncStorage.getItem('jwt'); //apolloClient가 새 request를 보낼 때, jwt체크(재실행 하지 않아도 바로 token적용을 확인하는 역할)
          //request header에
          return operation.setContext({
            headers: { Authorization: `Bearer ${token}` },
          });
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...options,
      });

      // 얘는 뭔지 모르겠다
      client.defaultOptions = {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        },
      };

      //지갑 존재여부, 본인인증 방식, 인트로슬라이더 완료 여부 state를 하나로 합치기
      const walletExistStorage = await AsyncStorage.getItem('walletExist'); //디바이스 지갑 존재여부 로딩
      const beginningStorage = await AsyncStorage.getItem('beginning'); //인트로슬라이더 완료 여부
      const authTypeStorage = await AsyncStorage.getItem('authType'); //디바이스 본인인증 방식을 불러오기
      const policyStorage = await AsyncStorage.getItem('policy'); //약관동의,개인정보처리방침 동의 여부

      // state 유효성 검사도 하나로 뭉치자
      const walletExistResult = validCheck(walletExistStorage); //return boolean
      const beginningResult = validCheck(beginningStorage); //return boolean
      const policyResult = validCheck(policyStorage); //return boolean
      const authTypeResult = validAuthType(authTypeStorage); //return "pin" or "bio"
      const isSupported = await LocalAuthentication.isSupportedAsync(); //장치가 생체 측정을 지원하는지 확인     (bool) true : false
      const biometryType = LocalAuthentication.getBiometryType(); //사용가능한 생체인식 타입            (string) TouchID : FaceID : None
      const biometryStatus = await LocalAuthentication.getBiometryStatusAsync(); //생체인식 사용 가능 여부            (string)BiometryIsAvailable : BiometryNotEnrolled

      setState({
        walletExist: walletExistResult,
        beginning: beginningResult,
        authType: authTypeResult,
        policy: policyResult,
        // 디바이스 지문인식 여부, 지문 저장 여부는 앱 중간에 변경되는 경우가 없기때문에, preload에서 한번만 불러오고 그 후에는 context로 전달한다.
        useAuthenticationPossible:
          Platform.OS === 'ios'
            ? isSupported && biometryType === 'TouchID'
              ? true
              : false
            : isSupported
            ? true
            : false,
        alreadyAuthenticatie: biometryStatus,
      });

      const alreadyPermissionCheck = await AsyncStorage.getItem(
        'alreadyPermissionCheck',
      );

      //Permission
      const isSimulator = await DeviceInfo.isEmulator();
      if (!isSimulator) {
        //Permission camera
        await _permissionCamera();
        //Permission notification
        await _permissionNotification(alreadyPermissionCheck);
      }

      // done
      if (Platform.OS !== 'ios') {
        SplashScreen.hide();
      }
      setloaded(true);
      setClient(client);

      // return () => {};
    } catch (error) {
      console.log(error);
      throw new Error('앱 로드중 에러');
    }
  };

  const _permissionCamera = async () => {
    try {
      if (Platform.OS === 'ios') {
        //IOS
        const prevStatus = await check(PERMISSIONS.IOS.CAMERA);
        if (prevStatus === RESULTS.DENIED) {
          request(PERMISSIONS.IOS.CAMERA).then((status) => {
            if (status !== RESULTS.GRANTED) {
              Alert.alert(
                '알림',
                '카메라 권한을 거절할 경우,\nQR 스캔 기능을 사용하실 수 없습니다',
                [
                  {
                    text: '취소',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {
                    text: '설정으로이동',
                    onPress: async () => {
                      if (Platform.OS === 'ios') {
                        await Linking.openURL('app-settings:'); //ios possible
                      } else {
                        const bundleIdentifier = `com.lawdians.gru_wallet_rn`;
                        IntentLauncher.startActivity({
                          action:
                            'android.settings.APPLICATION_DETAILS_SETTINGS',
                          data: `package:${bundleIdentifier}`,
                        });
                      }
                    },
                  },
                ],
                { cancelable: false },
              );
            }
          });
        }
      } else {
        //ANDROID
        const prevStatus = await check(PERMISSIONS.ANDROID.CAMERA);
        if (prevStatus === RESULTS.DENIED) {
          request(PERMISSIONS.ANDROID.CAMERA).then((status) => {
            if (status !== RESULTS.GRANTED) {
              Alert.alert(
                '알림',
                '카메라 권한을 거절할 경우,\nQR 스캔 기능을 사용하실 수 없습니다',
                [
                  {
                    text: '취소',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {
                    text: '설정으로이동',
                    onPress: async () => {
                      if (Platform.OS === 'ios') {
                        await Linking.openURL('app-settings:'); //ios possible
                      } else {
                        const bundleIdentifier = `com.lawdians.gru_wallet_rn`;
                        IntentLauncher.startActivity({
                          action:
                            'android.settings.APPLICATION_DETAILS_SETTINGS',
                          data: `package:${bundleIdentifier}`,
                        });
                      }
                    },
                  },
                ],
                { cancelable: false },
              );
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    // 언제 업데이트를 체크하고 반영할지를 정한다.
    // ON_APP_RESUME은 Background에서 Foreground로 오는 것을 의미
    // ON_APP_START은 앱이 실행되는(켜지는) 순간을 의미
    updateDialog: false,
    // 업데이트를 할지 안할지 여부에 대한 노출 (잠수함 패치의 경우 false)
    installMode: codePush.InstallMode.IMMEDIATE,
    // 업데이트를 어떻게 설치할 것인지 (IMMEDIATE는 강제설치를 의미)
  };

  const codePushSync = () => {
    codePush.sync(codePushOptions);
  };

  const _permissionNotification = async (alreadyPermissionCheck) => {
    const hasPermission = await messaging().hasPermission();
    if (hasPermission === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('notification permission already granted');
      messaging().onMessage(async (remoteMessage) => {
        Notifications.postLocalNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
        });
      });
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Message handled in the background!', remoteMessage);
      });
    } else {
      if (alreadyPermissionCheck !== 'true') {
        await AsyncStorage.setItem('alreadyPermissionCheck', 'true');
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          console.log('requestPermission status:', authStatus);
          messaging().onMessage(async (remoteMessage) => {
            Notifications.postLocalNotification({
              title: remoteMessage.notification.title,
              body: remoteMessage.notification.body,
            });
          });
          messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('Message handled in the background!', remoteMessage);
          });
        } else {
          Alert.alert(
            '중요',
            '알림 설정을 해제할 경우, 트랜잭션 실패 시\n재전송 요청 안내 메시지를 받을 수 없습니다\n그루는 앱 설정 -> 알림 허용을 권장합니다',
            [
              {
                text: '취소',
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: '설정으로이동',
                onPress: async () => {
                  if (Platform.OS === 'ios') {
                    await Linking.openURL('app-settings:'); //ios possible
                  } else {
                    const bundleIdentifier = `com.lawdians.gru_wallet_rn`;
                    IntentLauncher.startActivity({
                      action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                      data: `package:${bundleIdentifier}`,
                    });
                  }
                },
              },
            ],
            { cancelable: false },
          );
        }
      }
    }
  };

  useEffect(() => {
    try {
      preLoad(); //preLoad 안에서 1번 isConnected를 체크
    } catch (error) {
      //return Alert
      throw new Error(error);
    }
  }, []);

  return netConnect && loaded && client ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <RecoilRoot>
          <StatusBar
            barStyle={
              Platform.OS === 'android' ? 'light-content' : 'dark-content'
            }
          />
          {/* 최초 앱 실행 시, 로그인 기록  */}
          <NavController stateValue={state} />
        </RecoilRoot>
      </ThemeProvider>
    </ApolloProvider>
  ) : null;
};

export default codePush(App);

const validCheck = (value) => {
  //load wallet data
  if (!value || value === 'false' || value === null) {
    return false;
  } else {
    return true;
  }
};

const validAuthType = (value) => {
  //load wallet data
  if (value !== null || value !== '') {
    return value;
  } else {
    return 'pin';
  }
};
