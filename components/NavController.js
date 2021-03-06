import React, { useState, useEffect, useRef } from 'react';
import { View, AppState, Alert } from 'react-native';
import MainNavigation from '../navigation/MainNavigation';
import WalletNavigation from '../navigation/WalletNavigation';
import IntroSlider from '../components/AppIntroSlider';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import messaging from '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { getUserBalance } from '../Web3Connecter';
import {
  isLoggedIn,
  basicState,
  someState,
  refreshAndRefetch,
  loadingTransaction,
  userBalance,
} from '../recoil/recoilAtoms';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';

const UPDATE_NOTIFICATION_TOKEN = gql`
  mutation updateNotificationToken($notificationToken: String!) {
    updateNotificationToken(notificationToken: $notificationToken)
  }
`;

const NavController = ({ stateValue }) => {
  //recoil
  const [{ beginning, policy }, setBasicState] = useRecoilState(basicState);
  const [isLoggedInVal, setUserLogged] = useRecoilState(isLoggedIn);
  const [{ refresh }, setRefreshAndRefetch] = useRecoilState(refreshAndRefetch);
  const [userBalanceVal, setUserBalance] = useRecoilState(userBalance);

  //recoil getter
  const { myInfoCheck } = useRecoilValue(someState);

  //recoil setter
  const setTransactionLoading = useSetRecoilState(loadingTransaction);

  const appState = useRef(AppState.currentState);
  const [address, setAddress] = useState(null);
  const [updateNotificationTokenMutation] = useMutation(
    UPDATE_NOTIFICATION_TOKEN,
  );

  const setTransactionLoadingFunc = () => {
    return setTransactionLoading(false);
  };

  const setUserBalanceFunc = (data) => {
    return setUserBalance((prev) => ({
      ...prev,
      KRWG: data.KRWG,
      TRX: data.TRX,
    }));
  };

  const setRefetchFunc = (bool) => {
    return setRefreshAndRefetch((prev) => ({ ...prev, refetch: bool }));
  };

  const setRefreshFunc = (bool) => {
    return setRefreshAndRefetch((prev) => ({ ...prev, refresh: bool }));
  };

  const setLogUserOutFunc = async () => {
    await AsyncStorage.setItem('isLoggedIn', 'false');
    await AsyncStorage.removeItem('jwt');
    setUserLogged(false);
  };

  const _notificationCheck = async () => {
    const hasPermission = await messaging().hasPermission();
    // ??????????????? ?????? ????????? ????????????
    if (hasPermission) {
      const token = await messaging().getToken();
      _updateTokenFunc(token);
    } else {
      return false;
    }
  };

  const _updateTokenFunc = async (token) => {
    await updateNotificationTokenMutation({
      variables: {
        notificationToken: token,
      },
    });
  };

  useEffect(() => {
    setBasicState(stateValue);
  }, []);

  useEffect(() => {
    if (isLoggedInVal) {
      console.log('user Login!');
      _notificationCheck();
      _getAsyncStorage();
      registerNotificationEvents().registerNotificationReceivedForeground();
      registerNotificationEvents().registerNotificationOpened();
      registerNotificationEvents().registerNotificationReceivedBackground();
      AppState.addEventListener('change', _handleAppStateChange);
    }

    return () => {
      console.log('navController unmounted');
      registerNotificationEvents()
        .registerNotificationReceivedForeground()
        .remove();
      registerNotificationEvents().registerNotificationOpened().remove();
      registerNotificationEvents()
        .registerNotificationReceivedBackground()
        .remove();
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [isLoggedInVal]);

  useEffect(() => {
    if (refresh) {
      _getUserBalanceFunc();
      setTimeout(() => {
        setRefreshFunc(false);
      }, 300);
    }
  }, [refresh]);

  const _getAsyncStorage = async () => {
    const walletStr = await AsyncStorage.getItem('WALLETS');
    if (walletStr) {
      const { address } = JSON.parse(walletStr);
      setAddress(address);
      _getUserBalanceFunc(address);
    }
  };

  const _getUserBalanceFunc = async (addressParam) => {
    try {
      if (addressParam) {
        if (!addressParam) throw Error('address === null');
        const result = await getUserBalance(addressParam);
        if (result != userBalanceVal) {
          setUserBalanceFunc(result);
          //????????? ?????? in??? ????????? ?????? ??????, loadingTransaction??? false??? ????????????
          setTimeout(() => {
            setTransactionLoadingFunc();
          }, 50);
        }
      } else {
        if (!address) throw Error('address === null');
        const result = await getUserBalance(address);
        if (result != userBalanceVal) {
          setUserBalanceFunc(result);
          //????????? ?????? in??? ????????? ?????? ??????, loadingTransaction??? false??? ????????????
          setTimeout(() => {
            setTransactionLoadingFunc();
          }, 50);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const registerNotificationEvents = () => {
    const registerNotificationReceivedForeground = () => {
      return Notifications.events().registerNotificationReceivedForeground(
        (_, completion) => {
          setRefreshFunc(true);
          completion();
        },
      );
    };

    const registerNotificationOpened = () => {
      return Notifications.events().registerNotificationOpened(
        (_, completion) => {
          setRefreshFunc(true);
          completion();
        },
      );
    };

    const registerNotificationReceivedBackground = () => {
      return Notifications.events().registerNotificationReceivedBackground(
        (_, completion) => {
          completion();
        },
      );
    };

    return {
      registerNotificationReceivedForeground,
      registerNotificationOpened,
      registerNotificationReceivedBackground,
    };
  };

  const _handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      setTimeout(() => {
        setRefetchFunc(true);
      }, 300);
      const backGroundTime = await AsyncStorage.getItem('timeStamp');
      // console.log('backGroundTime : ', {backGroundTime});
      if (backGroundTime) {
        const now = moment();
        const backGroundTimeObj = moment(backGroundTime);
        const diff = parseInt(
          moment.duration(now.diff(backGroundTimeObj)).asMinutes(),
        );
        if (diff >= 10) {
          Alert.alert(
            '??????',
            '????????? ?????? ???????????? ?????? ???????????? ???????????? ???????????????.',
            [
              {
                text: '??????',
                onPress: async () => {
                  await AsyncStorage.removeItem('timeStamp');
                  return setLogUserOutFunc();
                },
                style: 'cancel',
              },
            ],
            { cancelable: false },
          );
        } else {
          await AsyncStorage.removeItem('timeStamp');
          return false;
        }
      } else {
        // console.log('backGroundTime is null ', {backGroundTime});
      }
      // active time - background Time = 5m ????????????, context API??? ?????? ??????????????? ???????????? alert??? ????????????
    } else if (
      appState.current.match(/active/) &&
      nextAppState === 'background'
    ) {
      const now = moment().format();
      await AsyncStorage.setItem('timeStamp', now);
    }
    appState.current = nextAppState;
  };

  return (
    <View style={{ flex: 1 }}>
      {!beginning ? ( //??? ????????? ???????????? ????????????
        <IntroSlider />
      ) : isLoggedInVal ? (
        //???myInfoCheck : ?????? ????????? ?????? ??? ??????????????? ??????????????? ?????? (recoil)
        <MainNavigation myInfoCheck={myInfoCheck} />
      ) : (
        <WalletNavigation policy={policy} />
      )}
    </View>
  );
};
export default NavController;
