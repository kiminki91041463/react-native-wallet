import React, { useState, useEffect, useCallback } from 'react';
import styled, { withTheme } from 'styled-components';
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import HoldingCoinBox from '../../components/HoldingCoinBox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CoinInputBox from '../../components/CoinInputBox';
import CoinButton from '../../components/CoinButton';
import constants from '../../constants';
import Toast from 'react-native-tiny-toast';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import { setComma } from '../../utils';

import {
  loadingTransaction,
  refreshAndRefetch,
  userBalance,
  myInfoState,
  companyState,
  transferData,
  someState,
} from '../../recoil/recoilAtoms';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { Header } from 'react-navigation-stack';

const Warpper = styled.View`
  width: ${constants.width};
  height: ${constants.height};
  align-items: center;
  margin-bottom: 55px;
`;

const Container = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const WrapperInner = styled.View`
  height: ${constants.height * 0.6 - 40};
  background-color: ${(props) => props.theme.backGroundColor};
  padding-bottom: 2%;
`;

const CoinText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: left;
  font-weight: 600;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  text-align: center;
  font-size: 17px;
`;

const ButtonContainer = styled.View`
  justify-content: center;
  flex-direction: row;
  margin: 0 auto 10px;
  width: ${constants.width * 0.9};
`;

const ButtonContainerWarpper = styled.View`
  align-items: flex-end;
  flex-direction: row;
`;

const NextButtonContainer = styled.View`
  width: 100%;
`;

const TextBoxWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const WithdrawText = styled.Text`
  color: ${(props) =>
    props.valueOver ? props.theme.blackTextColor : props.theme.warningColor};
  font-weight: 300;
  margin-top: 3%;
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
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
  return <Transfer navigation={navigation} theme={theme} />;
});

const Transfer = ({ navigation, theme }) => {
  useEffect(() => {
    console.log('Transfer useEffect');
  }, []);

  //recoil state
  const [{ refresh }, setRefreshAndRefetch] = useRecoilState(refreshAndRefetch);

  //recoil getter
  const { KRWG } = useRecoilValue(userBalance);
  const transactionLoading = useRecoilValue(loadingTransaction);
  const { dailyFreeTransferCount, nickName, code } = useRecoilValue(
    myInfoState,
  );
  const { myInfoCheck } = useRecoilValue(someState);
  const { charge } = useRecoilValue(companyState);

  //recoil setter
  const setTransferData = useSetRecoilState(transferData);

  //recoil setter func
  const transferDataSave = (coinValue) => {
    return setTransferData((prev) => ({ ...prev, coinValue }));
  };
  const refreshChange = (bool) => {
    return setRefreshAndRefetch((prev) => ({ ...prev, refresh: bool }));
  };

  //state
  const [coinValue, setCoinValue] = useState(''); //?????? input ???

  //params
  const qrAddress = navigation.getParam('qrAddress');

  const { refetch: isAuthUserRefetch } = useQuery(IS_AUTH_USER);

  // const checkCommission = async () => {
  //   setCommissionModal(!commissionModal); //ModalVisible?????? ????????? ????????? ??????
  // };

  const onRefresh = useCallback(() => {
    refreshChange(true);
  }, [refresh]);

  const handleCoinValueCheck = (value) => {
    const val = value.replace(/,/g, '');
    if (val == '') {
      setCoinValue('');
    } else if (isNaN(val)) {
      Toast.show('????????? ?????? ???????????????', { position: 0 });
      setCoinValue('');
    } else if (val <= 0) {
      Toast.show('?????? 1??? ?????? ??????????????????', { position: 0 });
    } else {
      setCoinValue(String(parseInt(val)));
    }
    // ******????????? QA??? ????????? ??????***********
    // 0?????? ???????????? ?????? ????????? ????????? ????????? ??????
    // else if (val <= 0 && val.length <2) {
    //   Toast.show('?????? 1??? ?????? ??????????????????', { position: 0 });
    // } else if (val > 2000000000 || (val <= 0 && val.length <2)) {
    //   Toast.show('20??? ????????? ????????? ???????????????', { position: 0 });
    // } else {
    //   setCoinValue(val);
    // }
  };

  const handleCoin = (value) => {
    let val = coinValue.replace(/,/g, '');
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

  const navigateFunc = async (locate) => {
    if (coinValue === '') {
      Toast.show('????????? ????????? ???????????????', { position: 0 });
      return false;
    } else if (isNaN(coinValue)) {
      Toast.show('????????? ?????? ???????????????', { position: 0 });
      return false;
    } else {
      if (
        parseInt(coinValue) + (dailyFreeTransferCount > 0 ? 0 : charge) >
        KRWG / 1000000
      ) {
        Toast.show(
          `${
            dailyFreeTransferCount > 0 ? '????????????' : '????????? + ????????????'
          } ?????? KRWG???\n????????? ??? ????????????`,
          {
            position: 0,
          },
        );
        return false;
      }
      isAuthUserRefetch().then(({ data }) => {
        if (
          data.isAuthUser.bool.every((item) => {
            return item;
          })
        ) {
          if (locate === 'TransferSecond') {
            transferDataSave(coinValue);
            navigation.navigate('TransferSecond', {
              coinValue,
              qrAddress,
            });
          }
        } else {
          Toast.show('????????? ???????????? ??????????????? ???????????? ?????????.', {
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

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? Header.HEIGHT + 20 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <ScrollView
          scrollIndicatorInsets={{ right: 1 }}
          keyboardShouldPersistTaps={'handled'} //???????????? ????????? ???????????? input ????????????????????? ?????? props
          // style={{ height: constants.height - 30 }}
          style={{ height: '100%' }}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <Warpper>
                {/* true??? ????????? == ????????? ??????, false??? ?????? ?????? == ?????? ?????? */}

                <HoldingCoinBox
                  transactionLoading={transactionLoading}
                  nickName={nickName}
                  code={code}
                />
                <WrapperInner>
                  <>
                    <TextBoxWrapper>
                      <CoinText>?????? ??????</CoinText>
                      <WithdrawText
                        valueOver={
                          dailyFreeTransferCount > 0
                            ? parseInt(coinValue) > KRWG / 1000000
                              ? false
                              : true
                            : parseInt(coinValue) > KRWG / 1000000 - charge
                            ? false
                            : true
                        }
                      >
                        {dailyFreeTransferCount > 0
                          ? parseInt(coinValue) > KRWG / 1000000
                            ? '?????? ?????? ????????? ???????????????'
                            : setComma(KRWG / 1000000) + 'KRWG ?????? ??????'
                          : parseInt(coinValue) > KRWG / 1000000 - charge
                          ? '?????? ?????? ????????? ???????????????'
                          : setComma(KRWG / 1000000 - charge) +
                            'KRWG ?????? ??????'}
                      </WithdrawText>
                    </TextBoxWrapper>
                    <CoinInputBox
                      value={setComma(coinValue)}
                      setCoinValue={setCoinValue}
                      onChange={(value) => handleCoinValueCheck(value)}
                      keyboardType="numeric"
                      returnKeyType="send"
                      autoCorrect={false}
                      text={'KRWG'}
                    />
                    <ButtonContainer>
                      <CoinButton
                        text={'+1,000'}
                        onPress={() => handleCoin(1000)}
                      />
                      <CoinButton
                        text={'+5,000'}
                        onPress={() => handleCoin(5000)}
                      />
                      <CoinButton
                        text={'+10,000'}
                        onPress={() => handleCoin(10000)}
                      />
                      <CoinButton
                        text={'+50,000'}
                        onPress={() => handleCoin(50000)}
                      />
                    </ButtonContainer>
                  </>
                </WrapperInner>
              </Warpper>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
        <ButtonContainerWarpper>
          <NextButtonContainer>
            <TouchableOpacity
              disabled={transactionLoading} //???????????? ????????? true??? ??????, touchableOpacity ????????? ?????????
              onPress={() => navigateFunc('TransferSecond')}
            >
              <MainBGColor>
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
              </MainBGColor>
            </TouchableOpacity>
          </NextButtonContainer>
        </ButtonContainerWarpper>
      </KeyboardAvoidingView>
      {/* <Modal
        isVisible={commissionModal}
        onBackdropPress={() => checkCommission()}
      >
        <ModalWarpper>
          <ModalView style={{ height: 220 }}>
            <ModalImage
              style={{
                resizeMode: 'contain',
                height: '20%',
                marginTop: 15,
              }}
              source={require('../../assets/front/pop_up_wallet_icon.png')}
            />
            <ModalTextContainer>
              <ModalText
                style={{
                  height: 70,
                }}
              >{`?????? ?????? ????????????\n ${setComma(0)} 'KRWG' ?????????`}</ModalText>
            </ModalTextContainer>
            <ModalButtonContainer>
              <ModalTouchable onPress={() => checkCommission()}>
                <RadiusRightLeft>
                  <MainBGColor
                    style={{
                      borderBottomRightRadius: 10,
                    }}
                  >
                    <ModalContainer>
                      <ButtonText>??????</ButtonText>
                    </ModalContainer>
                  </MainBGColor>
                </RadiusRightLeft>
              </ModalTouchable>
            </ModalButtonContainer>
          </ModalView>
        </ModalWarpper>
      </Modal> */}
    </>
  );
};
Transfer.propTypes = {};
