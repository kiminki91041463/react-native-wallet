import React, { useState, useEffect } from 'react';
import styled, { withTheme } from 'styled-components';
import LocalAuthentication from 'rn-local-authentication';
import {
  ActivityIndicator,
  Vibration,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BioMetricComponent from '../../components/BioMetricComponent';
import constants from '../../constants';
import Modal from 'react-native-modal';
import { StackActions } from 'react-navigation';
import PinView from 'react-native-pin-view';
import SecureStorage from 'react-native-secure-storage';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import Toast from 'react-native-tiny-toast';
import { setComma } from '../../utils';
import { storeData } from '../../StoreData';
import { rsaEncrytion } from '../../enDec';
import Clipboard from '@react-native-community/clipboard';

import {
  isLoggedIn,
  basicState,
  myInfoState,
  companyState,
} from '../../recoil/recoilAtoms';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';

const PINWarpper = styled.View`
  width: ${constants.width};
  height: ${Platform.OS === `ios`
    ? constants.height * 1.0
    : constants.height * 1.0};
  margin-top: 50px;
`;

const ModalView = styled.View`
  background-color: ${(props) => props.theme.subColor};
  align-items: center;
  border-radius: 11px;
  width: 300;
  height: ${(props) => (props.height ? props.height : 300)};
`;

const ModalButtonContainer = styled.View`
  justify-content: flex-end;
  flex: 1;
  flex-direction: row;
`;

const ModalTouchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-end;
`;

const ModalContainer = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.borderBottomColor};
`;

const ModalWarpper = styled.View`
  align-items: center;
`;

const ModalImage = styled.Image``;

const ModalTextContainer = styled.View`
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)};
  height: ${(props) => (props.height ? props.height : 100)};
  justify-content: center;
`;

const ModalTextHeader = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: center;
  font-size: 17px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 10)};
  justify-content: flex-start;
  margin-bottom: 5px;
`;

const ModalText = styled.Text`
  color: ${(props) => (props.color ? props.color : props.theme.blackTextColor)};
  text-align: center;
  font-size: 14px;
  border: 1px solid white;
`;

const ButtonText = styled.Text`
  text-align: center;
  color: ${(props) => (props.color ? props.color : props.theme.whiteTextColor)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : 17)};
`;

const ButtonText2 = styled.Text`
  text-align: center;
  color: ${(props) => (props.color ? props.color : props.theme.whiteTextColor)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : 17)};
  text-decoration-color: #51df97;
  text-decoration-line: underline;
`;

const FingerPrintView = styled.View`
  flex: 1;
`;

const IndicatorWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.backGroundColor};
`;

const Touchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
`;

const View = styled.View`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.View`
  flex: 1;
`;

const Text = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  text-align: center;
  font-size: 20;
  margin-top: 20%;
  margin-bottom: 10%;
`;

const CancelButtonText = styled.Text`
  color: ${(props) =>
    props.textColor === '????????????'
      ? props.theme.mainColor
      : props.theme.blackTextColor};
  text-align: center;
  font-size: 17px;
`;

const RadiusLeftRight = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
  border-bottom-left-radius: 10;
`;

const RadiusRight = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
`;

const BioMetricBGColor = styled.View`
  background-color: ${(props) => props.theme.bioMetricColor};
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const TRANSFER = gql`
  mutation transfer($receiver: String!, $value: String!) {
    transfer(receiver: $receiver, value: $value)
  }
`;

const CREATE_PURCHASE = gql`
  mutation createPurchase($requestAmount: String!) {
    createPurchase(requestAmount: $requestAmount)
  }
`;

const CHANGE_FAST_EXCHANGE = gql`
  mutation changeFastExchange($id: String!) {
    changeFastExchange(id: $id)
  }
`;

const REQUEST_CANCEL_EXCHANGE = gql`
  mutation requestCancelExchange($id: String!) {
    requestCancelExchange(id: $id) {
      isSuccess
      message
    }
  }
`;

const CREATE_EXCHANGE = gql`
  mutation createExchange(
    $requestAmount: String!
    $bank: String!
    $account: String!
    $creditNumber: String!
    $isFastExchange: Boolean!
  ) {
    createExchange(
      requestAmount: $requestAmount
      bank: $bank
      account: $account
      creditNumber: $creditNumber
      isFastExchange: $isFastExchange
    )
  }
`;

const CREATE_USER = gql`
  mutation createUser(
    $nickName: String!
    $address: String!
    $type: String!
    $secretValue: String!
  ) {
    createUser(
      nickName: $nickName
      address: $address
      type: $type
      secretValue: $secretValue
    ) {
      isSuccess
      message
    }
  }
`;

const CREATE_USER_TOKEN = gql`
  mutation createUserToken($secretValue: String!) {
    createUserToken(secretValue: $secretValue)
  }
`;

export default withTheme(({ theme, navigation }) => {
  //state
  const [bioCheckPossible, setBioCheckPossible] = useState(null); //???????????? ?????? ?????? (null : ??????, false : 2??????????????? input, true : ????????????)
  const [bioCheck, setBioCheck] = useState(null); //???????????? ?????? ??????
  const [modalVisible, setModalVisible] = useState(false); //Modal ????????? ?????? ??????
  const [PINnumValue, setPINnumValue] = useState(null); //PINcode ??? ???????????? (PIN ?????? ????????? ??????)
  const [transferData] = useState(navigation.getParam('transferData'));
  const [clipboardText, setClipboardText] = useState('????????????');

  //recoil
  const [
    { useAuthenticationPossible, alreadyAuthenticatie },
    setRecoilBasicState,
  ] = useRecoilState(basicState);
  const [{ dailyFreeTransferCount }, setRecoilMyInfoState] = useRecoilState(
    myInfoState,
  );

  //recoil getter
  const { bank, creditNumber } = useRecoilValue(companyState);

  //recoil setter
  const setRecoilLogUserIn = useSetRecoilState(isLoggedIn);

  //recoil setter func
  const createWalletComplete = async () => {
    console.log('createWalletComplete excute');
    await AsyncStorage.setItem('walletExist', 'true');
    return setRecoilBasicState((prev) => ({ ...prev, walletExist: true }));
  };
  const login = async (token) => {
    console.log('login excute');
    await AsyncStorage.setItem('isLoggedIn', 'true'); //???AsyncStorage??? string??? ???????????????
    await AsyncStorage.setItem('jwt', token);
    return setRecoilLogUserIn(true);
  };
  const changeAuthTypeFunc = async (authType) => {
    console.log({ authType });
    if (authType) {
      await AsyncStorage.setItem('authType', 'bio');
      return setRecoilBasicState((prev) => ({ ...prev, authType: 'bio' }));
    } else {
      await AsyncStorage.setItem('authType', 'pin');
      return setRecoilBasicState((prev) => ({ ...prev, authType: 'pin' }));
    }
  };
  const decreaseDailyFreeTransferCount = () => {
    if (dailyFreeTransferCount > 0) {
      return setRecoilMyInfoState((prev) => ({
        ...prev,
        dailyFreeTransferCount: dailyFreeTransferCount - 1,
      }));
    } else {
      return false;
    }
  };

  //router
  let routeName = navigation.getParam('routeName');
  let coinValue = '';
  let jsonData = '';
  let exchangeData = null;
  let prevAuthType = null;
  let exchangeId = '';

  if (routeName === 'coinPurchase') {
    coinValue = navigation.getParam('coinValue');
  } else if (routeName === 'coinExchange') {
    exchangeData = navigation.getParam('exchangeData');
  } else if (routeName === 'WalletNavigation') {
    jsonData = navigation.getParam('jsonData');
  } else if (routeName === 'ResetPIN') {
    prevAuthType = navigation.getParam('prevAuthType');
  } else if (routeName === 'fastExchange') {
    exchangeId = navigation.getParam('exchangeId');
  } else if (routeName === 'cancelExchange') {
    exchangeId = navigation.getParam('exchangeId');
  }

  //mutation
  const [transferMutation] = useMutation(TRANSFER);
  const [createPurchaseMutation] = useMutation(CREATE_PURCHASE);
  const [createExchangeMutation] = useMutation(CREATE_EXCHANGE);
  const [createUserMutation] = useMutation(CREATE_USER);
  const [createUserTokenMutation] = useMutation(CREATE_USER_TOKEN);
  const [changeFastExchangeMutation] = useMutation(CHANGE_FAST_EXCHANGE);
  const [requestCancelExchangeMutation] = useMutation(REQUEST_CANCEL_EXCHANGE);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    getAsyncStorage();
    bioMetricStart();
    BackHandler.addEventListener('hardwareBackPress', justBackButtonHandler);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        justBackButtonHandler,
      );
    };
  }, []);

  const _createPurchaseAsync = async () => {
    try {
      const {
        data: { createPurchase },
      } = await createPurchaseMutation({
        variables: {
          requestAmount: coinValue,
        },
      });
      _purchaseMutationReturnFunc(createPurchase);
    } catch (error) {
      Toast.show(
        '????????? ????????? ???????????? ????????????.\n?????? ??? ?????? ????????? ?????????1',
        { position: 0 },
      );
    }
  };

  //getAsyncStorage??? bioMetricStart??? ???????????????
  const getAsyncStorage = async () => {
    const PINnumValue = await SecureStorage.getItem('PINcode');
    setPINnumValue(PINnumValue);
  };

  const bioMetricStart = async () => {
    const authType = await AsyncStorage.getItem('authType');
    console.log(useAuthenticationPossible, alreadyAuthenticatie, authType);
    if (useAuthenticationPossible) {
      switch (alreadyAuthenticatie) {
        case 'BiometryIsAvailable':
          if (authType === 'bio') {
            setBioCheckPossible(true);
            bioMetric();
          } else {
            setBioCheckPossible(false);
          }
          break;
        case 'BiometryLockout':
        case 'BiometryTemporaryLockout':
          setBioCheckPossible(false);
          if (authType == 'bio') {
            Toast.show('??????????????? ?????????????????????\nPIN??? ????????? ?????????', {
              position: 0,
            });
          }
          break;
        default:
          setBioCheckPossible(false);
          if (
            authType === 'bio' &&
            routeName !== 'ResetPIN' &&
            routeName !== 'WalletNavigation'
          ) {
            Toast.show('????????? ????????? ???????????? \n PIN??? ????????? ?????????', {
              position: 0,
            });
          }
      }
    } else {
      setBioCheckPossible(false);
    }
  };

  useEffect(() => {
    if (bioCheck === true) {
      if (routeName === 'Transfer') {
        _transferMutationAsync();
      } else if (routeName === 'coinPurchase') {
        _createPurchaseAsync();
      } else if (routeName === 'coinExchange') {
        _createExchangeAsync();
      } else if (routeName === 'fastExchange') {
        _fastExchangeAsync();
      } else if (routeName === 'cancelExchange') {
        _cancelExchangeAsync();
      } else {
        bioCheckDone();
      }
    } else if (bioCheck === 'reset') {
      bioMetric();
    }
  }, [bioCheck]);

  const bioMetric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        reason: '???????????? ???????????? ?????? ??????????????? ????????????',
        cancelTitle: 'PIN?????? ??????',
      });
      console.log(result);
      if (result.success) {
        Vibration.vibrate(200);
        setBioCheck(true);
      } else if (!result.success) {
        switch (result.error) {
          case 'BiometryLockout':
          case 'BiometryTemporaryLockout':
            Alert.alert(
              '?????? ?????? ????????????',
              'PIN?????? ?????? ???????????????.\n????????? ???????????? ????????? ??????????????????',
              [
                {
                  text: '??????',
                  onPress: () => null,
                  style: 'cancel',
                },
              ],
              { cancelable: false },
            );
            changeAuthTypeFunc('bio');
            setBioCheckPossible(false);
            break;
          case 'AppCancel':
          case 'UserCancel':
            Toast.show('??????????????? ?????????????????????\nPIN??? ??????????????????', {
              position: 0,
            });
            changeAuthTypeFunc('bio');
            setBioCheckPossible(false);
            break;
          case 'SystemCancel':
            Toast.show('???????????? ???????????????\nPIN??? ??????????????????', {
              position: 0,
            });
            // changeAuthTypeFunc('bio');
            setBioCheckPossible(false);
            break;
          case 'AuthenticationFailed':
          default:
            Vibration.vibrate(200);
            Toast.show('?????? ??????????????????', {
              position: 0,
            });
            setTimeout(() => {
              setBioCheck('reset');
            }, 500);
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _createExchangeAsync = async () => {
    try {
      const {
        data: { createExchange },
      } = await createExchangeMutation({
        variables: exchangeData,
      });
      _exchangeMutationReturnFunc(createExchange);
    } catch (error) {
      Toast.show(
        '????????? ????????? ???????????? ????????????.\n?????? ??? ?????? ????????? ?????????1',
        { position: 0 },
      );
    }
  };

  const _fastExchangeAsync = async () => {
    try {
      const {
        data: { changeFastExchange },
      } = await changeFastExchangeMutation({
        variables: {
          id: exchangeId,
        },
      });
      if (changeFastExchange) {
        setTimeout(() => {
          setModalVisible(!modalVisible);
        }, 100);
      } else {
        Toast.show('?????? ?????? ????????? ??????????????????', { position: 0 });
        navigation.goBack();
      }
    } catch (error) {
      Toast.show(
        '????????? ????????? ???????????? ????????????.\n?????? ??? ?????? ????????? ?????????1',
        { position: 0 },
      );
    }
  };

  const _cancelExchangeAsync = async () => {
    try {
      const {
        data: {
          requestCancelExchange: { isSuccess, message },
        },
      } = await requestCancelExchangeMutation({
        variables: {
          id: exchangeId,
        },
      });
      console.log({ isSuccess }, { message });
      if (isSuccess) {
        setTimeout(() => {
          setModalVisible(!modalVisible);
        }, 100);
      } else {
        Toast.show(`${message}`, { position: 0 });
        navigation.goBack();
      }
    } catch (error) {
      Toast.show(
        '????????? ????????? ???????????? ????????????.\n?????? ??? ?????? ????????? ?????????1',
        { position: 0 },
      );
    }
  };

  const pinCreate = async (inputtedPin, clear) => {
    const PINnumValue = await SecureStorage.getItem('PINcode');

    if (routeName !== 'ResetPIN') {
      Toast.show('????????? PIN????????? ?????? ??? ??????????????????', { position: 0 });
      await SecureStorage.setItem('PINcode', inputtedPin);
      const newPINnumValue = await SecureStorage.getItem('PINcode');
      setPINnumValue(inputtedPin);
      clear();
    } else if (PINnumValue === inputtedPin) {
      Toast.show('?????? PIN??? ???????????????.\n????????? PIN??? ??????????????????', {
        position: 0,
      });
      clear();
      return false;
    } else {
      await SecureStorage.setItem('PINcode', inputtedPin);
      clear();
      Toast.show('PIN????????? ?????????????????????', { position: 0 });
      if (prevAuthType === 'bio') {
        changeAuthTypeFunc('pin');
      }
      stackResetFunc();
    }
  };

  const pinComplete = async (inputtedPin, clear) => {
    if (inputtedPin !== PINnumValue) {
      Vibration.vibrate(200);
      Toast.show('????????? PIN??? ???????????? ????????????', { position: 0 });
      clear();
    } else {
      if (
        routeName === 'Transfer' ||
        routeName === 'coinPurchase' ||
        routeName === 'coinExchange' ||
        routeName === 'fastExchange'
      ) {
        setBioCheck(true);
      } else if (routeName === 'ResetPIN') {
        clear();
        setPINnumValue(null);
        Toast.show('????????? PIN??? ??????????????????', { position: 0 });
      } else if (routeName === 'WalletNavigation') {
        try {
          let mnemonicEncrypt = '';

          const {
            nickName,
            mnemonicValue,
            privateKey,
            walletData,
            type,
          } = JSON.parse(jsonData); //????????? ??????????????? ????????? ????????? ?????????

          if (type === 'mnemonic') {
            mnemonicEncrypt = await rsaEncrytion(mnemonicValue);
          }
          //if else => privateKey??? ????????? ?????????
          const privateKeyEncrypt = await rsaEncrytion(privateKey);
          const {
            data: {
              createUser: { isSuccess, message },
            },
          } = await createUserMutation({
            variables: {
              nickName: nickName === undefined ? '' : nickName,
              address: walletData.address,
              type,
              secretValue:
                type === 'mnemonic' ? mnemonicEncrypt : privateKeyEncrypt,
            },
          });

          if (isSuccess) {
            const {
              data: { createUserToken },
            } = await createUserTokenMutation({
              variables: {
                secretValue: privateKeyEncrypt,
              },
            });
            if (
              createUserToken !== undefined &&
              createUserToken !== '' &&
              createUserToken !== 'false' &&
              createUserToken !== false
            ) {
              await storeData(walletData, privateKey, mnemonicValue);
              // login(createUserToken);
              setUserToken(createUserToken);
              return setTimeout(() => {
                setModalVisible(!modalVisible);
              }, 50);
            }
          } else {
            Vibration.vibrate(200);
            Toast.show(message, { position: 0 });
            await clear();
            return navigation.goBack();
          }
        } catch (error) {
          Vibration.vibrate(200);
          Toast.show(
            '????????? ????????? ???????????? ????????????.\n?????? ??? ?????? ????????? ?????????',
            { position: 0 },
          );
          return clear();
        }
      } else {
        Vibration.vibrate(200);
        setBioCheck(true);
        return clear();
      }
    }
  };

  const fingerPrint = async (type) => {
    if (type === 'bioSelect') {
      //AuthType context??? ???????????? setItem?????? ????????? ??????
      changeAuthTypeFunc('pin');
    }
    Toast.show('?????? ????????? ?????????????????????', { position: 0 });
    createWalletComplete();
    login(userToken);
  };

  const justBackButtonHandler = () => {
    console.log({ prevAuthType }, { routeName });
    if (routeName === 'ResetPIN') {
      if (prevAuthType === 'bio') {
        changeAuthTypeFunc('pin');
      }
    }
    setTimeout(() => {
      if (Platform.OS !== 'ios') {
        LocalAuthentication.release();
      }
    }, 50);
  };

  const _transferMutationAsync = async () => {
    try {
      const {
        data: { transfer },
      } = await transferMutation({
        variables: transferData,
      });
      _transferMutationReturnFunc(transfer);
    } catch (error) {
      Vibration.vibrate(200);
      Toast.show(
        '????????? ????????? ???????????? ????????????.\n?????? ??? ?????? ????????? ?????????3',
        { position: 0 },
      );
    }
  };

  const _exchangeMutationReturnFunc = (result) => {
    if (result === 'true') {
      setTimeout(() => {
        setModalVisible(!modalVisible);
      }, 100);
    } else if (result === 'noAuthenticatedUser') {
      Vibration.vibrate(200);
      Toast.show('????????? ???????????? ??????????????? ???????????? ?????????.', {
        position: 0,
      });
      setTimeout(() => {
        navigation.dispatch(StackActions.popToTop());
      }, 300);
    } else if (result === 'valueError') {
      Vibration.vibrate(200);
      Toast.show('?????? ?????? ?????? 10,000KRWG', {
        position: 0,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } else {
      Vibration.vibrate(200);
      Toast.show('?????? ????????? ??????????????????', { position: 0 });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    }
  };

  const _purchaseMutationReturnFunc = (result) => {
    if (result === 'true') {
      setTimeout(() => {
        setModalVisible(!modalVisible);
      }, 100);
    } else if (result === 'noAuthenticatedUser') {
      Vibration.vibrate(200);
      Toast.show('????????? ???????????? ??????????????? ???????????? ?????????.', {
        position: 0,
      });
      setTimeout(() => {
        navigation.dispatch(StackActions.popToTop());
      }, 300);
    } else if (result === 'impossibleService') {
      Vibration.vibrate(200);
      Toast.show('????????? ?????? ???????????? ?????? ?????? ????????? ??? ??? ????????????', {
        position: 0,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } else if (result === 'valueError') {
      Vibration.vibrate(200);
      Toast.show('?????? ?????? ?????? 10,000KRWG', {
        position: 0,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } else if (result === 'maximumValueOver') {
      Vibration.vibrate(200);
      Toast.show('?????? ???????????? 20??? ????????? ??????????????????', {
        position: 0,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } else {
      Vibration.vibrate(200);
      Toast.show('?????? ????????? ??????????????????', { position: 0 });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    }
  };

  const _transferMutationReturnFunc = (result) => {
    if (result === 'oneselfReceiver') {
      Vibration.vibrate(200);
      Toast.show('?????? ??????????????? ????????? ??? ????????????\n?????? ??????????????????', {
        position: 0,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } else if (result === 'noAuthenticatedUser') {
      Vibration.vibrate(200);
      Toast.show('????????? ???????????? ??????????????? ???????????? ?????????.', {
        position: 0,
      });
      setTimeout(() => {
        navigation.dispatch(StackActions.popToTop());
      }, 300);
    } else if (result === 'true') {
      decreaseDailyFreeTransferCount();
      setTimeout(() => {
        setModalVisible(!modalVisible);
      }, 100);
    } else if (result === 'valueError') {
      Vibration.vibrate(200);
      Toast.show('?????? ????????? 10,000KRWG', {
        position: 0,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } else if (result === 'balanceLack') {
      Vibration.vibrate(200);
      Toast.show('???????????? ?????? KRWG??? ?????????????????????', {
        position: 0,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } else if (result === 'balanceLackCharge') {
      Vibration.vibrate(200);
      Toast.show('?????????+???????????? ?????? KRWG??? ?????????????????????', {
        position: 0,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } else if (result === 'pointImpossibleAddress') {
      Vibration.vibrate(200);
      Toast.show('????????? ???????????? ?????? ????????? KRWG????????? ???????????????', {
        position: 0,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } else {
      Vibration.vibrate(200);
      Toast.show('??????????????????', { position: 0 });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    }
  };

  const bioCheckDone = async () => {
    stackResetFunc();
  };

  const stackResetFunc = () => {
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({
    //       routeName: 'TabNavigation',
    //       action: NavigationActions.navigate({
    //         routeName: 'Home',
    //       }),
    //     }),
    //   ],
    // });
    if (modalVisible) {
      setModalVisible(false);
    }
    setTimeout(() => {
      navigation.dispatch(StackActions.popToTop());
    }, 100);
  };

  const renderSection = () => {
    if (routeName !== 'ResetPIN') {
      if (PINnumValue === null || PINnumValue === '') {
        return (
          <BioMetricBGColor>
            <PINWarpper>
              <Text>PIN ?????? ??????</Text>
              <PinView
                buttonBgColor="rgba(255,255,255,0.1)"
                buttonTextColor="white"
                inputBgColor="white"
                inputActiveBgColor="white"
                onComplete={pinCreate}
                pinLength={6}
                // keyboardViewStyle={{ width: 65, height: 65 }}
                // keyboardViewStyle={{ width: 50, height: 50 }}  ????????? ????????? ?????? ?????????
              />
            </PINWarpper>
          </BioMetricBGColor>
        );
      } else {
        return (
          <BioMetricBGColor>
            <PINWarpper>
              <Text>PIN ?????? ??????</Text>
              <PinView
                buttonBgColor="rgba(255,255,255,0.1)"
                buttonTextColor="white"
                inputBgColor="white"
                inputActiveBgColor="white"
                onComplete={pinComplete}
                pinLength={6}
                // keyboardViewStyle={{ width: 65, height: 65 }}
              />
            </PINWarpper>
          </BioMetricBGColor>
        );
      }
    } else {
      if (PINnumValue === null || PINnumValue === '') {
        return (
          <BioMetricBGColor>
            <PINWarpper>
              <Text>PIN ?????? ?????????</Text>
              <PinView
                buttonBgColor="rgba(255,255,255,0.1)"
                buttonTextColor="white"
                inputBgColor="white"
                inputActiveBgColor="white"
                onComplete={pinCreate}
                pinLength={6}
                // keyboardViewStyle={{ width: 65, height: 65 }}
              />
            </PINWarpper>
          </BioMetricBGColor>
        );
      } else {
        return (
          <BioMetricBGColor>
            <PINWarpper>
              <Text>?????? PIN?????? ??????</Text>
              <PinView
                buttonBgColor="rgba(255,255,255,0.1)"
                buttonTextColor="white"
                inputBgColor="white"
                inputActiveBgColor="white"
                onComplete={pinComplete}
                pinLength={6}
                // keyboardViewStyle={{ width: 65, height: 65 }}
              />
            </PINWarpper>
          </BioMetricBGColor>
        );
      }
    }
  };

  const renderModal = () => {
    if (routeName === 'Transfer') {
      return (
        <Modal isVisible={modalVisible}>
          <ModalWarpper>
            <ModalView style={{ height: 230 }}>
              <ModalImage
                style={{ resizeMode: 'contain', height: '20%', marginTop: 20 }}
                source={require('../../assets/front/pop_up_purchase_complete_icon.png')}
              />

              <ModalTextContainer height={'70px'} marginTop={'10px'}>
                <ModalTextHeader
                  marginTop={15}
                >{`KRWG ?????? ?????? ??????`}</ModalTextHeader>

                <ModalText>
                  {`KRWG ?????? ????????? ?????????????????????\n?????? 1??? ~ ?????? 1??? ???\n??????????????? ???????????????`}
                </ModalText>
              </ModalTextContainer>
              <ModalButtonContainer>
                <ModalTouchable onPress={() => bioCheckDone()}>
                  <RadiusLeftRight>
                    <MainBGColor
                      style={{
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    >
                      <ModalContainer>
                        <ButtonText>??????</ButtonText>
                      </ModalContainer>
                    </MainBGColor>
                  </RadiusLeftRight>
                </ModalTouchable>
              </ModalButtonContainer>
            </ModalView>
          </ModalWarpper>
        </Modal>
      );
    } else if (routeName === 'coinPurchase') {
      return (
        <Modal isVisible={modalVisible}>
          <ModalWarpper>
            <ModalView style={{ height: 260 }}>
              <ModalImage
                style={{
                  resizeMode: 'contain',
                  height: '20%',
                  marginTop: 15,
                }}
                source={require('../../assets/front/pop_up_purchase_complete_icon.png')}
              />

              <ModalTextContainer
                marginTop={'10px'}
                style={{
                  height: 110,
                }}
              >
                <ModalText
                  style={{
                    lineHeight: 15,
                    fontSize: 14,
                  }}
                >{`(???)????????????\n[${bank}]${creditNumber}\n${setComma(
                  coinValue,
                )}??? ??????????????????`}</ModalText>
                <ModalText
                  style={{
                    lineHeight: 12,
                    fontSize: 12,
                    color: 'red',
                  }}
                >{`?????? ??? "????????????"??? ?????? "?????????"??? ??????????????????\n(???????????? = ?????????)\n?????? ??? ????????? ?????? ??? ????????? ?????? ???????????????\n1:1 ?????? ????????? ????????? ??????????????????`}</ModalText>
              </ModalTextContainer>
              <ModalButtonContainer>
                <ModalTouchable
                  onPress={() => {
                    Clipboard.setString(creditNumber.replace(/-/g, ''));
                    setClipboardText('????????????');
                  }}
                >
                  <RadiusRight>
                    <ModalContainer>
                      <CancelButtonText textColor={clipboardText}>
                        {clipboardText}
                      </CancelButtonText>
                    </ModalContainer>
                  </RadiusRight>
                </ModalTouchable>
                <ModalTouchable onPress={() => bioCheckDone()}>
                  <RadiusRight>
                    <MainBGColor
                      style={{
                        borderBottomRightRadius: 10,
                      }}
                    >
                      <ModalContainer>
                        <ButtonText>??????</ButtonText>
                      </ModalContainer>
                    </MainBGColor>
                  </RadiusRight>
                </ModalTouchable>
              </ModalButtonContainer>
            </ModalView>
          </ModalWarpper>
        </Modal>
      );
    } else if (routeName === 'coinExchange') {
      return (
        <Modal isVisible={modalVisible}>
          <ModalWarpper>
            <ModalView style={{ height: 220 }}>
              <ModalImage
                style={{ resizeMode: 'contain', height: '20%', marginTop: 10 }}
                source={require('../../assets/front/pop_up_currency_exchange_icon.png')}
              />
              <ModalTextContainer style={{ height: 80 }}>
                <ModalTextHeader>{`?????? ??????`}</ModalTextHeader>
                <ModalText>{`KRWG ????????? ??????????????????\n?????? ?????? ??? ?????? ????????? ???????????????`}</ModalText>
              </ModalTextContainer>
              <ModalButtonContainer>
                <ModalTouchable onPress={() => bioCheckDone()}>
                  <RadiusLeftRight>
                    <MainBGColor
                      style={{
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    >
                      <ModalContainer>
                        <ButtonText>??????</ButtonText>
                      </ModalContainer>
                    </MainBGColor>
                  </RadiusLeftRight>
                </ModalTouchable>
              </ModalButtonContainer>
            </ModalView>
          </ModalWarpper>
        </Modal>
      );
    } else if (routeName === 'fastExchange') {
      return (
        <Modal isVisible={modalVisible}>
          <ModalWarpper>
            <ModalView style={{ height: 220 }}>
              <ModalImage
                style={{ resizeMode: 'contain', height: '20%', marginTop: 10 }}
                source={require('../../assets/front/pop_up_currency_exchange_icon.png')}
              />
              <ModalTextContainer style={{ height: 80 }}>
                <ModalTextHeader>{`?????? ??????`}</ModalTextHeader>
                <ModalText>{`?????? ?????? ?????? ?????????\n?????? ???????????? ??????????????????`}</ModalText>
              </ModalTextContainer>
              <ModalButtonContainer>
                <ModalTouchable onPress={() => bioCheckDone()}>
                  <RadiusLeftRight>
                    <MainBGColor
                      style={{
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    >
                      <ModalContainer>
                        <ButtonText>??????</ButtonText>
                      </ModalContainer>
                    </MainBGColor>
                  </RadiusLeftRight>
                </ModalTouchable>
              </ModalButtonContainer>
            </ModalView>
          </ModalWarpper>
        </Modal>
      );
    } else if (routeName === 'cancelExchange') {
      return (
        <Modal isVisible={modalVisible}>
          <ModalWarpper>
            <ModalView style={{ height: 220 }}>
              <ModalImage
                style={{ resizeMode: 'contain', height: '20%', marginTop: 10 }}
                source={require('../../assets/front/pop_up_currency_exchange_icon.png')}
              />
              <ModalTextContainer style={{ height: 80 }}>
                <ModalTextHeader>{`?????? ??????`}</ModalTextHeader>
                <ModalText>{`?????? ?????? ?????? ??????\n???????????? ?????? ??? KRWG??? ????????????????????????`}</ModalText>
              </ModalTextContainer>
              <ModalButtonContainer>
                <ModalTouchable onPress={() => bioCheckDone()}>
                  <RadiusLeftRight>
                    <MainBGColor
                      style={{
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    >
                      <ModalContainer>
                        <ButtonText>??????</ButtonText>
                      </ModalContainer>
                    </MainBGColor>
                  </RadiusLeftRight>
                </ModalTouchable>
              </ModalButtonContainer>
            </ModalView>
          </ModalWarpper>
        </Modal>
      );
    } else if (routeName === 'WalletNavigation') {
      //???????????? ?????? ?????? ??????
      return (
        <Modal isVisible={modalVisible}>
          <ModalWarpper>
            <ModalView style={{ height: 220 }}>
              <ModalImage
                style={{
                  resizeMode: 'contain',
                  height: '30%',
                  marginTop: 20,
                }}
                source={require('../../assets/front/popup_3.png')}
              />
              {useAuthenticationPossible &&
              alreadyAuthenticatie === 'BiometryIsAvailable' ? (
                <ModalTextContainer style={{ height: 70 }}>
                  <ModalText>{`??????????????? ???????????????\n??????????????? ?????????????????????????`}</ModalText>
                </ModalTextContainer>
              ) : (
                <ModalTextContainer style={{ height: 70 }}>
                  <ModalText>{`???????????? ?????? ????????? ???????????????\nPIN?????? ???????????????`}</ModalText>
                </ModalTextContainer>
              )}

              <ModalButtonContainer>
                {useAuthenticationPossible &&
                alreadyAuthenticatie === 'BiometryIsAvailable' ? (
                  <>
                    <ModalTouchable onPress={() => fingerPrint(null)}>
                      <RadiusRight>
                        <ModalContainer>
                          <CancelButtonText>?????????</CancelButtonText>
                        </ModalContainer>
                      </RadiusRight>
                    </ModalTouchable>
                    <ModalTouchable onPress={() => fingerPrint('bioSelect')}>
                      <RadiusRight>
                        <MainBGColor
                          style={{
                            borderBottomRightRadius: 10,
                          }}
                        >
                          <ModalContainer>
                            <ButtonText>??????</ButtonText>
                          </ModalContainer>
                        </MainBGColor>
                      </RadiusRight>
                    </ModalTouchable>
                  </>
                ) : (
                  <>
                    <ModalTouchable onPress={() => fingerPrint(null)}>
                      <RadiusLeftRight>
                        <MainBGColor
                          style={{
                            borderBottomLeftRadius: 10,
                          }}
                        >
                          <ModalContainer>
                            <ButtonText>??????</ButtonText>
                          </ModalContainer>
                        </MainBGColor>
                      </RadiusLeftRight>
                    </ModalTouchable>
                  </>
                )}
              </ModalButtonContainer>
            </ModalView>
          </ModalWarpper>
        </Modal>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      {/* SafeAreaView ????????????  */}
      <Wrapper>
        {renderModal()}
        {bioCheckPossible === null ? ( //  ???????????? ???????????? ??????
          <>
            <IndicatorWrapper>
              <Touchable disabled={false}>
                <ActivityIndicator
                  size={'large'}
                  color={theme.activityIndicatorColor}
                />
              </Touchable>
            </IndicatorWrapper>
          </>
        ) : !bioCheckPossible ? ( //  ???????????? ?????? (PIN??????)
          <View
            style={{
              flex: 1,
              backgroundColor: '#f1f1f1',
              justifyContent: 'center',
            }}
          >
            {renderSection()}
          </View>
        ) : (
          //???????????? ????????????
          <>
            <FingerPrintView>
              <BioMetricComponent
                setBioCheckPossible={setBioCheckPossible}
                text={
                  bioCheck
                    ? `???????????? ????????? ??????`
                    : `?????? ?????? ?????????\n????????? ???????????? ???????????????`
                }
                type={false}
              />
            </FingerPrintView>
          </>
        )}
      </Wrapper>
    </>
  );
});
