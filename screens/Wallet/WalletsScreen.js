import React, { useState, useEffect } from 'react';
import {
  Vibration,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
} from 'react-native';
import styled, { withTheme } from 'styled-components';
import Toast from 'react-native-tiny-toast';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { Header } from 'react-navigation-stack';
import AuthInput from '../../components/AuthInput';
import constants from '../../constants';

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
  justify-content: center;
  margin-bottom: 5;
  margin-top: 10;
`;

const ModalText = styled.Text`
  text-align: center;
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

const Wrapper = styled.View`
  width: ${constants.width};
  height: ${constants.height * 0.89};
  align-items: center;
  background-color: ${(props) => props.theme.backGroundColor};
`;

const Image = styled.Image`
  height: ${constants.height * 0.2};
  margin-bottom: 15px;
`;

const BottomContainer = styled.View`
  align-items: flex-end;
  flex-direction: row;
`;

const Touchable = styled.TouchableOpacity`
  margin-top: 10px;
`;

const Container = styled.View`
  height: 55px;
  width: ${constants.width * 1.0};
  align-items: center;
  justify-content: center;
`;

const InputContainer = styled.View`
  margin-top: 10%;
  flex: 1;
`;

const CoinText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: left;
  font-weight: 600;
  margin-top: 5px;
  margin-left: 5px;
  width: 90%;
`;

const Text = styled.Text`
  height: 70px;
  color: ${(props) => props.theme.blackTextColor};
  text-align: center;
  font-size: 17px;
  margin-top: 5%;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  text-align: center;
  font-size: 17px;
`;

const ButtonText2 = styled.Text`
  color: ${(props) => (props.color ? props.color : props.theme.mainColor)};
  text-align: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : 13)};
`;

const WrapperInput = styled.View``;

const MiniTouchable = styled.TouchableOpacity`
  position: absolute;
  right: 1;
  top: 15;
`;

const MiniContainer = styled.View`
  width: 73;
  height: 30;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background-color: ${(props) => props.theme.subColor};
  border-width: 1px;
  border-color: ${(props) => props.theme.mainColor};
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const NICKNAME_CONFIRM = gql`
  mutation nickNameConfirm($nickName: String!) {
    nickNameConfirm(nickName: $nickName) {
      isExist
      filterWord
      isSuccess
    }
  }
`;

const WalletScreen = withTheme(({ theme, navigation }) => {
  const routeName = navigation.getParam('routeName');
  let jsonData = navigation.getParam('jsonData');
  const [isLoading, setIsLoading] = useState(false);
  const [next, setNext] = useState(false);
  const [nickNameInput, setNickNameInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [type, setType] = useState(null);
  const [nickNameConfirmMutation] = useMutation(NICKNAME_CONFIRM, {
    variables: {
      nickName: nickNameInput,
    },
  });

  useEffect(() => {
    const focusListener = navigation.addListener('willFocus', () => {
      setIsLoading(false);
      setNext(false);
    });
    return () => focusListener.remove();
  }, []);

  const checkSpecialCharacter = /[\s\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
  const checkEmoji = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  // const check = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/gi;

  const nickNameCheck = (val) => {
    if (val === '') {
      setNickNameInput('');
    } else if (nickNameInput.length > 5) {
      Toast.show('닉네임은 최대 6글자 입니다', { position: 0 });
      setNickNameInput(val.substring(0, 6));
    } else if (checkSpecialCharacter.test(val)) {
      Toast.show('닉네임 특수문자 입력 금지', { position: 0 });
      return setNickNameInput('');
    } else if (checkEmoji.test(val)) {
      Toast.show('닉네임 이모지 입력 금지', { position: 0 });
      return setNickNameInput('');
    } else {
      return setNickNameInput(val);
    }
  };

  const nickNameCheckButton = async () => {
    try {
      if (nickNameInput === '') {
        Vibration.vibrate(150);
        Toast.show('닉네임을 입력하세요', { position: 0 });
        return false;
      } else if (checkSpecialCharacter.test(nickNameInput)) {
        Vibration.vibrate(150);
        Toast.show('닉네임 특수문자 입력 금지', { position: 0 });
        return setNickNameInput('');
      } else if (checkEmoji.test(nickNameInput)) {
        Vibration.vibrate(150);
        Toast.show('닉네임 이모지 입력 금지', { position: 0 });
        return setNickNameInput('');
      } else {
        const {
          data: {
            nickNameConfirm: { isExist, filterWord, isSuccess },
          },
        } = await nickNameConfirmMutation();
        if (isSuccess) {
          return Toast.show('사용가능한 닉네임입니다', { position: 0 });
        } else {
          if (isExist) {
            Vibration.vibrate(150);
            return Toast.show('이미 사용중인 닉네임입니다', { position: 0 });
          } else if (!isExist && filterWord !== '') {
            Vibration.vibrate(150);
            return Toast.show(`금지 단어가 포함되어 있습니다 '${filterWord}'`, {
              position: 0,
            });
          }
        }
      }
    } catch (error) {
      console.log({ error });
      Toast.show(
        '서버와 연결이 원활하지 않습니다\n잠시 후, 다시 실행해 주십시오',
        { position: 0 },
      );
    }
  };

  const nextButtonPress = async (val) => {
    try {
      if (nickNameInput === '') {
        Vibration.vibrate(150);
        Toast.show('닉네임을 입력하세요', { position: 0 });
        return setIsLoading(false);
      } else if (nickNameInput.length > 6) {
        Toast.show('닉네임은 최대 6글자 입니다', { position: 0 });
        setIsLoading(false);
        return setNickNameInput(nickNameInput.substring(0, 6));
      } else if (checkSpecialCharacter.test(nickNameInput)) {
        Vibration.vibrate(150);
        Toast.show('닉네임 특수문자 입력 금지', { position: 0 });
        setIsLoading(false);
        return setNickNameInput('');
      } else if (checkEmoji.test(nickNameInput)) {
        Vibration.vibrate(150);
        Toast.show('닉네임 이모지 입력 금지', { position: 0 });
        setIsLoading(false);
        return setNickNameInput('');
      } else {
        const {
          data: {
            nickNameConfirm: { isExist, filterWord, isSuccess },
          },
        } = await nickNameConfirmMutation();
        console.log({ isExist }, { filterWord }, { isSuccess });
        if (isSuccess) {
          if (val == 'CreateWalletScreen') {
            setType('CreateWalletScreen');
            setModalVisible(true);
          } else if (val == 'BioMetric') {
            // 모달 무시하고 바로 바이오매트릭으로 가야할듯?
            const jsonParseData = JSON.parse(jsonData);
            let jsonDataReduce = {
              nickName: nickNameInput,
              walletData: jsonParseData.walletData,
              mnemonicValue: jsonParseData.mnemonicValue,
              privateKey: jsonParseData.privateKey,
              type: jsonParseData.type,
            };
            jsonDataReduce = JSON.stringify(jsonDataReduce);
            setTimeout(() => {
              navigation.navigate('BioMetric', {
                routeName: 'WalletNavigation',
                jsonData: jsonDataReduce,
              });
            }, 500);
          }
        } else {
          if (isExist) {
            Vibration.vibrate(150);
            Toast.show('이미 사용중인 닉네임입니다', { position: 0 });
            return setIsLoading(false);
          } else if (!isExist && filterWord === '특수문자 입력 금지') {
            Vibration.vibrate(150);
            Toast.show(`${filterWord}`, {
              position: 0,
            });
            return setIsLoading(false);
          } else if (!isExist && filterWord === 'Emoji 입력 금지') {
            Vibration.vibrate(150);
            Toast.show(`${filterWord}`, {
              position: 0,
            });
            return setIsLoading(false);
          } else if (!isExist && filterWord !== '') {
            Vibration.vibrate(150);
            Toast.show(`금지 단어가 포함되어 있습니다 '${filterWord}'`, {
              position: 0,
            });
            return setIsLoading(false);
          }
        }
      }
    } catch (error) {
      Toast.show(
        '서버와 연결이 원활하지 않습니다\n잠시 후, 다시 실행해 주십시오',
        { position: 0 },
      );
    }
  };

  const navigateFunc = (type) => {
    try {
      setModalVisible(false);
      // 일단 바이오 매트릭을 거치는 걸로 해보자 ※환전에서 어차피 써먹어야하기 때문
      if (type == 'CreateWalletScreen') {
        setTimeout(() => {
          navigation.navigate('CreateWalletScreen', {
            nickName: nickNameInput,
          });
        }, 500);
      }
    } catch (error) {
      Toast.show(
        '서버와 연결이 원활하지 않습니다\n잠시 후, 다시 실행해 주십시오',
        { position: 0 },
      );
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? Header.HEIGHT + 20 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          scrollIndicatorInsets={{ right: 1 }}
          keyboardShouldPersistTaps={'handled'} //키보드가 열려도 버튼이나 input 등이가능하도록 하는 props
          style={{ height: '100%' }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <Wrapper>
                <Text>{`보유하신 지갑 또는\nKRWG를 보관할 새로운 지갑을 생성해 주세요`}</Text>
                <Image
                  style={{ resizeMode: 'contain' }}
                  source={require('../../assets/front/create_wallet_img.png')}
                />
                <InputContainer>
                  <CoinText>닉네임</CoinText>
                  <WrapperInput>
                    <AuthInput
                      value={nickNameInput}
                      onChange={(val) => {
                        nickNameCheck(val);
                      }}
                      type="ID"
                      placeholder="한글,영어,숫자 6자"
                      returnKeyType="next"
                      onSubmitEditing={nickNameCheckButton}
                      autoCorrect={false}
                    ></AuthInput>
                    <MiniTouchable
                      onPress={async () => {
                        // console.log("최초지갑생성 닉네임 중복확인");
                        nickNameCheckButton();
                      }}
                    >
                      <MiniContainer>
                        <ButtonText2>중복확인</ButtonText2>
                      </MiniContainer>
                    </MiniTouchable>
                  </WrapperInput>
                </InputContainer>

                {/* ================type이 CreateWalletScreen true일때================ */}
                <Modal
                  isVisible={modalVisible}
                  onBackdropPress={() => {
                    if (!next) {
                      setIsLoading(false);
                    }
                    setModalVisible(false);
                  }}
                >
                  <ModalWarpper>
                    <ModalView height={'255px'}>
                      <ModalImage
                        style={{
                          resizeMode: 'contain',
                          height: '30%',
                          marginTop: 20,
                        }}
                        source={require('../../assets/front/popup_1.png')}
                      />
                      <ModalTextContainer>
                        <ModalText
                          style={{
                            height: 115,
                          }}
                        >
                          {`니모닉은 결제 비밀번호를 찾을때나\n블록체인 지갑을 찾을때 불러오기를\n할 수 있는 매우 중요한 정보입니다.\n꼭 보관하세요!`}
                        </ModalText>
                      </ModalTextContainer>
                      <ModalButtonContainer>
                        <ModalTouchable
                          onPress={() => {
                            setNext(true);
                            navigateFunc(type);
                          }}
                        >
                          <RadiusRight>
                            <MainBGColor
                              style={{
                                borderBottomLeftRadius: 10,
                              }}
                            >
                              <ModalContainer>
                                <ButtonText>확인</ButtonText>
                              </ModalContainer>
                            </MainBGColor>
                          </RadiusRight>
                        </ModalTouchable>
                      </ModalButtonContainer>
                    </ModalView>
                  </ModalWarpper>
                </Modal>
              </Wrapper>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
        <BottomContainer>
          <Touchable
            disabled={isLoading}
            onPress={() => {
              setIsLoading(true);
              routeName === 'ImportWallet'
                ? nextButtonPress('BioMetric')
                : nextButtonPress('CreateWalletScreen');
            }}
          >
            <MainBGColor>
              <Container>
                <ButtonText fontSize={17} color={theme.blackTextColor}>
                  {routeName === 'ImportWallet' ? '지갑 불러오기' : '지갑 생성'}
                </ButtonText>
              </Container>
            </MainBGColor>
          </Touchable>
        </BottomContainer>
      </KeyboardAvoidingView>
    </>
  );
});

export default withTheme(WalletScreen);

WalletScreen.propTypes = {};
