import React, { useState, useCallback } from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  RefreshControl,
  Vibration,
  Platform,
  ActivityIndicator,
} from 'react-native';

import {
  refreshAndRefetch,
  loadingTransaction,
  myInfoState,
  userBalance,
  someState,
} from '../../recoil/recoilAtoms';
import { useRecoilValue, useRecoilState } from 'recoil';

import { Switch } from 'react-native-switch';
import HoldingCoinBox from '../../components/HoldingCoinBox';
import CoinInputBox from '../../components/CoinInputBox';
import styled, { withTheme } from 'styled-components';
import constants from '../../constants';
import Modal from 'react-native-modal';
import { Header } from 'react-navigation-stack';
import Toast from 'react-native-tiny-toast';
import { setComma } from '../../utils';
import CoinButton from '../../components/CoinButton';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import Error from '../../components/Error';

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

const WithdrawText = styled.Text`
  color: ${(props) => props.theme.warningColor};
  font-weight: 300;
  margin-top: 3%;
  margin-right: 5%;
`;

const TextBoxWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const CheckBoxMiniWrapper = styled.View`
  flex: 1;
  margin: 0 auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${constants.width * 0.9};
`;

const CoinText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  font-weight: 600;
  margin-left: 5%;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)};
`;

const CheckBoxText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  font-weight: 600;
  align-items: flex-end;
  margin-right: 5%;
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

const ModalButtonContainer2 = styled.View`
  /* justify-content: flex-end;
  flex: 1; */
  flex-direction: row;
`;

const ModalWarpper = styled.View`
  align-items: center;
`;

const ModalImage = styled.Image`
  width: ${(props) => (props.width ? props.width : '15%')};
  margin-top: 10px;
`;

const ModalTextContainerCommit = styled.View`
  width: 240;
  justify-content: center;
`;

const ModalTextBorder = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'center')};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.whiteTextColor};
`;

const ModalTouchable2 = styled.TouchableOpacity`
  width: 100%;
  height: 55px;
`;

const ModalContainer = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.borderBottomColor};
`;

const CoinButtonContainer = styled.View`
  justify-content: center;
  flex-direction: row;
  margin: 10px auto;
  width: ${constants.width * 0.9};
`;

const MiniBox = styled.View`
  width: ${constants.width};
  display: flex;
  align-items: flex-end;
`;

const MiniTouchable = styled.TouchableOpacity`
  margin-right: 5%;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 15px;
`;

const MiniContainer = styled.View`
  justify-content: center;
  margin: 5px;
`;

const View = styled.View`
  height: 30px;
  justify-content: center;
  align-items: center;
`;

const RadiusRightLeft = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
  border-bottom-left-radius: 10;
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const MainBGColorSwitch = styled.View`
  background-color: ${(props) =>
    props.BgColor ? props.BgColor : props.theme.mainColor};
  border-radius: 15;
  width: 50px;
  height: 30px;
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

const Image = styled.Image`
  width: 25%;
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 0)};
  height: ${constants.height * 0.15};
  margin-bottom: 15px;
  margin: 0 auto;
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

const GET_TODAY_EXCHANGE_AMOUNT = gql`
  query getTodayExchangeAmount {
    getTodayExchangeAmount
  }
`;

const IS_AUTH_USER = gql`
  query isAuthUser {
    isAuthUser {
      bool
      status
    }
  }
`;

export default withTheme(({ theme, navigation }) => {
  const { loading, error, data } = useQuery(GET_TODAY_EXCHANGE_AMOUNT, {
    fetchPolicy: 'network-only',
  });

  console.log({ data });

  if (loading)
    return (
      <Container>
        <ActivityIndicator
          size={'large'}
          color={theme.activityIndicatorColor}
        />
      </Container>
    );

  if (error) return <Error navigation={navigation} route={'home'} />;

  if (!loading && !error) {
    return (
      <ExchangeRequest
        navigation={navigation}
        theme={theme}
        getTodayExchangeAmount={data.getTodayExchangeAmount}
      />
    );
  } else {
    return null;
  }
});

const ExchangeRequest = ({ navigation, theme, getTodayExchangeAmount }) => {
  const [coinValue, setCoinValue] = useState(''); //코인 input 값
  const { refetch: isAuthUserRefetch } = useQuery(IS_AUTH_USER);

  //state
  const [commissionModal, setCommissionModal] = useState(false); //Modal 보일지 말지 정함
  const [isFastExchange, setIsFastExchange] = useState(false);

  //recoil
  const [{ refresh }, setRecoilRefresh] = useRecoilState(refreshAndRefetch);

  //recoil getter
  const { code, nickName } = useRecoilValue(myInfoState);
  const transactionLoading = useRecoilValue(loadingTransaction);
  const { KRWG } = useRecoilValue(userBalance);
  const { myInfoCheck } = useRecoilValue(someState);

  //recoil setter func
  const refreshChangeFunc = (bool) => {
    return setRecoilRefresh((prev) => ({ ...prev, refresh: bool }));
  };

  const toggleSwitch = () => {
    setIsFastExchange(!isFastExchange);
  };

  const checkCommission = async () => {
    setCommissionModal(!commissionModal); //ModalVisible값이 현재의 반대로 바뀜
  };

  const onRefresh = useCallback(() => {
    refreshChangeFunc(true);
  }, [refresh]);

  const handleCoin = (value) => {
    const val = value.replace(/,/g, '');
    if (val == '') {
      setCoinValue('');
      return false;
    } else if (isNaN(val)) {
      Toast.show('숫자만 입력 가능합니다', { position: 0 });
      setCoinValue('');
      return false;
    } else {
      setCoinValue(String(parseInt(val)));
    }
  };

  const handleCoinInput = (value) => {
    let val = coinValue;
    if (val === '') {
      val = 0;
    } else {
      val = parseInt(val);
    }
    return setCoinValue((c) =>
      c == ''
        ? String(parseInt(0) + parseInt(value))
        : String(parseInt(c) + parseInt(value)),
    );
  };

  const NextButtonOnPress = () => {
    // const check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|]/gi;
    if (coinValue == '' || parseInt(coinValue) === 0) {
      Vibration.vibrate(150);
      Toast.show('환전하려는 금액을 입력하세요', { position: 0 });
      return false;
    } else if (isNaN(coinValue)) {
      Vibration.vibrate(150);
      Toast.show('환전금액은 숫자만 입력 가능합니다', { position: 0 });
      return false;
    } else if (parseInt(coinValue) < 10000) {
      Vibration.vibrate(150);
      Toast.show(`최소 환전 금액은 10,000KRWG 입니다`, {
        position: 0,
      });
      return false;
    } else {
      isAuthUserRefetch().then(({ data }) => {
        console.log({ data });
        if (
          data.isAuthUser.bool.every((item) => {
            return item;
          })
        ) {
          if (parseInt(coinValue) > KRWG / 1000000) {
            Vibration.vibrate(150);
            Toast.show('보유한 KRWG보다 많은 KRWG를 환전할 수 없습니다', {
              position: 0,
            });
            return false;
          }
          setTimeout(() => {
            const exchangeData = {
              coinValue,
              isFastExchange,
              estimateExchangeValue: isFastExchange
                ? parseInt(coinValue * 0.98)
                : getTodayExchangeAmount + parseInt(coinValue) > 3000000
                ? parseInt(coinValue * 0.991)
                : parseInt(coinValue),
            };
            navigation.navigate('ExchangeSecond', {
              exchangeData,
              headerTitle: exchangeData.estimateExchangeValue,
            });
          }, 50);
        } else {
          Toast.show('환전을 하시려면 본인인증을 완료해야 합니다. ', {
            position: 0,
          });
          if (myInfoCheck) {
            return new Promise((resolve, reject) => {
              navigation.navigate('MyInfo', { screen: 'Certification' });
              resolve();
            }).then(() => {
              return navigation.navigate('Certification');
            });
          } else {
            return setTimeout(() => {
              return navigation.navigate('MyInfoBioMetric');
            }, 2000);
          }
        }
      });
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
                    <ButtonText>
                      {coinValue === ''
                        ? '환전 금액 입력'
                        : `${setComma(parseInt(coinValue))}KRWG 환전하기`}
                    </ButtonText>
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
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        >
          {/* //키보드가 열려도 버튼이나 input 등이가능하도록 하는 props */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <Warpper>
                <WrapperInner>
                  <>
                    <HoldingCoinBox
                      transactionLoading={transactionLoading}
                      nickName={nickName}
                      code={code}
                    />
                    <TextBoxWrapper>
                      <CoinText marginTop={'3%'}>환전 금액</CoinText>
                      <WithdrawText>
                        {coinValue < 10000
                          ? ''
                          : `예상 출금액 : ${setComma(
                              isFastExchange
                                ? parseInt(coinValue * 0.98)
                                : getTodayExchangeAmount + parseInt(coinValue) >
                                  3000000
                                ? parseInt(coinValue * 0.991)
                                : parseInt(coinValue),
                            )}KRWG`}
                      </WithdrawText>
                    </TextBoxWrapper>
                    <CoinInputBox
                      value={setComma(coinValue)}
                      setCoinValue={setCoinValue}
                      onChange={(value) => handleCoin(value)}
                      keyboardType="numeric"
                      returnKeyType="send"
                      autoCorrect={false}
                      text={'KRWG'}
                    />

                    {/* ====================================== */}
                    <CoinButtonContainer>
                      <CoinButton
                        text={'+1,000'}
                        onPress={() => handleCoinInput(1000)}
                      />
                      <CoinButton
                        text={'+5,000'}
                        onPress={() => handleCoinInput(5000)}
                      />
                      <CoinButton
                        text={'+10,000'}
                        onPress={() => handleCoinInput(10000)}
                      />
                      <CoinButton
                        text={'+50,000'}
                        onPress={() => handleCoinInput(50000)}
                      />
                    </CoinButtonContainer>
                    <CheckBoxMiniWrapper>
                      {/* 얘가 스위치 토글로 변경된다 */}
                      <CheckBoxText>빠른 환전</CheckBoxText>
                      <Switch
                        value={isFastExchange}
                        onValueChange={() => {
                          toggleSwitch();
                        }}
                        backgroundActive={'#e2e2e2'}
                        backgroundInactive={'#e2e2e2'}
                        renderInsideCircle={() =>
                          isFastExchange ? (
                            <MainBGColorSwitch>
                              <View>
                                <Text color={'white'}>On</Text>
                              </View>
                            </MainBGColorSwitch>
                          ) : (
                            <MainBGColorSwitch BgColor={theme.AppLockOffColor}>
                              <View>
                                <Text color={'white'}>Off</Text>
                              </View>
                            </MainBGColorSwitch>
                          )
                        }
                      />
                    </CheckBoxMiniWrapper>
                    <VerticalBox marginTop={'30px'} marginBottom={'20px'}>
                      <Image
                        style={{ resizeMode: 'contain' }}
                        source={require('../../assets/front/exchangeImage.png')}
                      />
                    </VerticalBox>
                    <VerticalBox marginTop={'10px'} alignItems={'center'}>
                      <Text fontSize={'17px'} fontWeight={'bold'}>
                        빠른 환전이란?
                      </Text>
                      <Text color={theme.grayColor} marginTop={'8px'}>
                        {`수수료 2%를 지불하여 빠른 시일 내에\n출금받는 서비스입니다(영업일 기준)`}
                      </Text>
                    </VerticalBox>
                  </>
                </WrapperInner>
              </Warpper>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
        {renderButton()}
      </KeyboardAvoidingView>
      <Modal
        isVisible={commissionModal}
        onBackdropPress={() => checkCommission()}
      >
        <ModalWarpper>
          <ModalView style={{ height: 200 }}>
            <ModalImage
              style={{
                resizeMode: 'contain',
                height: '20%',
                marginTop: 15,
              }}
              source={require('../../assets/front/pop_up_wallet_icon.png')}
            />
            <ModalTextContainerCommit>
              <ModalTextBorder
                style={{
                  height: 70,
                }}
              >{`환전 금액의 2% 수수료로 지불하여\n5일 내에 출금받는 서비스입니다\n(영업일 기준)`}</ModalTextBorder>
            </ModalTextContainerCommit>
            <ModalButtonContainer2>
              <ModalTouchable2 onPress={() => checkCommission()}>
                <RadiusRightLeft>
                  <MainBGColor
                    style={{
                      borderBottomRightRadius: 10,
                    }}
                  >
                    <ModalContainer>
                      <ButtonText>확인</ButtonText>
                    </ModalContainer>
                  </MainBGColor>
                </RadiusRightLeft>
              </ModalTouchable2>
            </ModalButtonContainer2>
          </ModalView>
        </ModalWarpper>
      </Modal>
    </>
  );
};
ExchangeRequest.propTypes = {};
