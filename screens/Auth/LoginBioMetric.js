import React, { useState, useEffect } from 'react';
import styled, { withTheme } from 'styled-components';
import LocalAuthentication from 'rn-local-authentication';
import { ActivityIndicator, Vibration, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BioMetricComponent from '../../components/BioMetricComponent';
import constants from '../../constants';
import PinView from 'react-native-pin-view';
import SecureStorage from 'react-native-secure-storage';
import Toast from 'react-native-tiny-toast';
import { isLoggedIn, basicState } from '../../recoil/recoilAtoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import { StackActions } from 'react-navigation';
import { rsaEncrytion } from '../../enDec';

const PINWarpper = styled.View`
  width: ${constants.width};
  height: ${Platform.OS === `ios`
    ? constants.height * 1.0
    : constants.height * 1.0};
  margin-top: 50px;
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

const BioMetricBGColor = styled.View`
  background-color: ${(props) => props.theme.bioMetricColor};
`;

const CREATE_USER_TOKEN = gql`
  mutation createUserToken($secretValue: String!) {
    createUserToken(secretValue: $secretValue)
  }
`;

const LoginBioMetric = ({ theme, navigation }) => {
  //state
  const [bioCheckPossible, setBioCheckPossible] = useState(null); //생체인증 가능 여부 (null : 로딩, false : 2차비밀번호 input, true : 지문인식)
  const [bioCheck, setBioCheck] = useState(null); //생체인증 성공 여부
  const [PINnumValue, setPINnumValue] = useState(null); //PINcode 값 가져오기 (PIN 존재 여부도 확인)

  //mutation
  const [createUserTokenMutation] = useMutation(CREATE_USER_TOKEN);

  //recoil
  const [
    { useAuthenticationPossible, alreadyAuthenticatie },
    setRecoilBasicState,
  ] = useRecoilState(basicState);

  //recoil setter
  const setUserLogged = useSetRecoilState(isLoggedIn);
  //recoil setter func
  const login = async (token) => {
    await AsyncStorage.setItem('isLoggedIn', 'true'); //※AsyncStorage는 string만 보내지는듯
    await AsyncStorage.setItem('jwt', token);
    return setUserLogged(true);
  };
  const changeAuthTypeFunc = async (authType) => {
    if (authType) {
      await AsyncStorage.setItem('authType', 'bio');
      return setRecoilBasicState((prev) => ({ ...prev, authType: 'bio' }));
    } else {
      await AsyncStorage.setItem('authType', 'pin');
      return setRecoilBasicState((prev) => ({ ...prev, authType: 'pin' }));
    }
  };

  const setLogUserOutFunc = async () => {
    AsyncStorage.setItem('isLoggedIn', 'false');
    AsyncStorage.removeItem('jwt');
    AsyncStorage.removeItem('walletExist');
    setRecoilBasicState((prev) => ({ ...prev, walletExist: false }));
    setUserLogged(false);
    return navigation.dispatch(StackActions.popToTop());
  };

  useEffect(() => {
    getAsyncStorage();
    bioMetricStart();
  }, []);

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
            // 지문인식 Off
            setBioCheckPossible(false);
          }
          break;
        case 'BiometryLockout':
        case 'BiometryTemporaryLockout':
          setBioCheckPossible(false);
          if (authType == 'bio') {
            Toast.show('지문인식이 잠금상태입니다\nPIN을 입력해 주세요', {
              position: 0,
            });
          }
          break;
        default:
          setBioCheckPossible(false);
          if (authType == 'bio') {
            Toast.show('저장된 지문이 없습니다 \n PIN을 입력해 주세요', {
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
      bioCheckDone();
    } else if (bioCheck === 'reset') {
      bioMetric();
    }
  }, [bioCheck]);

  const bioMetric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        reason: '다음으로 진행하기 위해 본인인증을 해주세요',
        cancelTitle: 'PIN으로 인증',
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
              '지문 인식 반복실패',
              'PIN으로 자동 전환됩니다.\n핸드폰 설정에서 잠금을 해제해주세요',
              [
                {
                  text: '확인',
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
            Toast.show('지문인식을 취소하셨습니다\nPIN을 입력해주세요', {
              position: 0,
            });
            changeAuthTypeFunc('bio');
            setBioCheckPossible(false);
            break;
          case 'SystemCancel':
            Toast.show('지문인식 오류입니다\nPIN을 입력해주세요', {
              position: 0,
            });
            // changeAuthTypeFunc('bio');
            setBioCheckPossible(false);
            break;
          case 'AuthenticationFailed':
          default:
            Vibration.vibrate(200);
            Toast.show('다시 시도해주세요', {
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

  const pinComplete = async (inputtedPin, clear) => {
    if (inputtedPin !== PINnumValue) {
      Vibration.vibrate(200);
      Toast.show('저장된 PIN과 일치하지 않습니다', { position: 0 });
      clear();
    } else {
      Vibration.vibrate(200);
      bioCheckDone(clear);
    }
  };

  const bioCheckDone = async (clear) => {
    try {
      //userId => privateKey로 변경
      const secureDataString = await SecureStorage.getItem('secureData');
      const { privateKey } = await JSON.parse(secureDataString);
      const secretValue = await rsaEncrytion(privateKey);
      const {
        data: { createUserToken },
      } = await createUserTokenMutation({
        variables: {
          secretValue,
        },
      });
      // console.log("createUserToken : ", createUserToken);
      if (
        createUserToken !== undefined &&
        createUserToken !== '' &&
        createUserToken !== 'false' &&
        createUserToken !== false
      ) {
        Toast.show('로그인 성공', { position: 0 });
        setTimeout(() => {
          login(createUserToken);
        }, 50);
      } else {
        // 토큰이 올바르지 않을 경우, isLoggedInVal를 false로 바꾸고 AynscStorage의 userId를 비운다
        Toast.show('로그인 토큰이 유효하지 않습니다.\n지갑을 새로 생성합니다', {
          position: 0,
        });
        return setLogUserOutFunc();
      }
    } catch (error) {
      Toast.show(
        '서버와 통신이 원활하지 않습니다.\n잠시 후 다시 시도해 주세요',
        { position: 0 },
      );
      clear();
    }
  };

  const renderSection = () => {
    return (
      <BioMetricBGColor>
        <PINWarpper>
          <Text>로그인 PIN 번호 입력</Text>
          <PinView
            buttonBgColor="rgba(255,255,255,0.1)"
            buttonTextColor="white"
            inputBgColor="white"
            inputActiveBgColor="white"
            onComplete={pinComplete}
            pinLength={6}
            keyboardViewStyle={{ width: 65, height: 65 }}
          />
        </PINWarpper>
      </BioMetricBGColor>
    );
  };

  return (
    <Wrapper>
      {bioCheckPossible === null ? ( //  지문인식 가능한지 로딩
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
      ) : !bioCheckPossible ? ( //  지문인식 불가 (PIN화면)
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
        //지문인식 성공
        <>
          <FingerPrintView>
            <BioMetricComponent
              text={
                bioCheck
                  ? `지문인식 로그인 성공`
                  : `로그인을 위해\n등록된 손가락을 올려주세요`
              }
            />
          </FingerPrintView>
        </>
      )}
    </Wrapper>
  );
};
export default withTheme(LoginBioMetric);
