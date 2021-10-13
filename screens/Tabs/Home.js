import React, { useState, useEffect, useCallback } from 'react';
import {
  Platform,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  View,
  Image,
  Text,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-community/clipboard';
import styled, { withTheme } from 'styled-components';
import HoldingCoinBox from '../../components/HoldingCoinBox';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import constants from '../../constants';
import PropTypes from 'prop-types';
import Error from '../../components/Error';
import { setComma } from '../../utils';

import {
  refreshAndRefetch,
  loadingTransaction,
  companyState,
  myInfoState,
  userBalance,
} from '../../recoil/recoilAtoms';
import { useRecoilState } from 'recoil';

import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-generator';
import { Dimensions } from 'react-native';
import { Root, Toast } from 'native-base';
import Toast2 from 'react-native-tiny-toast';
import moment from 'moment';
import { getUserBalance } from '../../Web3Connecter';

const Warpper = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.backGroundColor};
  align-items: center;
  /* height: ${constants.height * 0.9}; */
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const MainContainer = styled.View`
  align-items: center;
`;

const AddressWarpper = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 15px auto;
  padding-left: 5;
  width: ${constants.width * 0.9};
`;

const CancelWrapper = styled.View`
  flex-direction: row;
`;

const AddressText = styled.Text`
  flex: 1;
  text-align: left;
  color: ${(props) => props.theme.blackTextColor};
  font-size: 13px;
`;

const RadiusRight = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
`;

const RadiusLeft = styled.View`
  overflow: hidden;
  border-bottom-left-radius: 10;
`;

const ModalWarpper = styled.View`
  align-items: center;
`;

const ModalView = styled.View`
  background-color: ${(props) => props.theme.subColor};
  align-items: center;
  border-radius: 11px;
  width: 300;
  justify-content: space-between;
`;

const ModalImage = styled.Image`
  width: ${(props) => (props.width ? props.width : '15%')};
  margin-top: 10px;
`;

const ModalTextContainer = styled.View`
  width: 240;
  justify-content: center;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)};
`;

const ModalText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'center')};
  border: 1px solid white;
`;

const ModalButtonContainer = styled.View`
  flex-direction: row;
`;
const ModalTouchable = styled.TouchableOpacity`
  width: ${(props) => (props.width ? props.width : '50%')};
  height: 55px;
`;

const ModalContainer = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.borderBottomColor};
`;

const RadiusRightLeft = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
  border-bottom-left-radius: 10;
`;

const MiniContainer = styled.View`
  justify-content: center;
  margin: 5px;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  text-align: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : 17)};
`;

const QRAddress = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  font-size: 12px;
  margin-top: 10px;
  text-align: left;
  padding-left: 5;
`;

const MainBGColor = styled.View`
  background-color: ${(props) =>
    props.mainColor ? props.mainColor : props.theme.mainColor};
`;

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
`;

//=============
const RowBox = styled.View`
  flex-direction: row;
  margin: 1px 0;
  align-items: center;
`;

const FlatBox = styled.View`
  border-width: 1;
  border-color: ${(props) => props.theme.borderBottomColor};
  padding: 5px;
  height: auto;
`;

const SectionTitle = styled.Text`
  font-size: 16;
  font-weight: bold;
`;

const TinyBox = styled.View`
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : props.theme.lightGrayColor};
  width: ${(props) => (props.width ? props.width : '40px')};
  height: 18;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
`;

const TinyBoxText = styled.Text`
  font-size: 14px;
  color: ${(props) => (props.color ? props.color : props.theme.blackTextColor)};
`;

const RowTitle = styled.Text`
  width: 60;
  font-size: 15;
`;

const CancelButtonText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: center;
  font-size: 17px;
`;

const RowSubTitle = styled.Text`
  font-size: 15;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : 'flex-start'};
  color: ${(props) => (props.textColor ? props.textColor : 'black')};
`;

const RowColon = styled.Text`
  padding-right: 5;
`;

const Box = styled.View`
  flex-direction: row;
`;

const Date = styled.Text`
  font-size: 13;
  color: ${(props) => props.theme.lightGrayColor};
  position: absolute;
  bottom: 5%;
  right: 1%;
`;

const CancelText = styled.Text`
  font-size: 13;
  color: ${(props) => props.theme.grayColor};
`;

const WrapperList = styled.View`
  padding: 10px 15px 0;
`;

//=============

const SEE_MY_INFO = gql`
  query seeMyInfo {
    seeMyInfo {
      nickName
      code
      dailyFreeTransferCount
    }
  }
`;

const GET_COMPANY_DATA = gql`
  {
    getCompanyData {
      bank
      creditNumber
      charge
    }
  }
`;

const SEE_COIN_HISTORY_HOME = gql`
  query seeCoinHistoryHome {
    seeCoinHistoryHome {
      enumType
      sender
      receiver
      value
      charge
      mark
      createdAt
      transferStatus
      exchange {
        id
        estimateExchange
        requestAmount
        account
        exchangeStatus
        isFastExchange
        isWorking
        estimateExchangeValue
      }
      purchase {
        id
        requestAmount
        purchaseStatus
      }
    }
  }
`;

//HOC
export default withTheme(({ theme, navigation }) => {
  //recoil
  const [myInfoStateVal, setRecoilMyInfoState] = useRecoilState(myInfoState);

  const [{ bank, creditNumber }, setRecoilCompanyState] = useRecoilState(
    companyState,
  );

  //recoil setter func
  const companyStateChangeFunc = (data) => {
    return setRecoilCompanyState((prev) => ({
      ...prev,
      bank: data.bank,
      creditNumber: data.creditNumber,
      charge: data.charge,
    }));
  };

  const myInfoStateChangeFunc = (data) => {
    return setRecoilMyInfoState(data);
  };

  const { loading, error, data } = useQuery(SEE_MY_INFO, {
    fetchPolicy: 'network-only',
  });

  const { loading: loading2, data: data2 } = useQuery(GET_COMPANY_DATA, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (!loading2) {
      companyStateChangeFunc(data2.getCompanyData);
    }
    if (
      !loading &&
      myInfoStateVal.dailyFreeTransferCount !==
        data.seeMyInfo.dailyFreeTransferCount
    ) {
      myInfoStateChangeFunc(data.seeMyInfo);
    }
  }, [loading2, loading]);

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

  if (!loading && !error)
    return (
      <Home
        myInfoState={myInfoStateVal}
        navigation={navigation}
        theme={theme}
        bank={bank}
        creditNumber={creditNumber}
      />
    );
});

const Home = ({ navigation, theme, myInfoState, bank, creditNumber }) => {
  //state
  const [walletAddress, setWalletAddress] = useState(null);
  const [assertCoinValue, setAssertCoinValue] = useState(null); //보유코인을 넘어선 입력값을 제한하기 위함
  const [negativeModal, setNegativeModal] = useState(false); //거절 물음표 Modal 보일지 말지 정함
  const [qrModalVisible, setQrModalVisible] = useState(false); // QR Modal 보일지 말지 정함
  const [fastExchangeModal, setFastExchangeModal] = useState(false); //거절 물음표 Modal 보일지 말지 정함
  const [exchangeId, setExchangeId] = useState(null);
  const [modalType, setModalType] = useState(null);

  //recoil
  const [transactionLoading, setRecoilLoadingTransaction] = useRecoilState(
    loadingTransaction,
  );
  const [{ refresh }, setRecoilRefresh] = useRecoilState(refreshAndRefetch);
  const [userBalanceVal, setRecoilUserBalance] = useRecoilState(userBalance);

  //recoil setter func
  const transactionLoadingDone = () => {
    return setRecoilLoadingTransaction(false);
  };
  const setRefreshFunc = (bool) => {
    return setRecoilRefresh((prev) => ({ ...prev, refresh: bool }));
  };
  const setUserBalance = (data) => {
    return setRecoilUserBalance((prev) => ({
      ...prev,
      KRWG: data.KRWG,
      TRX: data.TRX,
    }));
  };

  const { loading, data: data3, refetch: refetchCoinHistory } = useQuery(
    SEE_COIN_HISTORY_HOME,
    {
      fetchPolicy: 'network-only',
    },
  );

  const onRefresh = useCallback(() => {
    refetchCoinHistory();
    setRefreshFunc(true);
  }, [refresh]);

  const openNegative = async () => {
    setNegativeModal(!negativeModal);
  };

  const exchangeModalOpen = async (exchangeId, type) => {
    setModalType(type);
    setExchangeId(exchangeId);
    exchangeModalControl();
  };

  const exchangeModalControl = async () => {
    setFastExchangeModal(!fastExchangeModal);
  };

  const getAsyncStorage = async () => {
    const walletStr = await AsyncStorage.getItem('WALLETS');
    const wallet = JSON.parse(walletStr);
    setWalletAddress(wallet.address);
    _getUserBalanceFunc(wallet.address);
  };

  useEffect(() => {
    console.log('Home useEffect');
    getAsyncStorage();
    navigation.addListener('willFocus', () => {
      refetchCoinHistory();
    });
  }, []);

  const navigateFunc = () => {
    exchangeModalControl();
    if (!exchangeId) {
      Toast2.show('환전 내역 정보가 올바르지 않습니다', { position: 0 });
      return false;
    }
    setTimeout(() => {
      navigation.navigate('BioMetric', {
        routeName: modalType === 'fast' ? 'fastExchange' : 'cancelExchange',
        exchangeId,
      });
    }, 500);
  };

  useEffect(() => {
    if (refresh) {
      refetchCoinHistory();
      _getUserBalanceFunc(walletAddress);
      setTimeout(() => {
        setRefreshFunc(false);
      }, 300);
    }
  }, [refresh]);

  const _getUserBalanceFunc = async (addressParam) => {
    try {
      if (!addressParam) throw Error('address === null');
      const result = await getUserBalance(addressParam);
      if (result != userBalanceVal) {
        setUserBalance(result);
        //새로운 보유 in이 기존과 다를 때만, loadingTransaction을 false로 변경한다
        setTimeout(() => {
          transactionLoadingDone();
        }, 50);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Warpper>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          scrollIndicatorInsets={{ right: 1 }}
          style={{ height: '100%' }}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        >
          <HoldingCoinBox
            transactionLoading={transactionLoading}
            assertCoinValue={assertCoinValue}
            setAssertCoinValue={setAssertCoinValue}
            nickName={myInfoState.nickName}
            code={myInfoState.code}
          />
          <MainContainer>
            <View
              style={{
                flexDirection: 'row',
                width: constants.width * 0.9,
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <Text style={{ fontWeight: '600' }}>내 지갑 주소</Text>
              {walletAddress ? (
                <View>
                  <Touchable onPress={() => setQrModalVisible(true)}>
                    <Text style={{ color: theme.grayColor }}>더 보기 &gt;</Text>
                  </Touchable>
                </View>
              ) : (
                <View></View>
              )}
            </View>
            <AddressWarpper>
              <AddressText>{walletAddress}</AddressText>
            </AddressWarpper>
            <View
              style={{
                flexDirection: 'row',
                width: constants.width * 0.9,
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <Text style={{ fontWeight: '600' }}>최근 거래 내역</Text>
              <View>
                <Touchable onPress={() => navigation.navigate('CoinHistory')}>
                  <Text style={{ color: theme.grayColor }}>더 보기 &gt;</Text>
                </Touchable>
              </View>
            </View>

            {loading ? (
              <>
                <ActivityIndicator
                  size={'large'}
                  color={theme.activityIndicatorColor}
                />
              </>
            ) : (
              <View style={{ marginBottom: 50 }}>
                {data3.seeCoinHistoryHome.map((item, index) => {
                  return (
                    <WrapperList key={index} style={{ width: constants.width }}>
                      <FlatBox>
                        <Date>{item.createdAt}</Date>
                        <RowBox
                          style={{
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box>
                            <SectionTitle>[{item.enumType}]</SectionTitle>
                            {(item.enumType === '환전' &&
                              (item.exchange.exchangeStatus === 'SUCCESS' ||
                                item.exchange.exchangeStatus === 'WAIT' ||
                                item.exchange.exchangeStatus ===
                                  'CANCEL_WAIT')) ||
                            (item.enumType === '구매' &&
                              item.purchase.purchaseStatus === 'WAIT') ||
                            ((item.enumType === '입금' ||
                              item.enumType === '출금') &&
                              item.transferStatus === 'WAIT') ? (
                              <>
                                <TinyBox bgColor={theme.sanjiBackColor}>
                                  <TinyBoxText color={theme.sanjiTextColor}>
                                    대기
                                  </TinyBoxText>
                                </TinyBox>
                                {item.enumType === '환전' &&
                                !item.exchange.isFastExchange &&
                                item.exchange.exchangeStatus !== 'APPROVE' &&
                                item.exchange.exchangeStatus !==
                                  'CANCEL_WAIT' ? (
                                  <Touchable
                                    onPress={() =>
                                      exchangeModalOpen(
                                        item.exchange.id,
                                        'fast',
                                      )
                                    }
                                  >
                                    <TinyBox
                                      width={100}
                                      bgColor={theme.mainColor}
                                    >
                                      <TinyBoxText color={theme.whiteTextColor}>
                                        빠르게환전하기
                                      </TinyBoxText>
                                    </TinyBox>
                                  </Touchable>
                                ) : null}
                              </>
                            ) : (item.enumType === '환전' &&
                                item.exchange.exchangeStatus === 'APPROVE') ||
                              (item.enumType === '구매' &&
                                item.purchase.purchaseStatus === 'APPROVE') ||
                              ((item.enumType === '입금' ||
                                item.enumType === '출금') &&
                                item.transferStatus === 'SUCCESS') ? (
                              <TinyBox bgColor={theme.mainColor}>
                                <TinyBoxText color={theme.whiteTextColor}>
                                  완료
                                </TinyBoxText>
                              </TinyBox>
                            ) : (item.enumType === '환전' &&
                                (item.exchange.exchangeStatus === 'FAIL' ||
                                  item.exchange.exchangeStatus === 'DENIED')) ||
                              (item.enumType === '구매' &&
                                (item.purchase.purchaseStatus === 'DENIED' ||
                                  item.purchase.purchaseStatus === 'FAIL')) ? (
                              <>
                                <Touchable onPress={() => openNegative()}>
                                  <TinyBox bgColor={theme.redColor}>
                                    <TinyBoxText color={theme.whiteTextColor}>
                                      거절
                                    </TinyBoxText>
                                  </TinyBox>
                                  <Image
                                    style={{
                                      width: 17,
                                      height: 17,
                                      marginLeft: 5,
                                    }}
                                    source={require('../../assets/front/question_mark_red.png')}
                                  />
                                </Touchable>
                              </>
                            ) : item.enumType === '환전' &&
                              item.exchange.exchangeStatus === 'CANCEL' ? (
                              <TinyBox bgColor={theme.redColor}>
                                <TinyBoxText color={theme.whiteTextColor}>
                                  취소
                                </TinyBoxText>
                              </TinyBox>
                            ) : null}
                          </Box>
                          {item.enumType === '구매' ? (
                            <CancelWrapper>
                              <Touchable
                                onPress={() => {
                                  Clipboard.setString(
                                    creditNumber.replace(/-/g, ''),
                                  );
                                  Platform.OS === 'ios' || Platform.Version > 25
                                    ? Toast2.show('계좌가 복사되었습니다', {
                                        position: 0,
                                      })
                                    : null;
                                }}
                              >
                                <CancelText>계좌복사</CancelText>
                                <Image
                                  style={{
                                    width: 14,
                                    height: 14,
                                    marginLeft: 3,
                                  }}
                                  source={require('../../assets/front/copy_icon.png')}
                                />
                              </Touchable>
                            </CancelWrapper>
                          ) : null}
                          {item.enumType === '환전' &&
                          !item.exchange.isWorking &&
                          (item.exchange.exchangeStatus === 'WAIT' ||
                            item.exchange.exchangeStatus === 'SUCCESS') ? (
                            <CancelWrapper>
                              <Touchable
                                onPress={() =>
                                  exchangeModalOpen(item.exchange.id, 'cancel')
                                }
                              >
                                <CancelText>환전취소</CancelText>
                                <Image
                                  style={{
                                    width: 14,
                                    height: 14,
                                    marginLeft: 3,
                                  }}
                                  source={require('../../assets/front/close_btn.png')}
                                />
                              </Touchable>
                            </CancelWrapper>
                          ) : null}
                        </RowBox>
                        {item.enumType === '구매' ? (
                          <>
                            <RowBox>
                              <RowTitle>신청금액</RowTitle>
                              <RowColon>:</RowColon>
                              <RowSubTitle>
                                {setComma(item.value)}원
                              </RowSubTitle>
                            </RowBox>
                            <RowBox>
                              <RowTitle>입금은행</RowTitle>
                              <RowColon>:</RowColon>
                              <RowSubTitle>{bank} [무통장]</RowSubTitle>
                            </RowBox>
                            <RowBox>
                              <RowTitle>입금계좌</RowTitle>
                              <RowColon>:</RowColon>
                              <RowSubTitle>{creditNumber}</RowSubTitle>
                            </RowBox>
                          </>
                        ) : item.enumType === '환전' ? (
                          <>
                            {item.exchange.exchangeStatus === 'CANCEL_WAIT' ||
                            item.exchange.exchangeStatus === 'CANCEL' ? (
                              <>
                                <RowBox>
                                  <RowTitle>취소금액</RowTitle>
                                  <RowColon>:</RowColon>
                                  <RowSubTitle>
                                    {setComma(item.exchange.requestAmount)}
                                    KRWG
                                  </RowSubTitle>
                                </RowBox>
                                <RowBox>
                                  <RowTitle>진행상태</RowTitle>
                                  <RowColon>:</RowColon>
                                  <RowSubTitle>
                                    {item.exchange.exchangeStatus ===
                                    'CANCEL_WAIT'
                                      ? '환전 취소 대기중'
                                      : '환전 취소 완료'}
                                  </RowSubTitle>
                                </RowBox>
                                <RowBox>
                                  <RowTitle>예금주</RowTitle>
                                  <RowColon>:</RowColon>
                                  <RowSubTitle justifyContent={'space-between'}>
                                    {item.exchange.account}
                                  </RowSubTitle>
                                </RowBox>
                              </>
                            ) : (
                              <>
                                <RowBox>
                                  <RowTitle>예정금액</RowTitle>
                                  <RowColon>:</RowColon>
                                  <RowSubTitle>
                                    {setComma(
                                      item.exchange.estimateExchangeValue,
                                    )}
                                    원
                                  </RowSubTitle>
                                </RowBox>
                                <RowBox>
                                  <RowTitle>예정일</RowTitle>
                                  <RowColon>:</RowColon>
                                  <RowSubTitle>
                                    {item.exchange.isFastExchange
                                      ? '빠른 환전'
                                      : moment(
                                          item.exchange.estimateExchange,
                                        ).format('YYYY-M-D(dd)')}
                                  </RowSubTitle>
                                </RowBox>
                                <RowBox>
                                  <RowTitle>예금주</RowTitle>
                                  <RowColon>:</RowColon>
                                  <RowSubTitle justifyContent={'space-between'}>
                                    {item.exchange.account}
                                  </RowSubTitle>
                                </RowBox>
                              </>
                            )}
                          </>
                        ) : item.enumType === '입금' ? (
                          <>
                            <RowBox>
                              <RowTitle>보낸이</RowTitle>
                              <RowColon>:</RowColon>
                              <RowSubTitle>{item.sender}</RowSubTitle>
                            </RowBox>
                            <RowBox>
                              <RowTitle>입금금액</RowTitle>
                              <RowColon>:</RowColon>
                              <RowSubTitle>
                                {item.mark}
                                {setComma(item.value)}
                                {'KRWG'}
                              </RowSubTitle>
                            </RowBox>
                            <RowBox>
                              <RowTitle></RowTitle>
                              <RowColon></RowColon>
                              <RowSubTitle></RowSubTitle>
                            </RowBox>
                          </>
                        ) : item.enumType === '출금' ? (
                          <>
                            <RowBox>
                              <RowTitle>받는이</RowTitle>
                              <RowColon>:</RowColon>
                              <RowSubTitle>{item.receiver}</RowSubTitle>
                            </RowBox>
                            <RowBox>
                              <RowTitle>출금금액</RowTitle>
                              <RowColon>:</RowColon>
                              <RowSubTitle>
                                {item.mark}
                                {setComma(item.value)}
                                {'KRWG'}
                              </RowSubTitle>
                            </RowBox>
                            <RowBox>
                              <RowTitle>수수료</RowTitle>
                              <RowColon>:</RowColon>
                              <RowSubTitle>
                                {setComma(item.charge)}원
                              </RowSubTitle>
                            </RowBox>
                          </>
                        ) : null}
                      </FlatBox>
                    </WrapperList>
                  );
                })}
              </View>
            )}
          </MainContainer>
        </ScrollView>
      </Warpper>
      <Modal isVisible={negativeModal} onBackdropPress={() => openNegative()}>
        <ModalWarpper>
          <ModalView style={{ height: 220 }}>
            <ModalImage
              style={{
                resizeMode: 'contain',
                height: '20%',
                marginTop: 15,
              }}
              source={require('../../assets/front/popup_1.png')}
            />
            <ModalTextContainer>
              <ModalText
                style={{
                  height: 70,
                }}
              >
                {`승인이 거절되었습니다.\n1:1문의센터 또는 02-1833-8603\n그루 고객센터로 문의주세요.`}
              </ModalText>
            </ModalTextContainer>
            <ModalButtonContainer>
              <ModalTouchable width={'100%'} onPress={() => openNegative()}>
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
              </ModalTouchable>
            </ModalButtonContainer>
          </ModalView>
        </ModalWarpper>
      </Modal>
      <Modal
        isVisible={fastExchangeModal}
        onBackdropPress={() => exchangeModalControl()}
      >
        <ModalWarpper>
          <ModalView style={{ height: 180 }}>
            <ModalImage
              style={{
                resizeMode: 'contain',
                height: '20%',
                marginTop: 15,
              }}
              source={require('../../assets/front/popup_1.png')}
            />
            <ModalTextContainer>
              <ModalText
                style={{
                  height: 70,
                  paddingTop: 15,
                }}
              >
                {modalType === 'fast'
                  ? '빠른 환전으로 변경하시겠습니까?\n(예정금액 2% 차감)'
                  : '해당 내역을 취소하시겠습니까?\n(관리자 승인 후, KRWG 돌려받음)'}
              </ModalText>
            </ModalTextContainer>
            <ModalButtonContainer>
              <ModalTouchable onPress={() => exchangeModalControl()}>
                <RadiusLeft>
                  <MainBGColor
                    mainColor={'white'}
                    style={{
                      borderBottomLeftRadius: 10,
                    }}
                  >
                    <ModalContainer>
                      <CancelButtonText>아니요</CancelButtonText>
                    </ModalContainer>
                  </MainBGColor>
                </RadiusLeft>
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
        isVisible={qrModalVisible}
        onBackdropPress={() => {
          setQrModalVisible(!qrModalVisible);
          // Platform.OS === 'ios' ? setQrModalVisible(!qrModalVisible) : null
        }}
      >
        <Root>
          <View
            style={{
              position: 'absolute',
              top: Dimensions.get('screen').height * 0.08,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: 'auto',
            }}
          >
            <Text
              style={{
                fontWeight: '600',
                width: Dimensions.get('screen').width * 0.8,
                alignItems: 'flex-start',
                marginTop: 15,
                marginBottom: 10,
              }}
            >
              내 지갑 주소 (QR 코드)
            </Text>
            <View
              style={{
                width: Dimensions.get('screen').width * 0.8,
                height: Dimensions.get('screen').width * 0.8,
                justifyContent: 'center',
              }}
            >
              <QRCode
                useWebKit={true}
                value={walletAddress}
                size={Dimensions.get('screen').width * 0.8}
                bgColor="black"
                fgColor="white"
              />
            </View>
            <View
              style={{
                paddingBottom: 85,
                marginTop: 30,
              }}
            >
              <Text style={{ fontWeight: '600' }}>내 지갑 주소</Text>
              <QRAddress>{walletAddress}</QRAddress>

              <View
                style={{
                  width: Dimensions.get('screen').width * 0.8,
                  alignItems: 'flex-end',
                }}
              >
                <Touchable
                  style={{
                    borderRadius: 15,
                    backgroundColor: theme.mainColor,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    Clipboard.setString(walletAddress);
                    Platform.OS === 'ios' || Platform.Version > 25
                      ? Toast.show({
                          text: '주소가 복사되었습니다',
                          position: 'top',
                          textStyle: { textAlign: 'center' },
                        })
                      : null;
                  }}
                >
                  <MainBGColor style={{ borderRadius: 10 }}>
                    <MiniContainer>
                      <ButtonText fontSize={13}>복사하기</ButtonText>
                    </MiniContainer>
                  </MainBGColor>
                </Touchable>
              </View>
            </View>
            <Touchable
              style={{
                height: 55,
                backgroundColor: theme.mainColor,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                width: '100%',
                bottom: -1,
              }}
              onPress={() => setQrModalVisible(false)}
            >
              <Text style={{ color: 'white', fontSize: 24 }}>닫기</Text>
            </Touchable>
          </View>
        </Root>
      </Modal>
    </>
  );
};
Home.propTypes = {
  data: PropTypes.any,
  refetch: PropTypes.func,
};
