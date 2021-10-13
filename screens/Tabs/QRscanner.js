import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Linking,
  Platform,
  Text,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import Toast from 'react-native-tiny-toast';
import styled, { withTheme } from 'styled-components';
import IntentLauncher from 'react-native-intent-launcher';
import ImagePicker from 'react-native-image-picker';
import { QRreader } from 'react-native-qr-decode-image-camera';
import OpacityLoader from '../../components/OpacityLoader';
import { transferData } from '../../recoil/recoilAtoms';
import { useRecoilValue } from 'recoil';
import AsyncStorage from '@react-native-community/async-storage';
import { isAddressFunc } from '../../Web3Connecter';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Touchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 15%;
`;

const ButtonText = styled.Text`
  color: rgb(0, 122, 255);
  text-align: center;
  font-size: 21px;
`;

export default withTheme(({ theme, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    hasCameraPermission: null,
    scanned: false,
  });

  //recoil getter
  const { coinValue } = useRecoilValue(transferData);

  useEffect(() => {
    getPermissionsAsync();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log('QR코드 스캔');
    setState((state) => ({ ...state, scanned: true }));
    if (type === 'QR_CODE' || type === 'org.iso.QRCode' || type === 256) {
      // QRtransfer 페이지가 사라졌으므로, transferSecond로 돌아간다
      // 지갑 주소 유효성 검사
      const walletStr = await AsyncStorage.getItem('WALLETS');
      const wallet = JSON.parse(walletStr);

      if (wallet.address === data) {
        Vibration.vibrate(150);
        return Alert.alert('알림', '본인 지갑주소는 입력할 수 없습니다.');
      }

      if (!isAddressFunc(data)) {
        Vibration.vibrate(150);
        return Alert.alert(
          '알림',
          '지갑 주소 형식이 아닙니다',
          [
            {
              text: '확인',
              onPress: () => null,
              style: 'cancel',
            },
          ],
          {
            cancelable: false,
          },
        );
      } else {
        if (!coinValue) {
          return navigation.navigate('Transfer', {
            qrAddress: data,
          });
        } else {
          return navigation.navigate('TransferSecond', {
            qrAddress: data,
            coinValue: coinValue,
          });
        }
      }
    } else {
      return Alert.alert(
        '알림',
        'QR코드 형식이 아닙니다',
        [
          {
            text: '확인',
            onPress: () => null,
            style: 'cancel',
          },
        ],
        {
          cancelable: false,
        },
      );
    }
  };

  const getPermissionsAsync = async () => {
    let isPermissionCamera;
    if (Platform.OS === 'ios') {
      isPermissionCamera = await check(PERMISSIONS.IOS.CAMERA);
    } else {
      isPermissionCamera = await check(PERMISSIONS.ANDROID.CAMERA);
    }
    if (isPermissionCamera === RESULTS.GRANTED) {
      setState((state) => ({ ...state, hasCameraPermission: true }));
    } else {
      setState((state) => ({ ...state, hasCameraPermission: false }));
      Alert.alert(
        '알림',
        '카메라 또는 사진첩 권한이 거절되었습니다,\n앱 설정에서 카메라 권한을 활성화해주세요',
        [
          {
            text: '뒤로가기',
            onPress: () => navigation.goBack(),
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
                setTimeout(() => {
                  navigation.goBack();
                }, 100);
              }
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  // 갤러리로 이동
  const handleGoToGallery = () => {
    setIsLoading(true);

    try {
      ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          title: '사진을 선택하세요',
          maxWidth: 300,
          maxHeight: 300,
        },
        async (response) => {
          if (response.didCancel) {
            console.log('취소함');
            setIsLoading(false);
          } else if (response.error) {
            Toast.show(response.error, { position: 0 });
            setIsLoading(false);
          } else {
            decodeImage(Platform.OS === 'ios' ? response.uri : response.path)
              .then(async (data) => {
                const walletStr = await AsyncStorage.getItem('WALLETS');
                const wallet = JSON.parse(walletStr);

                if (wallet.address === data) {
                  Vibration.vibrate(150);
                  return Alert.alert(
                    '알림',
                    '본인 지갑주소는 입력할 수 없습니다.',
                  );
                }

                if (!isAddressFunc(data)) {
                  Vibration.vibrate(150);
                  return Alert.alert(
                    '알림',
                    '지갑 주소 형식이 아닙니다',
                    [
                      {
                        text: '확인',
                        onPress: () => null,
                        style: 'cancel',
                      },
                    ],
                    {
                      cancelable: false,
                    },
                  );
                } else {
                  setState((state) => ({ ...state, scanned: false }));
                  if (!coinValue) {
                    return navigation.navigate('Transfer', {
                      qrAddress: data,
                    });
                  } else {
                    return navigation.navigate('TransferSecond', {
                      qrAddress: data,
                      coinValue: coinValue,
                    });
                  }
                }
              })
              .catch((e) => {
                console.log(e.message);
                if (e.message && e.message === 'No related QR code') {
                  return Toast.show(`올바른 QR 이미지가 아닙니다.`, {
                    position: 0,
                  });
                }

                return Toast.show(
                  `스캔을 실패하였습니다.\n다시 시도해주시기 바랍니다.`,
                  { position: 0 },
                );
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        },
      );
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  if (state.hasCameraPermission === false) {
    return null;
  }

  return (
    <>
      {isLoading && <OpacityLoader />}

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {!state.scanned ? (
          <QRCodeScanner
            // reactivate={true}
            containerStyle={{ height: 100, width: 100 }}
            cameraStyle={{ height: '75%' }}
            showMarker={true}
            fadeIn={false}
            onRead={state.scanned ? undefined : handleBarCodeScanned}
            topContent={
              <Text style={styles.centerText}>
                상대방 지갑의 QR코드를 스캔합니다
              </Text>
            }
            bottomContent={
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={handleGoToGallery}
              >
                <Text style={styles.buttonText}>갤러리</Text>
              </TouchableOpacity>
            }
          />
        ) : (
          <>
            <Container>
              <ActivityIndicator
                size="large"
                color={theme.activityIndicatorColor}
                style={{ flex: 1, justifyContent: 'flex-end' }}
              />
              <Touchable
                onPress={(e) => {
                  setState((state) => ({ ...state, scanned: false }));
                }}
              >
                <ButtonText>다시 스캔하기</ButtonText>
              </Touchable>
            </Container>
          </>
        )}
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 24,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

// const opacity = 'rgba(0, 0, 0, .6)';
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   layerTop: {
//     flex: 1,
//     backgroundColor: opacity,
//   },
//   layerCenter: {
//     flex: 2,
//     flexDirection: 'row',
//   },
//   layerLeft: {
//     flex: 1,
//     backgroundColor: opacity,
//   },
//   focused: {
//     flex: 10,
//   },
//   layerRight: {
//     flex: 1,
//     backgroundColor: opacity,
//   },
//   layerBottom: {
//     flex: 1,
//     backgroundColor: opacity,
//   },
//   galleryToucha: {
//     borderWidth: 1,
//     borderColor: '#105943',
//     height: 55,
//     backgroundColor: '#105943',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   galleryText: {
//     fontSize: 24,
//     color: 'white',
//   },
// });

// QR이미지 읽기
const decodeImage = async (uri) => {
  return new Promise((resolve, reject) => {
    try {
      QRreader(uri)
        .then(async (data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
