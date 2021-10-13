import React, { useState, useEffect } from 'react';
import styled, { withTheme } from 'styled-components';
import {
  TouchableWithoutFeedback,
  Keyboard,
  Vibration,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import constants from '../../constants';
import AddressInputBox from '../../components/AddressInputBox';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from 'react-apollo-hooks';
import NameInputBox from '../../components/NameInputBox';
import Modal from 'react-native-modal';
import { Header } from 'react-navigation-stack';
import Toast from 'react-native-tiny-toast';
import PropTypes from 'prop-types';
import { setComma } from '../../utils';
import Error from '../../components/Error';
import Loader from '../../components/Loader';
import { isAddressFunc } from '../../Web3Connecter';

import {
  myInfoState,
  userBalance,
  companyState,
  transferData,
} from '../../recoil/recoilAtoms';
import { useRecoilValue, useResetRecoilState } from 'recoil';

const Warpper = styled.View`
  width: ${constants.width};
  height: ${constants.height};
`;

const Container = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const CheckBoxWarpper = styled.View`
  justify-content: space-between;
  flex-direction: row;
`;

const RecieverBox = styled.View`
  height: ${constants.height * 0.6};
  background-color: ${(props) => props.theme.backGroundColor};
  padding-bottom: 2%;
`;

const CoinText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: left;
  font-weight: 600;
  margin-left: 20px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 20)};
`;

const ButtonText = styled.Text`
  color: ${(props) => (props.color ? props.color : props.theme.whiteTextColor)};
  text-align: center;
  font-size: 17px;
`;

const CancelButtonText = styled.Text`
  color: ${(props) => (props.color ? props.color : props.theme.blackTextColor)};
  text-align: center;
  font-size: 17px;
`;

const BottomContainer = styled.View`
  align-items: flex-end;
  flex-direction: row;
`;

const ButtonContainerWarpper = styled.View`
  align-items: center;
`;

const NextButtonContainer = styled.View`
  width: ${constants.width};
`;

const Touchable2 = styled.TouchableOpacity``;

const ListView = styled.View``;

const ModalView = styled.View`
  background-color: ${(props) => props.theme.subColor};
  align-items: center;
  border-radius: 11px;
  width: 330;
  height: 230;
`;

const ModalButtonContainer = styled.View`
  justify-content: flex-end;
  flex: 1;
  flex-direction: row;
`;

const ModalWarpper = styled.View`
  align-items: center;
`;

const ModalImage = styled.Image`
  margin-top: 20px;
`;

const ModalTextContainer = styled.View`
  flex: 3;
  width: 240;
  justify-content: center;
`;

const ModalText = styled.Text`
  font-size: ${(props) => (props.fontSize ? props.fontSize : 14)};
  color: ${(props) => (props.color ? props.color : props.theme.blackTextColor)};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)};
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)};
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
  height: ${(props) => (props.height ? props.height : 'auto')};
`;

const Touchable = styled.TouchableOpacity``;

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

const CustomText = styled.Text`
  color: ${(props) => (props.color ? props.color : props.theme.blackTextColor)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : 18)};
  padding: 10px;
  height: 44;
  background-color: ${(props) => props.theme.subColor};
  margin-bottom: 1;
  padding-left: 10%;
`;

const RadiusRight = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
`;

const TextContainer = styled.View`
  width: ${constants.width * 0.9};
  height: 48px;
  margin: 0 auto;
  justify-content: flex-end;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.borderBottomColor};
`;

const RecentlyText = styled.Text`
  color: ${(props) => (props.color ? props.color : props.theme.blackTextColor)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : 18)};
  margin-bottom: 3;
`;

const Underline = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.borderBottomColor};
  margin: 5px 0;
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const FlatComponent = styled.View``;

const FIND_USER = gql`
  mutation findUser($nickName: String!) {
    findUser(nickName: $nickName) {
      nickName
      code
      address
    }
  }
`;

const USER_GET_NICKNAME = gql`
  mutation userGetNickname($address: String!) {
    userGetNickname(address: $address)
  }
`;

const LATELY_USERS = gql`
  {
    latelyUsers {
      code
      nickName
      address
    }
  }
`;

export default withTheme(({ theme, navigation }) => {
  const {
    loading: latelyUserLoading,
    error: latelyUserError,
    data: latelyUserData,
  } = useQuery(LATELY_USERS, {
    fetchPolicy: 'network-only',
  });

  if (latelyUserLoading) return <Loader />;

  if (latelyUserError) {
    return <Error navigation={navigation} />;
  }

  if (latelyUserData)
    return (
      <TransferSecond
        navigation={navigation}
        data={latelyUserData}
        theme={theme}
      />
    );
});

const TransferSecond = ({ navigation, data, theme }) => {
  //recoil
  const { KRWG } = useRecoilValue(userBalance);
  const { dailyFreeTransferCount } = useRecoilValue(myInfoState);
  const { charge } = useRecoilValue(companyState);

  //recoil setter
  const transferDataReset = useResetRecoilState(transferData);

  //state
  const [findUserArr, setFindUserArr] = useState([]);
  const [nickName, setNickName] = useState('');
  const [validate, setValidate] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); //Modal 보일지 말지 정함
  const [listType, setListType] = useState('lately');
  const [addressValue, setAddressValue] = useState(''); //주소 input 값
  const [nameInput, setNameInput] = useState('');

  //params
  const coinValue = navigation.getParam('coinValue');
  const qrAddress = navigation.getParam('qrAddress');

  //mutation
  const [findUserMutation] = useMutation(FIND_USER);
  const [userGetNicknameMutation] = useMutation(USER_GET_NICKNAME);

  const regHex = /[\s\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
  const check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]|[\s\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;

  const changeAddress = (val) => {
    if (check.test(val)) {
      Toast.show('한글, 특수문자 입력 불가', { position: 0 });
      setAddressValue('');
      return false;
    } else if (val.length > 42) {
      Toast.show('주소는 0x를 제외한 40자리 입력', { position: 0 });
      return false;
    } else {
      setAddressValue(val);
    }
  };

  const modalClose = () => {
    setValidate(false);
    setModalVisible(false);
  };

  const handleModal = async () => {
    setModalVisible(!modalVisible);
  };

  const addressValidate = async (addressValue) => {
    const walletStr = await AsyncStorage.getItem('WALLETS');
    const wallet = JSON.parse(walletStr);

    if (wallet.address === addressValue) {
      setAddressValue('');
      Vibration.vibrate(150);
      Toast.show('본인 지갑주소는 입력할 수 없습니다.', { position: 0 });
      return false;
    }

    if (addressValue === '' && addressValue !== null) {
      Vibration.vibrate(150);
      Toast.show('지갑 주소를 입력하세요', { position: 0 });
      return false;
    } else if (!isAddressFunc(addressValue)) {
      Vibration.vibrate(150);
      Toast.show('지갑 주소가 유효하지 않습니다\n다시 확인해주세요', {
        position: 0,
      });
      return false;
    } else {
      return true;
    }
  };

  const userGetNickMutationFunc = async () => {
    try {
      const valid = await addressValidate(addressValue); // 1. 지갑 주소 유효성 검사 먼저
      if (valid) {
        const {
          data: { userGetNickname },
        } = await userGetNicknameMutation({
          variables: {
            address: addressValue,
          },
        });
        if (userGetNickname !== '') {
          setNickName(userGetNickname);
        } else {
          setNickName('');
        }
        handleModal();
      } else {
        setValidate(false);
      }
      //mutation
    } catch (error) {
      Vibration.vibrate(150);
      Toast.show('지갑 주소가 유효하지 않습니다\n다시 확인해주세요', {
        position: 0,
      });
    }
  };

  const navigateFunc = () => {
    //수수료 부담자가 송금자 && 보내려는 금액이 보유 코인 -990보다 큼
    modalClose();

    setTimeout(() => {
      const transferData = {
        value: coinValue,
        receiver: addressValue,
      };
      transferDataReset();
      navigation.navigate('BioMetric', {
        routeName: 'Transfer',
        transferData,
      });
    }, 300);
  };

  const nickNameFindRealTime = async (val) => {
    if (val === '') {
      setListType('lately');
      setNameInput('');
    } else if (regHex.test(val)) {
      Toast.show('닉네임 특수문자 입력 금지', { position: 0 });
      setNameInput(val.replace(regHex, ''));
    } else {
      try {
        setNameInput(val);
        //닉네임 찾기
        const {
          data: { findUser },
        } = await findUserMutation({
          variables: {
            nickName: val,
          },
        });

        setFindUserArr(findUser);
        setListType('find');
      } catch (error) {
        Toast.show(
          '서버와 통신이 원활하지 않습니다.\n잠시 후 다시 시도해 주세요',
          { position: 0 },
        );
      }
    }
  };

  const nickNameFind = async () => {
    if (nameInput === '') {
      setListType('lately');
    } else {
      try {
        //닉네임 찾기
        const {
          data: { findUser },
        } = await findUserMutation({
          variables: {
            nickName: nameInput,
          },
        });

        setFindUserArr(findUser);
        setListType('find');
      } catch (error) {
        Toast.show(
          '서버와 통신이 원활하지 않습니다.\n잠시 후 다시 시도해 주세요',
          { position: 0 },
        );
      }
    }
  };

  useEffect(() => {
    if (qrAddress) {
      setAddressValue(qrAddress);
      setTimeout(() => {
        setValidate(true);
      }, 100);
    }
    const didFocusEventListener = navigation.addListener(
      'didFocus',
      (payload) => {
        if (payload.lastState.params.qrAddress) {
          setAddressValue(payload.lastState.params.qrAddress);
        }
      },
    );
    return () => {
      didFocusEventListener.remove();
    };
  }, []);

  useEffect(() => {
    if (nameInput === '') {
      setListType('lately');
    }
  }, [nameInput]);

  useEffect(() => {
    if (validate) {
      userGetNickMutationFunc();
    }
  }, [validate]);

  const renderLately = () => {
    if (listType === 'lately') {
      if (data === null || data.latelyUsers.length === 0) {
        return (
          <TextContainer>
            <RecentlyText color={theme.grayColor} fontSize={14}>
              최근 기록이 없습니다
            </RecentlyText>
          </TextContainer>
        );
      } else {
        return (
          <>
            <FlatComponent
              style={{
                height: '42%',
              }}
            >
              <FlatList
                scrollIndicatorInsets={{ right: 1 }}
                legacyImplementation={true}
                removeClippedSubviews={true}
                scrollEnabled={true}
                nestedScrollEnabled={true} //ios에서는 기본적으로 중첩스크롤 지원하는데 안드로이드는 안하므로 이걸 넣어줘야함
                data={data.latelyUsers}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <Touchable2
                    onPress={() => {
                      setAddressValue(item.address);
                      setValidate(true);
                    }}
                  >
                    <ListView>
                      {item.nickName && item.code ? (
                        <CustomText>
                          [{item.code}]{item.nickName}
                        </CustomText>
                      ) : item.nickName && !item.code ? (
                        <CustomText>[{item.nickName}]</CustomText>
                      ) : (
                        <CustomText fontSize={14}>
                          [{`${item.address.substring(0, 30)}...`}]
                        </CustomText>
                      )}
                    </ListView>
                  </Touchable2>
                )}
              />
            </FlatComponent>
          </>
        );
      }
    } else {
      return <></>;
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS == 'ios' ? Header.HEIGHT + 20 : 50}
      behavior={Platform.OS == 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <ScrollView
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps={'handled'} //키보드가 열려도 버튼이나 input 등이가능하도록 하는 props
        style={{ height: '100%' }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <Warpper>
              <RecieverBox>
                <CoinText>받으실 분(닉네임)</CoinText>
                <NameInputBox
                  value={nameInput}
                  onChange={(val) => nickNameFindRealTime(val)}
                  returnKeyType="send" //props? 같은 느낌인가
                  autoCorrect={false} //맞춤법
                  onSubmitEditing={nickNameFind}
                ></NameInputBox>

                {listType === 'find' && findUserArr.length > 0 ? (
                  <FlatComponent
                    style={{
                      height: '42%',
                    }}
                  >
                    <FlatList
                      legacyImplementation={true}
                      removeClippedSubviews={true}
                      nestedScrollEnabled={true} //ios에서는 기본적으로 중첩스크롤 지원하는데 안드로이드는 안하므로 이걸 넣어줘야함
                      data={findUserArr}
                      keyExtractor={(_, index) => index.toString()}
                      renderItem={({ item }) => (
                        <Touchable2
                          onPress={() => {
                            setAddressValue(item.address);
                            setValidate(true);
                          }}
                        >
                          <ListView>
                            <CustomText>
                              [{item.code}]{item.nickName}
                            </CustomText>
                          </ListView>
                        </Touchable2>
                      )}
                    />
                  </FlatComponent>
                ) : null}
                <>
                  <CoinText>최근 기록</CoinText>
                  {renderLately()}
                </>

                <CoinText marginTop={20}>주소 입력</CoinText>
                <AddressInputBox
                  value={addressValue}
                  onChange={(val) => changeAddress(val)}
                  keyboardType="email-address"
                  returnKeyType="send" //props? 같은 느낌인가
                  autoCorrect={false} //맞춤법
                  onSubmitEditing={() => setValidate(true)}
                />

                <Modal
                  isVisible={modalVisible}
                  onBackdropPress={() => modalClose()}
                >
                  <ModalWarpper>
                    <ModalView style={{ height: 300 }}>
                      <ModalImage
                        style={{
                          resizeMode: 'contain',
                          height: '17%',
                        }}
                        source={require('../../assets/front/pop_up_electrical_transmission_icon.png')}
                      />
                      <ModalTextContainer>
                        <ModalText
                          fontSize={15}
                          textAlign={'center'}
                          marginBottom={10}
                          marginTop={5}
                        >
                          송금 하시겠습니까?
                        </ModalText>
                        {/* 닉네임있는 여부에 따라 팝업 텍스트 변경 */}

                        {nickName !== '' ? (
                          <>
                            <ModalText
                              style={{
                                lineHeight: 18,
                              }}
                              fontSize={'14px'}
                            >
                              {`받는이 : ${nickName}\n송금액 : ${setComma(
                                coinValue,
                              )}KRWG\n
                            수수료 : ${
                              dailyFreeTransferCount > 0
                                ? `${dailyFreeTransferCount}회 무료`
                                : `${charge}원`
                            }`}
                            </ModalText>
                          </>
                        ) : (
                          <>
                            <ModalText
                              style={{
                                lineHeight: 18,
                              }}
                              fontSize={'14px'}
                            >
                              {`받는주소 : ${addressValue.substring(
                                0,
                                15,
                              )}...\n송금액 : ${setComma(coinValue)}KRWG\n
                            수수료 : ${
                              dailyFreeTransferCount > 0
                                ? `${dailyFreeTransferCount}회 무료`
                                : `${charge}원`
                            }`}
                            </ModalText>
                          </>
                        )}
                        <Underline />

                        <ModalText textAlign={'right'}>{`KRWG 잔액 : ${setComma(
                          KRWG / 1000000 -
                            coinValue -
                            (dailyFreeTransferCount > 0 ? 0 : charge),
                        )}KRWG`}</ModalText>
                      </ModalTextContainer>
                      <ModalButtonContainer>
                        <ModalTouchable onPress={() => modalClose()}>
                          <ModalContainer>
                            <CancelButtonText>아니요</CancelButtonText>
                          </ModalContainer>
                        </ModalTouchable>

                        <ModalTouchable onPress={() => navigateFunc()}>
                          <RadiusRight>
                            <MainBGColor
                              style={{
                                borderBottomRightRadius: 10,
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
              </RecieverBox>
            </Warpper>
          </>
        </TouchableWithoutFeedback>
      </ScrollView>
      <BottomContainer>
        <ButtonContainerWarpper>
          <NextButtonContainer>
            <Touchable
              onPress={() => {
                setValidate(true);
              }}
            >
              <MainBGColor>
                <Container>
                  <ButtonText>주소 입력 완료</ButtonText>
                </Container>
              </MainBGColor>
            </Touchable>
          </NextButtonContainer>
        </ButtonContainerWarpper>
      </BottomContainer>
    </KeyboardAvoidingView>
  );
};
TransferSecond.propTypes = {
  data: PropTypes.any,
};
