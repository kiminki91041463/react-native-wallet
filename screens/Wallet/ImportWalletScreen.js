import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Vibration,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ethers } from 'ethers';
import styled, { withTheme } from 'styled-components';
import constants from '../../constants';
import Toast from 'react-native-tiny-toast';
import { ScrollView } from 'react-native';
import globalStyles from '../../styles';
import SecureStorage from 'react-native-secure-storage';
import Modal from 'react-native-modal';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import { hexAddressToBase58, isAddressFunc } from '../../Web3Connecter';
import { Header } from 'react-navigation-stack';
import Clipboard from '@react-native-community/clipboard';

const Mnemonicstyle = StyleSheet.create({
  activeInput: {
    borderWidth: 1,
    borderColor: '#105943',
  },
  inActiveInput: {
    borderWidth: 1,
    borderColor: '#BBB',
  },
});

const styles = StyleSheet.create({
  absoluteActive: {
    width: constants.width * 0.4,
    left: 40,
    position: 'absolute',
    zIndex: 9999,
  },
  absoluteInActive: {
    width: constants.width * 0.4,
    right: 40,
    position: 'absolute',
    zIndex: 0,
  },
  absoluteActiveTwo: {
    width: constants.width * 0.4,
    right: 40,
    position: 'absolute',
    zIndex: 9999,
  },
  absoluteInActiveTwo: {
    width: constants.width * 0.4,
    left: 40,
    position: 'absolute',
    zIndex: 0,
  },
});

const MnemonicWrapperColumn = styled.View`
  flex: 1;
  flex-direction: column;
`;

const MnemonicWrapperRow = styled.View`
  height: 15%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const MnemonicBox = styled.View`
  justify-content: center;
  flex: 1;
  height: 80%;
  margin: 5px;
  padding: 5px 2px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.subColor};
  border-width: 1px;
`;

const MnemonicTextInput = styled.TextInput`
  color: ${(props) => props.theme.mainColor};
  text-align: center;
  height: 40px;
`;

const WrapperView = styled.View`
  width: ${constants.width * 0.95};
  height: ${constants.height * 0.8};
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 2%;
`;

const TextInputContainer = styled.View`
  width: ${constants.width * 0.95};
  margin-bottom: 5%;
  border: ${(props) => `1px solid ${props.theme.borderBottomColor}`};
  border-radius: 10;
  flex: 1;
  background-color: ${(props) => props.theme.subColor};
`;

const TextInput = styled.TextInput`
  color: ${(props) => props.theme.blackTextColor};
  font-size: 20;
  margin: 5px;
  height: ${constants.height * 0.19};
`;

const VerticalBox = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.width ? props.width : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : 'transparent'};
`;

const SwitchBox = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
  margin-top: 10%;
  margin-bottom: 5%;
`;

const ToggleSwitch = styled.View``;

const SwitchContainer = styled.View`
  border-radius: 100;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  align-items: center;
  justify-content: center;
  height: 45px;
  background-color: ${(props) => props.theme.subColor};
  border: ${(props) => `1px solid ${props.theme.mainColor}`};
  border-left-width: 0;
`;

const SwitchContainerTwo = styled.View`
  border-radius: 100;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  align-items: center;
  justify-content: center;
  height: 45px;
  background-color: ${(props) => props.theme.subColor};
  border: ${(props) => `1px solid ${props.theme.mainColor}`};
  border-right-width: 0;
`;

const Touchable = styled.TouchableOpacity`
  margin-top: 2%;
`;

const Text = styled.Text`
  color: ${(props) => (props.color ? props.color : props.theme.blackTextColor)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : 17)};
  /* text-align: center; */
  text-align: ${(props) =>
    props.textAlignVertical ? props.textAlignVertical : 'center'};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)};
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)};
`;

const Image = styled.Image`
  margin: 0 auto;
`;

const ButtonContainer = styled.View`
  height: 55px;
  width: ${constants.width};
  align-items: center;
  justify-content: center;
`;
const ModalView = styled.View`
  /* background-color: white; */
  background-color: ${(props) => props.theme.backGroundColor};
  width: 300;
  height: ${(props) => (props.height ? props.height : 300)};
  align-items: center;
  border-radius: 11px;
`;

const ModalImage = styled.Image`
  margin-top: 10px;
`;

const ModalTextContainer = styled.View`
  /* height: ${constants.height * 0.2}; */
  flex: 1;
  width: 250;
  height: 100;
  justify-content: center;
  margin-bottom: 5;
  margin-top: 10;
`;

const ModalText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: center;
  line-height: 18;
  padding: 10px;
`;

const ModalButtonContainer = styled.View`
  justify-content: flex-end;
  flex-direction: row;
`;

const ModalWarpper = styled.View`
  align-items: center;
  /* border-radius: 10; */
`;

const ModalTouchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-end;
  overflow: hidden;
`;

const ModalContainer = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.borderBottomColor};
`;

const RadiusRight = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
  border-bottom-left-radius: 10;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  text-align: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : 17)};
`;

const BottomContainer = styled.View`
  align-items: flex-end;
  flex-direction: row;
  position: absolute;
  bottom: 0;
`;

const DummyBox = styled.View`
  flex: 1;
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const USER_EXIST_CHECK = gql`
  mutation userExistCheck($address: String!) {
    userExistCheck(address: $address)
  }
`;

const ImportWalletScreen = ({ theme, navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [next, setNext] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [jsonDataState, setJsonDataState] = useState(null);
  const inputRefs = useRef([]);
  const [alreadyUser, setAlreadyUser] = useState(false);
  const [userExistCheckMutation] = useMutation(USER_EXIST_CHECK);
  const [mnemonicValue, setMnemonicValue] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const reg = /^[a-zA-Z\s]+$/;

  useEffect(() => {
    getClipboardFunc();
    const focusListener = navigation.addListener('willFocus', () => {
      setNext(false);
      setButtonActive(false);
    });
    return () => focusListener.remove();
  }, []);

  const getClipboardFunc = async () => {
    try {
      const clipboardText = await Clipboard.getString();
      if (reg.test(clipboardText)) {
        //영어와 띄어쓰기만 가능
        const splitTextArr = clipboardText.split(' ');
        if (splitTextArr.length === 12) {
          //스플릿한 배열이
          Alert.alert(
            '알림',
            '클립보드에 저장된 니모닉 단어를 사용 하시겠습니까?',
            [
              {
                text: '아니요',
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: '자동입력',
                onPress: async () => {
                  const splitTextArr = clipboardText.split(' ');
                  setMnemonicValue(splitTextArr);
                },
              },
            ],
            { cancelable: false },
          );
        }
      }
    } catch (error) {
      console.log('클립보드 데이거 가져오기 실패');
    }
  };

  const getTronWalletChecksum = async (mnemonicValue) => {
    try {
      const wallet = ethers.Wallet.fromMnemonic(mnemonicValue);
      const etherAddress = await wallet.getAddress();
      const address = await hexAddressToBase58(etherAddress);
      if (!isAddressFunc(address)) {
        return {
          isAddress: false,
        };
      } else {
        return {
          isAddress: true,
          address,
          wallet,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        isAddress: false,
      };
    }
  };

  const [columnValue] = useState([0, 3, 6, 9]);
  const [rowValue] = useState([0, 1, 2]);

  const toggleSwitch = async (clickedSwitch) => {
    if (clickedSwitch === 0) {
      setInputValue('');
      setActiveIndex(clickedSwitch);
    } else {
      setInputValue('');
      setActiveIndex(clickedSwitch);
    }
  };

  const eng = /^[a-zA-Z]*$/;

  const changeMnemonicValue = (idx, text) => {
    if (eng.test(text)) {
      setMnemonicValue(
        mnemonicValue.map((_, index) => {
          if (index === idx) {
            return (mnemonicValue[idx] = text);
          } else {
            return mnemonicValue[index];
          }
        }),
      );
    } else {
      Toast.show('영어만 입력 가능합니다', { position: 0 });
      return false;
    }
  };

  const mnemonicValueConcat = async () => {
    let mnemonicString = '';
    try {
      mnemonicValue.forEach((item, idx) => {
        if (idx === mnemonicValue.length) {
          mnemonicString += item.replace(/\s/g, '');
        } else {
          mnemonicString += item.replace(/\s/g, '') + ' ';
        }
      });
      mnemonicString = mnemonicString.toLowerCase().trim();
      const { isAddress, address, wallet } = await getTronWalletChecksum(
        mnemonicString,
      );
      if (!isAddress) {
        Vibration.vibrate(150);
        Toast.show('트론 지갑 주소 형식이 아닙니다', { position: 0 });
      } else {
        const {
          data: { userExistCheck },
        } = await userExistCheckMutation({
          variables: {
            address,
          },
        });
        setAlreadyUser(userExistCheck);

        const privateKey = wallet.privateKey;
        const walletData = {
          name: '트론',
          coinType: 'TRX',
          symbol: 'TRX',
          address,
        };

        let data = {
          walletData,
          mnemonicValue: mnemonicString,
          privateKey,
          type: 'mnemonic',
        };
        setJsonDataState(data);
        popupModal();
      }
    } catch (e) {
      Vibration.vibrate(200);
      Toast.show('니모닉 형식에 맞지않습니다', { position: 0 });
      return false;
    } finally {
      setIsLoading(false);
      setButtonActive(false);
    }
  };

  const hexRegex = /^[a-fA-F0-9]{64}$/g;
  // const hexRegex2 = /^[0-9a-fA-F]+$/;
  const privateKeyCheckFunc = (v) => {
    if (v === '') {
      setInputValue('');
    } else {
      setInputValue(v);
    }
  };

  const privateKeyCheck = async () => {
    let privateKeyValue = '';
    if (inputValue.includes('0x')) {
      privateKeyValue = inputValue.substr(2).trim();
    } else {
      privateKeyValue = inputValue.trim();
    }
    if (privateKeyValue === '') {
      Vibration.vibrate(200);
      Toast.show('개인키를 입력해주세요', { position: 0 });
      setIsLoading(false);
      setButtonActive(false);
      return false;
    } else if (!hexRegex.test(privateKeyValue)) {
      Vibration.vibrate(200);
      setInputValue(privateKeyValue.substr(0, 64));
      Toast.show('개인키 형식에 맞지 않습니다', { position: 0 });
      setIsLoading(false);
      setButtonActive(false);
      return false;
    } else {
      setInputValue(privateKeyValue);
      const wallet = new ethers.Wallet(privateKeyValue.replace(/\n/gi, ''));
      const etherAddress = await wallet.getAddress();
      const address = await hexAddressToBase58(etherAddress);
      const {
        data: { userExistCheck },
      } = await userExistCheckMutation({
        variables: {
          address,
        },
      });
      const privateKey = wallet.privateKey;
      const walletData = {
        name: '트론',
        coinType: 'TRX',
        symbol: 'TRX',
        address,
      };

      let data = {
        walletData,
        mnemonicValue: null,
        privateKey,
        type: 'privateKey',
      };
      setJsonDataState(data);
      setAlreadyUser(userExistCheck);
      popupModal();
      setIsLoading(false);
    }
  };

  const nextFocus = (idx) => {
    inputRefs.current[idx + 1].focus();
  };

  const renderButton = () => {
    switch (activeIndex) {
      case 0:
        return (
          <>
            <ToggleSwitch style={styles.absoluteActive}>
              <Touchable disabled={isLoading} onPress={() => toggleSwitch(0)}>
                <MainBGColor style={{ borderRadius: 25 }}>
                  <VerticalBox height={45}>
                    <Text color={theme.whiteTextColor} fontSize={17}>
                      니모닉
                    </Text>
                  </VerticalBox>
                </MainBGColor>
              </Touchable>
            </ToggleSwitch>
            <ToggleSwitch style={styles.absoluteInActive}>
              <Touchable disabled={isLoading} onPress={() => toggleSwitch(1)}>
                <SwitchContainer>
                  <Text color={theme.mainColor} fontSize={17}>
                    개인키
                  </Text>
                </SwitchContainer>
              </Touchable>
            </ToggleSwitch>
          </>
        );
      default:
        return (
          <>
            <ToggleSwitch style={styles.absoluteInActiveTwo}>
              <Touchable disabled={isLoading} onPress={() => toggleSwitch(0)}>
                <SwitchContainerTwo>
                  <Text color={theme.mainColor} fontSize={17}>
                    니모닉
                  </Text>
                </SwitchContainerTwo>
              </Touchable>
            </ToggleSwitch>
            <ToggleSwitch style={styles.absoluteActiveTwo}>
              <Touchable disabled={isLoading} onPress={() => toggleSwitch(1)}>
                <MainBGColor style={{ borderRadius: 25 }}>
                  <VerticalBox height={45}>
                    <Text color={theme.whiteTextColor} fontSize={17}>
                      개인키
                    </Text>
                  </VerticalBox>
                </MainBGColor>
              </Touchable>
            </ToggleSwitch>
          </>
        );
    }
  };

  const renderSection = () => {
    switch (activeIndex) {
      case 0:
        return (
          <>
            <Text
              color={theme.blackTextColor}
              fontSize={17}
              marginTop={'10%'}
              marginBottom={'5%'}
            >
              니모닉 단어를 입력해주세요
            </Text>
            <Image
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/load_wallet_mnemonic.png')}
            />
            <Text
              color={theme.blackTextColor}
              fontSize={13}
              marginTop={'5%'}
              marginBottom={'2%'}
              textAlignVertical={'left'}
            >
              니모닉 단어 입력
            </Text>

            {/* ============니모닉 12칸 삽입============= */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <MnemonicWrapperColumn>
                {columnValue.map((item) => {
                  return (
                    <MnemonicWrapperRow key={item}>
                      {rowValue.map((idx) => {
                        if (idx + item === 11) {
                          return (
                            <MnemonicBox
                              key={idx + item}
                              style={
                                mnemonicValue[idx + item] === ''
                                  ? Mnemonicstyle.inActiveInput
                                  : Mnemonicstyle.activeInput
                              }
                            >
                              <MnemonicTextInput
                                value={mnemonicValue[idx + item]}
                                onChangeText={(text) =>
                                  changeMnemonicValue(idx + item, text)
                                }
                                ref={(el) =>
                                  (inputRefs.current[idx + item] = el)
                                }
                                returnKeyType="done"
                                onSubmitEditing={() => {
                                  setIsLoading(true);
                                  setButtonActive(true);
                                  setTimeout(() => {
                                    mnemonicValueConcat();
                                  }, 10);
                                }}
                              ></MnemonicTextInput>
                            </MnemonicBox>
                          );
                        } else {
                          return (
                            <MnemonicBox
                              key={idx + item}
                              style={
                                mnemonicValue[idx + item] === ''
                                  ? Mnemonicstyle.inActiveInput
                                  : Mnemonicstyle.activeInput
                              }
                            >
                              <MnemonicTextInput
                                value={mnemonicValue[idx + item]}
                                onChangeText={(text) =>
                                  changeMnemonicValue(idx + item, text)
                                }
                                ref={(el) =>
                                  (inputRefs.current[idx + item] = el)
                                }
                                returnKeyType="next"
                                blurOnSubmit={false} // ref focus가 이동할때 키보드를 유지하는 옵션
                                onSubmitEditing={() => nextFocus(idx + item)}
                              ></MnemonicTextInput>
                            </MnemonicBox>
                          );
                        }
                      })}
                    </MnemonicWrapperRow>
                  );
                })}
              </MnemonicWrapperColumn>
            </TouchableWithoutFeedback>
            {/* ============니모닉 12칸 삽입============= */}
          </>
        );
      default:
        return (
          <>
            <Text
              color={theme.blackTextColor}
              fontSize={17}
              marginTop={'10%'}
              marginBottom={'5%'}
            >
              개인키를 입력해주세요
            </Text>
            <Image
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/load_wallet_key.png')}
            />
            <Text
              color={theme.blackTextColor}
              fontSize={13}
              marginTop={'5%'}
              marginBottom={'2%'}
              textAlignVertical={'left'}
            >
              개인키 입력
            </Text>
            <TextInputContainer>
              <TextInput
                multiline
                textAlignVertical="top"
                keyboardType="email-address"
                returnKeyType="done"
                onSubmitEditing={null} //privateKeyCheck 이걸 넣으면 움직임이 어색해짐
                value={inputValue}
                scrollEnabled={false}
                onChangeText={(v) => privateKeyCheckFunc(v)}
                // placeholder={"  개인키를 입력해주세요"}
              />
            </TextInputContainer>
            <DummyBox />
          </>
        );
    }
  };

  const recoveryWallet = async () => {
    handleModal();
    await AsyncStorage.setItem('authType', 'pin');
    await SecureStorage.setItem('PINcode', '');
    if (activeIndex === 0) {
      //니모닉 지갑 복구
      try {
        const jsonData = JSON.stringify(jsonDataState);

        if (alreadyUser) {
          //등록된 회원 => BioMetric으로 이동
          setTimeout(() => {
            navigation.navigate('BioMetric', {
              routeName: 'WalletNavigation',
              jsonData,
            });
          }, 500);
        } else {
          //미등록 회원 => walletScreen으로 이동
          setTimeout(() => {
            navigation.navigate('WalletsScreen', {
              routeName: 'ImportWallet',
              jsonData,
            });
          }, 10);
        }
      } catch (error) {
        //니모닉 형식 오류는 ethers.wallet가 잡아주네
        Vibration.vibrate(200);
        Toast.show('니모닉 형식에 맞지않습니다', { position: 0 });
        return false;
      }
    } else {
      //개인키 지갑 복구
      try {
        const wallet = new ethers.Wallet(inputValue.replace(/\n/gi, ''));
        const etherAddress = await wallet.getAddress();
        const address = await hexAddressToBase58(etherAddress);
        const privateKey = wallet.privateKey;
        const walletData = {
          name: '트론',
          coinType: 'TRX',
          symbol: 'TRX',
          address,
        };

        let jsonData = {
          walletData,
          mnemonicValue: null,
          privateKey,
          type: 'privateKey',
        };
        jsonData = JSON.stringify(jsonData);
        const {
          data: { userExistCheck },
        } = await userExistCheckMutation({
          variables: {
            address,
          },
        });
        // 로디언즈에 등록된 회원인지 DB에 확인
        if (userExistCheck) {
          //등록된 회원 => BioMetric으로 이동

          setTimeout(() => {
            //인증 방식을 pin으로 변경하고 biometric으로 이동
            navigation.navigate('BioMetric', {
              routeName: 'WalletNavigation',
              jsonData,
            });
          }, 500);
        } else {
          //미등록 회원 => walletScreen으로 이동

          setTimeout(() => {
            navigation.navigate('WalletsScreen', {
              routeName: 'ImportWallet',
              jsonData,
            });
          }, 500);
        }
      } catch (error) {
        throw new Error('에러');
      }
    }
  };

  const handleModal = async () => {
    setModalVisible(false);
  };

  const popupModal = () => {
    setModalVisible(true);
  };
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS == 'ios' ? Header.HEIGHT + 25 : 0}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps={'handled'} //키보드가 열려도 버튼이나 input 등이가능하도록 하는 props
        // style={{ height: '100%' }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <VerticalBox
              width={`${Dimensions.get('window').width}`}
              height={`${Dimensions.get('window').height}`}
              bgColor={globalStyles.backGroundColor}
            >
              <WrapperView>
                <SwitchBox>{renderButton()}</SwitchBox>
                {renderSection()}
              </WrapperView>
            </VerticalBox>
          </>
        </TouchableWithoutFeedback>
      </ScrollView>
      <BottomContainer>
        <Touchable
          disabled={buttonActive && next}
          onPress={() => {
            setIsLoading(true);
            setButtonActive(true);
            setTimeout(() => {
              activeIndex === 0 ? mnemonicValueConcat() : privateKeyCheck();
            }, 10);
          }}
        >
          <MainBGColor>
            <ButtonContainer height={55}>
              {isLoading ? (
                <ActivityIndicator
                  size="large"
                  color={theme.activityIndicatorColor}
                />
              ) : (
                <Text color={theme.whiteTextColor} fontSize={17}>
                  가져오기
                </Text>
              )}
            </ButtonContainer>
          </MainBGColor>
        </Touchable>
      </BottomContainer>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          handleModal();
        }}
      >
        <ModalWarpper>
          <ModalView style={{ height: 245 }}>
            <ModalImage
              style={{
                resizeMode: 'contain',
                height: '30%',
                marginTop: 20,
              }}
              source={require('../../assets/front/popup_2.png')}
            ></ModalImage>
            <ModalTextContainer>
              <ModalText>
                {alreadyUser && activeIndex === 0
                  ? `지갑 불러오기 성공(니모닉)\n그루에 등록된 지갑입니다\n결제 비밀번호를 생성합니다`
                  : alreadyUser && activeIndex !== 0
                  ? `지갑 가져오기 성공(개인키)\n그루에 등록된 지갑입니다\n결제 비밀번호를 생성합니다`
                  : !alreadyUser && activeIndex === 0
                  ? `지갑 가져오기 성공(니모닉)\n그루에 등록되지 않은 지갑입니다\n닉네임을 새로 입력해주세요`
                  : `지갑 가져오기 성공(개인키)\n그루에 등록되지 않은 지갑입니다\n닉네임을 새로 입력해주세요`}
              </ModalText>
            </ModalTextContainer>
            <ModalButtonContainer>
              <ModalTouchable
                disabled={isLoading}
                onPress={() => {
                  setNext(true);
                  recoveryWallet();
                }}
              >
                <RadiusRight>
                  <MainBGColor
                    style={{
                      borderBottomLeftRadius: 10,
                    }}
                  >
                    <ModalContainer>
                      {isLoading ? (
                        <ActivityIndicator
                          size="large"
                          color={theme.activityIndicatorColor}
                        />
                      ) : (
                        <ButtonText>확인</ButtonText>
                      )}
                    </ModalContainer>
                  </MainBGColor>
                </RadiusRight>
              </ModalTouchable>
            </ModalButtonContainer>
          </ModalView>
        </ModalWarpper>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default withTheme(ImportWalletScreen);
