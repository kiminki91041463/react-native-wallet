import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import '../../shim';
import { ethers } from 'ethers';
import styled, { withTheme } from 'styled-components';
import { randomBytes } from 'react-native-randombytes';
import constants from '../../constants';
import Toast from 'react-native-tiny-toast';
import SecureStorage from 'react-native-secure-storage';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-community/clipboard';
import { hexAddressToBase58 } from '../../Web3Connecter';

const ModalView = styled.View`
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
  flex: 1;
  width: 250;
  height: 100;
  justify-content: center;
  margin-bottom: 5;
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

// ===============================================
const Text = styled.Text`
  color: ${(props) => props.theme.mainColor};
  text-align: center;
`;

const Textone = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: center;
  font-size: 17px;
  margin-top: 3%;
`;

const Texttwo = styled.Text`
  color: ${(props) => props.theme.lightGrayColor};
  text-align: center;
  font-size: 12px;
  margin-bottom: 5px;
  padding: 5px 0px 5px 0px;
  height: 50;
`;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  background-color: ${(props) => props.theme.backGroundColor};
`;

const WrapperView = styled.View`
  width: ${constants.width * 0.95};
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 2%;
`;

const MnemonicWrapperRow = styled.View`
  flex: 1;
  flex-direction: row;
  margin-bottom: 2%;
  justify-content: center;
  text-align: center;
`;

const MnemonicWrapperColumn = styled.View`
  flex: 1;
  flex-direction: column;
`;

const MnemonicBox = styled.View`
  justify-content: center;
  height: 13%;
  margin: 5px;
  padding: 5px 2px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.subColor};
  border-width: 1px;
  border-color: ${(props) => props.theme.mainColor};
`;

const ContainerTwo = styled.View`
  display: flex;
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.View`
  height: ${constants.height / 4.5};
`;

const Image = styled.Image`
  height: ${constants.height / 5};
  margin: 0 auto;
  padding: 20px;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  text-align: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : 17)};
`;

const Touchable = styled.TouchableOpacity`
  margin-top: 2%;
  width: ${constants.width};
`;

const MiniTouchable = styled.TouchableOpacity`
  display: flex;
  align-items: flex-end;
  margin-right: 5%;
`;

const MiniContainer = styled.View`
  justify-content: center;
  margin: 5px;
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const CreateWalletScreen = ({ theme, navigation }) => {
  const nickName = navigation.getParam('nickName');
  const [mnemonicValue, setMnemoniValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [next, setNext] = useState(false);
  const [mnemonicValueArr, setMnemonicValueArr] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const createMnemonic = async () => {
    const randomByteValue = randomBytes(16);
    //mnemonic seed에 대해 더 공부하고 고도화 예정
    const mnemonic = ethers.utils.HDNode.entropyToMnemonic(randomByteValue);
    const mnemonicValueArr = mnemonic.split(' ');

    setMnemonicValueArr(mnemonicValueArr);
    setMnemoniValue(mnemonic); //mnemonicValue = mnemonic
    return true;
  };

  useEffect(() => {
    createMnemonic();
    const focusListener = navigation.addListener('willFocus', () => {
      setNext(false);
      setButtonActive(false);
    });
    return () => focusListener.remove();
  }, []);

  useEffect(() => {
    if (isLoading) {
      _createWallet();
    }
  }, [isLoading]);

  const handleModal = async () => {
    setModalVisible(!modalVisible); //ModalVisible값이 현재의 반대로 바뀜
  };

  const popupModal = () => {
    handleModal();
  };

  const _createWallet = async () => {
    handleModal();
    try {
      const wallet = ethers.Wallet.fromMnemonic(mnemonicValue);
      console.log('================');
      console.log(wallet);
      console.log('================');
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
        nickName,
        mnemonicValue,
        privateKey,
        type: 'mnemonic',
      };
      jsonData = JSON.stringify(jsonData);

      console.log(jsonData);
      await AsyncStorage.setItem('authType', 'pin');
      await SecureStorage.setItem('PINcode', '');
      setTimeout(() => {
        navigation.navigate('BioMetric', {
          routeName: 'WalletNavigation',
          jsonData,
        });
      }, 500);
    } catch (error) {
      throw new Error('에러');
    } finally {
      setIsLoading(false);
      // Toast.show("결제 비밀번호를 생성합니다");  팝업이 생겼으니까 toast 메세지는 주석함 (20.02.11 루치)
    }
  };

  return (
    <Wrapper>
      <WrapperView style={{ flex: 1 }}>
        <Textone>{`니모닉 단어를 안전한 곳에 보관하세요`}</Textone>
        <Texttwo>{`니모닉은 지갑, PIN번호를 분실했을 때 사용되며\n분실 시 책임지지 않습니다`}</Texttwo>
        <ImageContainer>
          <Image
            style={{ resizeMode: 'contain' }}
            source={require('../../assets/front/createWalletImage.png')}
          />
        </ImageContainer>

        <MnemonicWrapperRow>
          <MnemonicWrapperColumn>
            <MnemonicBox>
              <Text>{mnemonicValueArr[0]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[3]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[6]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[9]}</Text>
            </MnemonicBox>
          </MnemonicWrapperColumn>
          <MnemonicWrapperColumn>
            <MnemonicBox>
              <Text>{mnemonicValueArr[1]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[4]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[7]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[10]}</Text>
            </MnemonicBox>
          </MnemonicWrapperColumn>
          <MnemonicWrapperColumn>
            <MnemonicBox>
              <Text>{mnemonicValueArr[2]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[5]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[8]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[11]}</Text>
            </MnemonicBox>
            <MiniTouchable
              onPress={() => {
                Clipboard.setString(mnemonicValue);
                Platform.OS === 'ios' || Platform.Version > 25
                  ? Toast.show('니모닉 복사가 완료되었습니다', { position: 0 })
                  : null;
              }}
            >
              <MainBGColor style={{ borderRadius: 13 }}>
                <MiniContainer>
                  <ButtonText fontSize={13}>복사하기</ButtonText>
                </MiniContainer>
              </MainBGColor>
            </MiniTouchable>
          </MnemonicWrapperColumn>
        </MnemonicWrapperRow>
      </WrapperView>
      <Touchable
        disabled={buttonActive && next}
        onPress={() => {
          setButtonActive(true);
          popupModal();
        }}
      >
        <MainBGColor>
          <ContainerTwo>
            <ButtonText>결제 비밀번호 생성</ButtonText>
          </ContainerTwo>
        </MainBGColor>
      </Touchable>

      {/* ================================================== */}

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          if (!next) {
            setButtonActive(false);
          }
          handleModal();
        }}
      >
        <ModalWarpper>
          <ModalView style={{ height: 225 }}>
            <ModalImage
              style={{
                resizeMode: 'contain',
                height: '37%',
                marginTop: 20,
              }}
              source={require('../../assets/front/popup_2.png')}
            ></ModalImage>
            <ModalTextContainer>
              <ModalText>{`결제 비밀번호를 생성합니다.`}</ModalText>
            </ModalTextContainer>
            <ModalButtonContainer>
              <ModalTouchable
                disabled={isLoading}
                onPress={() => {
                  setNext(true);
                  setIsLoading(true);
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
    </Wrapper>
  );
};

export default withTheme(CreateWalletScreen);
