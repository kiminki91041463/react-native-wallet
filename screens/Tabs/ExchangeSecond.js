import React, { useState } from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Vibration,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { loadingTransaction, userBalance } from '../../recoil/recoilAtoms';
import { useRecoilValue } from 'recoil';

import styled, { withTheme } from 'styled-components';
import constants from '../../constants';
import Modal from 'react-native-modal';
import { Header } from 'react-navigation-stack';
import Toast from 'react-native-tiny-toast';
// import DropdownBank from '../../components/DropdownBank';
import DropdownBankModal from '../../components/DropdownBankModal';
import CreditNumberInputBox from '../../components/CreditNumberInputBox';
import StringInputBox from '../../components/StringInputBox';
import { setComma } from '../../utils';

const Warpper = styled.View`
  width: ${constants.width};
  align-items: center;
  margin-bottom: 55px;
`;

const Container = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const WrapperInner = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${(props) => props.theme.backGroundColor};
  padding-bottom: 2%;
`;

const TextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BankText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  font-weight: 600;
  margin-left: 5%;
`;

const CoinText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  font-weight: 600;
  margin-left: 5%;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 20)};
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
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

const Touchable = styled.TouchableOpacity`
  justify-content: flex-end;
`;

const ModalView = styled.View`
  background-color: ${(props) => props.theme.subColor};
  align-items: center;
  border-radius: 11px;
  width: 300;
  justify-content: space-between;
`;

const ModalViewBank = styled.View`
  background-color: ${(props) => props.theme.subColor};
  align-items: center;
  border-radius: 11px;
  width: 100%;
  justify-content: space-between;
`;

const ModalButtonContainer = styled.View`
  justify-content: flex-end;
  flex: 1;
  flex-direction: row;
`;

const ModalWarpper = styled.View`
  align-items: center;
`;

const ModalWarpperBank = styled.View``;

const Image = styled.Image`
  width: 18px;
  resize-mode: contain;
  margin-left: 10;
  margin-right: 10;
`;

const Image2 = styled.Image`
  width: 25%;
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 0)};
  height: ${constants.height * 0.15};
  margin-bottom: 15px;
  margin: 0 auto;
`;

const ModalImage = styled.Image`
  width: ${(props) => (props.width ? props.width : '15%')};
  margin-top: 10px;
`;

const ModalTextContainer = styled.View`
  width: 240;
  justify-content: center;
  height: 100;
  padding: 1%;
`;

const ModalText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : '14px')};
  margin: ${(props) => (props.margin ? props.margin : 0)};
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

const CancelButtonText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: center;
  font-size: 17px;
`;
const InputBoxWrapper = styled.View``;

const RadiusRight = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const VerticalBox = styled.View`
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : 'flex-start'};
  align-items: ${(props) => (props.alignItems ? props.alignItems : 'stretch')};
  background-color: ${(props) => (props.bgColor ? props.bgColor : 'white')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : 0)};
  padding-bottom: ${(props) => (props.paddingBottom ? props.paddingBottom : 0)};
  padding-right: ${(props) => (props.paddingRight ? props.paddingRight : 0)};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : 0)};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)};
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)};
  margin-right: ${(props) => (props.marginRight ? props.marginRight : 0)};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)};
  border: ${(props) => (props.border ? props.border : 'none')};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 0)};
  height: ${(props) => (props.height ? props.height : 'auto')};
  width: ${(props) => (props.width ? props.width : 'auto')};
`;

const Text = styled.Text`
  color: ${(props) => (props.color ? props.color : 'black')};
  font-size: ${(props) => (props.fontSize ? props.fontSize : '14px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 'normal')};
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : 0)};
  padding-bottom: ${(props) => (props.paddingBottom ? props.paddingBottom : 0)};
  padding-right: ${(props) => (props.paddingRight ? props.paddingRight : 0)};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : 0)};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)};
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)};
  width: ${(props) => (props.width ? props.width : 'auto')};
  min-width: ${(props) => (props.minWidth ? props.minWidth : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
`;

export default withTheme(({ theme, navigation }) => {
  return <ExchangeSecond navigation={navigation} theme={theme} />;
});

const ExchangeSecond = ({ navigation, theme }) => {
  //state
  const [modalVisible, setModalVisible] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(true);
  const [selectBank, setSelectBank] = useState(null);
  const [state, setState] = useState({
    nameInput: '',
    creditNumberInput: '',
  });

  //recoil
  const transactionLoading = useRecoilValue(loadingTransaction);
  const { KRWG } = useRecoilValue(userBalance);

  //params
  const exchangeDataParam = navigation.getParam('exchangeData');

  const nameInputCheck = (value) => {
    const check3 = /^[???-???|???-???|a-z|A-Z|\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55]*$/;
    if (value === '') {
      setState((state) => ({ ...state, nameInput: '' }));
    } else if (!check3.test(value)) {
      Toast.show('???????????? ??????, ????????? ??????????????????', { position: 0 });
      return false;
    } else if (value.length > 20) {
      Toast.show('???????????? ?????? 20?????? ?????????.', { position: 0 });
      return false;
    } else {
      setState((state) => ({ ...state, nameInput: value }));
    }
  };

  const creditNumberInputCheck = (value) => {
    if (value == '') {
      // Toast.show("??????????????? ??????????????????", { position: 0 });
      setState((state) => ({ ...state, creditNumberInput: '' }));
      return false;
    } else if (value.includes('.')) {
      Toast.show('??????????????? .??? ????????? ??? ????????????', { position: 0 });
      return false;
    } else if (isNaN(value)) {
      Toast.show('??????????????? ????????? ??????????????????', { position: 0 });
      return false;
    } else if (value.length > 18) {
      Toast.show('??????????????? ?????? 18?????? ?????????.', { position: 0 });
      return false;
    } else {
      setState((state) => ({ ...state, creditNumberInput: value }));
    }
  };

  const handleModal = async () => {
    setModalVisible(!modalVisible); //ModalVisible?????? ????????? ????????? ??????
  };

  const navigateFunc = () => {
    setModalVisible(!modalVisible);
    // ?????? ????????? ???????????? ????????? ?????? ????????? ??????????????? ????????? ?????????????????? ??????
    setTimeout(() => {
      const exchangeData = {
        requestAmount: exchangeDataParam.coinValue,
        account: state.nameInput,
        creditNumber: state.creditNumberInput,
        bank: selectBank,
        isFastExchange: exchangeDataParam.isFastExchange,
      };
      navigation.navigate('BioMetric', {
        routeName: 'coinExchange',
        exchangeData,
      });
    }, 500);
  };

  const NextButtonOnPress = () => {
    const check = /[???-???|???-???|???-???|a-z|A-Z|]/gi;
    if (
      exchangeDataParam.coinValue == '' ||
      parseInt(exchangeDataParam.coinValue) === 0
    ) {
      Vibration.vibrate(150);
      Toast.show('??????????????? ????????? ???????????????', { position: 0 });
      return false;
    } else if (isNaN(exchangeDataParam.coinValue)) {
      Vibration.vibrate(150);
      Toast.show('??????????????? ????????? ?????? ???????????????', { position: 0 });
      return false;
    } else if (parseInt(exchangeDataParam.coinValue) < 10000) {
      Vibration.vibrate(150);
      Toast.show(`?????? ?????? ????????? 10,000KRWG ?????????`, {
        position: 0,
      });
      return false;
    } else if (selectBank === null) {
      Vibration.vibrate(150);
      Toast.show('????????? ????????? ?????????', { position: 0 });
      return false;
    } else if (state.nameInput === '') {
      Vibration.vibrate(150);
      Toast.show('??????????????? ???????????????', { position: 0 });
      return false;
    } else if (!check.test(state.nameInput)) {
      Vibration.vibrate(150);
      Toast.show('???????????? ??????, ????????? ??????????????????', { position: 0 });
      return false;
    } else if (state.nameInput.length > 20) {
      Vibration.vibrate(150);
      Toast.show('???????????? ?????? 20??? ?????????', { position: 0 });
      return false;
    } else if (state.creditNumberInput === '') {
      Vibration.vibrate(150);
      Toast.show('?????? ??????????????? ???????????????', { position: 0 });
      return false;
    } else if (state.creditNumberInput.length > 18) {
      Vibration.vibrate(150);
      Toast.show('?????? ??????????????? ?????? 18??? ?????????', { position: 0 });
      return false;
    } else if (isNaN(state.creditNumberInput)) {
      Toast.show('??????????????? ????????? ??????????????????', { position: 0 });
    } else {
      if (parseInt(exchangeDataParam.coinValue) > KRWG / 1000000) {
        Vibration.vibrate(150);
        Toast.show('????????? KRWG?????? ?????? KRWG??? ????????? ??? ????????????', {
          position: 0,
        });
        return false;
      }
      handleModal();
    }
  };

  const renderButton = () => {
    return (
      <BottomContainer>
        <ButtonContainerWarpper>
          <NextButtonContainer>
            <MainBGColor>
              <Touchable
                disabled={transactionLoading}
                onPress={() => {
                  NextButtonOnPress();
                }}
              >
                {transactionLoading ? (
                  <Container>
                    <ActivityIndicator
                      size="large"
                      color={theme.activityIndicatorColor}
                    />
                  </Container>
                ) : (
                  <Container>
                    <ButtonText>?????? ??????</ButtonText>
                  </Container>
                )}
              </Touchable>
            </MainBGColor>
          </NextButtonContainer>
        </ButtonContainerWarpper>
      </BottomContainer>
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? Header.HEIGHT + 20 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : null}
        style={{ height: '100%' }}
      >
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          scrollIndicatorInsets={{ right: 1 }}
          style={{ height: '100%' }}
          // refreshControl={
          //   <RefreshControl refreshing={refreshState} onRefresh={onRefresh} />
          // }
        >
          {/* //???????????? ????????? ???????????? input ????????????????????? ?????? props */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <Warpper>
                <WrapperInner>
                  <>
                    <TextWrapper>
                      <BankText>?????? ??????</BankText>
                      <Touchable onPress={() => setBankModalVisible(true)}>
                        <Image
                          source={require('../../assets/front/plus1.png')}
                        />
                      </Touchable>
                    </TextWrapper>
                    <CreditNumberInputBox
                      placeholder={'+ ????????? ???????????????'}
                      editable={false}
                      disabled={true}
                      value={selectBank ? selectBank : ''}
                      onChange={() => null}
                    ></CreditNumberInputBox>
                    <CoinText>?????? ??????</CoinText>
                    <CreditNumberInputBox
                      value={state.creditNumberInput}
                      onChange={(val) => creditNumberInputCheck(val)}
                      keyboardType="numeric"
                      returnKeyType="next"
                      autoCorrect={false} //?????????
                    ></CreditNumberInputBox>
                    <CoinText>?????????</CoinText>
                    <StringInputBox
                      value={state.nameInput}
                      onChange={(val) => nameInputCheck(val)}
                      returnKeyType="next"
                      autoCorrect={false} //?????????
                    />
                    <VerticalBox marginTop={'30px'} marginBottom={'20px'}>
                      <Image2
                        style={{ resizeMode: 'contain' }}
                        source={require('../../assets/front/warnning.png')}
                      />
                    </VerticalBox>
                    <VerticalBox marginTop={'10px'} alignItems={'center'}>
                      <Text fontSize={'17px'} fontWeight={'bold'}>
                        ?????? ????????? ????????????
                      </Text>
                      <Text color={theme.grayColor} marginTop={'8px'}>
                        {`??? ???????????? ?????? ????????? ?????? ??? ?????? ???????????? ??????\n???????????? ???????????? ????????? ?????? ??? ????????????\n????????? ?????? ????????? ???????????? "???????????? ??????"`}
                      </Text>
                    </VerticalBox>
                  </>
                  <Modal
                    isVisible={modalVisible}
                    onBackdropPress={() => handleModal()}
                  >
                    <ModalWarpper>
                      <ModalView style={{ height: 230 }}>
                        <ModalImage
                          style={{
                            resizeMode: 'contain',
                            height: '20%',
                          }}
                          source={require('../../assets/front/pop_up_currency_exchange_icon.png')}
                        />
                        <ModalTextContainer>
                          <ModalText margin={'10px'}>
                            ???????????? ???????????????????
                          </ModalText>
                          <ModalText>{`????????? : ${
                            state.nameInput
                          } \n ???????????? : ${
                            state.creditNumberInput
                          } \n ?????? ?????? : ${setComma(
                            parseInt(exchangeDataParam.coinValue),
                          )}KRWG\n ?????? ????????? : ${setComma(
                            exchangeDataParam.estimateExchangeValue,
                          )}???`}</ModalText>
                        </ModalTextContainer>
                        <ModalButtonContainer>
                          <ModalTouchable onPress={() => handleModal()}>
                            <ModalContainer>
                              <CancelButtonText>?????????</CancelButtonText>
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
                                  <ButtonText>??????</ButtonText>
                                </ModalContainer>
                              </MainBGColor>
                            </RadiusRight>
                          </ModalTouchable>
                        </ModalButtonContainer>
                      </ModalView>
                    </ModalWarpper>
                  </Modal>
                  <Modal
                    style={{
                      justifyContent: 'flex-end',
                      width: '100%',
                      margin: 0,
                    }}
                    isVisible={bankModalVisible}
                    onBackdropPress={() => setBankModalVisible(false)}
                  >
                    <ModalWarpperBank>
                      <ModalViewBank style={{ height: 450 }}>
                        <DropdownBankModal
                          setSelectBank={setSelectBank}
                          setBankModalVisible={setBankModalVisible}
                        />
                      </ModalViewBank>
                    </ModalWarpperBank>
                  </Modal>
                </WrapperInner>
              </Warpper>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
        {renderButton()}
      </KeyboardAvoidingView>
    </>
  );
};
ExchangeSecond.propTypes = {};
