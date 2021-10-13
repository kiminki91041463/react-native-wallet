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
    const check3 = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55]*$/;
    if (value === '') {
      setState((state) => ({ ...state, nameInput: '' }));
    } else if (!check3.test(value)) {
      Toast.show('예금주는 한글, 영어로 입력해주세요', { position: 0 });
      return false;
    } else if (value.length > 20) {
      Toast.show('예금주는 최대 20글자 입니다.', { position: 0 });
      return false;
    } else {
      setState((state) => ({ ...state, nameInput: value }));
    }
  };

  const creditNumberInputCheck = (value) => {
    if (value == '') {
      // Toast.show("계좌번호를 입력해주세요", { position: 0 });
      setState((state) => ({ ...state, creditNumberInput: '' }));
      return false;
    } else if (value.includes('.')) {
      Toast.show('계좌번호에 .은 입력할 수 없습니다', { position: 0 });
      return false;
    } else if (isNaN(value)) {
      Toast.show('계좌번호는 숫자만 입력해주세요', { position: 0 });
      return false;
    } else if (value.length > 18) {
      Toast.show('계좌번호는 최대 18글자 입니다.', { position: 0 });
      return false;
    } else {
      setState((state) => ({ ...state, creditNumberInput: value }));
    }
  };

  const handleModal = async () => {
    setModalVisible(!modalVisible); //ModalVisible값이 현재의 반대로 바뀜
  };

  const navigateFunc = () => {
    setModalVisible(!modalVisible);
    // 일단 바이오 매트릭을 거치는 걸로 해보자 ※환전에서 어차피 써먹어야하기 때문
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
    const check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|]/gi;
    if (
      exchangeDataParam.coinValue == '' ||
      parseInt(exchangeDataParam.coinValue) === 0
    ) {
      Vibration.vibrate(150);
      Toast.show('환전하려는 금액을 입력하세요', { position: 0 });
      return false;
    } else if (isNaN(exchangeDataParam.coinValue)) {
      Vibration.vibrate(150);
      Toast.show('환전금액은 숫자만 입력 가능합니다', { position: 0 });
      return false;
    } else if (parseInt(exchangeDataParam.coinValue) < 10000) {
      Vibration.vibrate(150);
      Toast.show(`최소 환전 금액은 10,000KRWG 입니다`, {
        position: 0,
      });
      return false;
    } else if (selectBank === null) {
      Vibration.vibrate(150);
      Toast.show('은행을 선택해 주세요', { position: 0 });
      return false;
    } else if (state.nameInput === '') {
      Vibration.vibrate(150);
      Toast.show('예금주명을 입력하세요', { position: 0 });
      return false;
    } else if (!check.test(state.nameInput)) {
      Vibration.vibrate(150);
      Toast.show('예금주는 한글, 영어로 입력해주세요', { position: 0 });
      return false;
    } else if (state.nameInput.length > 20) {
      Vibration.vibrate(150);
      Toast.show('예금주는 최대 20자 입니다', { position: 0 });
      return false;
    } else if (state.creditNumberInput === '') {
      Vibration.vibrate(150);
      Toast.show('출금 계좌번호를 입력하세요', { position: 0 });
      return false;
    } else if (state.creditNumberInput.length > 18) {
      Vibration.vibrate(150);
      Toast.show('출금 계좌번호는 최대 18자 입니다', { position: 0 });
      return false;
    } else if (isNaN(state.creditNumberInput)) {
      Toast.show('계좌번호는 숫자만 입력해주세요', { position: 0 });
    } else {
      if (parseInt(exchangeDataParam.coinValue) > KRWG / 1000000) {
        Vibration.vibrate(150);
        Toast.show('보유한 KRWG보다 많은 KRWG를 환전할 수 없습니다', {
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
                    <ButtonText>환전 신청</ButtonText>
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
          {/* //키보드가 열려도 버튼이나 input 등이가능하도록 하는 props */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <Warpper>
                <WrapperInner>
                  <>
                    <TextWrapper>
                      <BankText>은행 선택</BankText>
                      <Touchable onPress={() => setBankModalVisible(true)}>
                        <Image
                          source={require('../../assets/front/plus1.png')}
                        />
                      </Touchable>
                    </TextWrapper>
                    <CreditNumberInputBox
                      placeholder={'+ 버튼을 눌러주세요'}
                      editable={false}
                      disabled={true}
                      value={selectBank ? selectBank : ''}
                      onChange={() => null}
                    ></CreditNumberInputBox>
                    <CoinText>계좌 번호</CoinText>
                    <CreditNumberInputBox
                      value={state.creditNumberInput}
                      onChange={(val) => creditNumberInputCheck(val)}
                      keyboardType="numeric"
                      returnKeyType="next"
                      autoCorrect={false} //맞춤법
                    ></CreditNumberInputBox>
                    <CoinText>예금주</CoinText>
                    <StringInputBox
                      value={state.nameInput}
                      onChange={(val) => nameInputCheck(val)}
                      returnKeyType="next"
                      autoCorrect={false} //맞춤법
                    />
                    <VerticalBox marginTop={'30px'} marginBottom={'20px'}>
                      <Image2
                        style={{ resizeMode: 'contain' }}
                        source={require('../../assets/front/warnning.png')}
                      />
                    </VerticalBox>
                    <VerticalBox marginTop={'10px'} alignItems={'center'}>
                      <Text fontSize={'17px'} fontWeight={'bold'}>
                        환전 신청시 유의사항
                      </Text>
                      <Text color={theme.grayColor} marginTop={'8px'}>
                        {`비 정상적인 환전 취소가 확인 될 경우 거래정지 또는\n가상자산 회수등의 조치를 취할 수 있으므로\n신중한 환전 취소를 바랍니다 "이용약관 명시"`}
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
                            환전신청 하시겠습니까?
                          </ModalText>
                          <ModalText>{`예금주 : ${
                            state.nameInput
                          } \n 계좌번호 : ${
                            state.creditNumberInput
                          } \n 반환 금액 : ${setComma(
                            parseInt(exchangeDataParam.coinValue),
                          )}KRWG\n 예상 출금액 : ${setComma(
                            exchangeDataParam.estimateExchangeValue,
                          )}원`}</ModalText>
                        </ModalTextContainer>
                        <ModalButtonContainer>
                          <ModalTouchable onPress={() => handleModal()}>
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
