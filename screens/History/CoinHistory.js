import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Image, ActivityIndicator, Platform } from 'react-native';
import styled, { withTheme } from 'styled-components';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import { setComma } from '../../utils';
import constants from '../../constants';
import PropTypes from 'prop-types';
import Error from '../../components/Error';
import Modal from 'react-native-modal';
import { companyState } from '../../recoil/recoilAtoms';
import { useRecoilValue } from 'recoil';
import Toast from 'react-native-tiny-toast';
import moment from 'moment';
import Clipboard from '@react-native-community/clipboard';
// import { OptimizedFlatList } from 'react-native-optimized-flatlist';   //최적화용 FlatList 라이브러리

const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.backGroundColor};
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

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  height: 70px;
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

const ButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  text-align: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : 17)};
`;

const RadiusRightLeft = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
  border-bottom-left-radius: 10;
`;

const CancelButtonText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  text-align: center;
  font-size: 17px;
`;

const RadiusRight = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
`;

const RadiusLeft = styled.View`
  overflow: hidden;
  border-bottom-left-radius: 10;
`;

const MainBGColor = styled.View`
  background-color: ${(props) =>
    props.mainColor ? props.mainColor : props.theme.mainColor};
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

const RowSubTitle = styled.Text`
  font-size: 15;
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

const WrapperList = styled.View`
  padding: 10px 15px 0;
`;

//=============

const Text = styled.Text`
  font-size: ${(props) => (props.font ? props.font : 15)};
  background-color: ${(props) => props.theme.subColor};
  padding-left: 15px;
  padding-right: 15px;
  color: ${(props) => (props.color ? props.color : 'black')};
`;

const NoListContainer = styled.View`
  height: ${constants.height * 0.8};
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CancelWrapper = styled.View`
  flex-direction: row;
`;

const CancelText = styled.Text`
  font-size: 13;
  color: ${(props) => props.theme.grayColor};
`;

const SEE_COIN_HISTORY = gql`
  query seeCoinHistory($page: Int!) {
    seeCoinHistory(page: $page) {
      id
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

export default withTheme(({ theme, navigation }) => {
  const [page, setPage] = useState(0);
  const [dataExist, setDataExist] = useState(true);
  const { loading, error, data, fetchMore } = useQuery(SEE_COIN_HISTORY, {
    variables: {
      page: 0,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const loadMore = async () => {
    try {
      if (dataExist) {
        await fetchMore({
          variables: {
            page: page + 1,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.seeCoinHistory.length > 0) {
              return Object.assign({}, prev, {
                seeCoinHistory: [
                  ...prev.seeCoinHistory,
                  ...fetchMoreResult.seeCoinHistory,
                ],
              });
            } else {
              setDataExist(false);
              return prev;
            }
          },
        });
        setPage((page) => page + 1);
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (error) {
    return <Error navigation={navigation} />;
  }

  if (data && data.seeCoinHistory) {
    return (
      <CoinHistory
        loading={loading}
        data={data}
        theme={theme}
        navigation={navigation}
        loadMore={loadMore}
        setDataExist={setDataExist}
      />
    );
  } else {
    return (
      <Container>
        <ActivityIndicator
          size={'large'}
          color={theme.activityIndicatorColor}
        />
      </Container>
    );
  }
});

const CoinHistory = ({
  loading,
  theme,
  data,
  navigation,
  loadMore,
  setDataExist,
}) => {
  //state
  const [negativeModal, setNegativeModal] = useState(false); //거절 물음표 Modal 보일지 말지 정함
  const [fastExchangeModal, setFastExchangeModal] = useState(false); //거절 물음표 Modal 보일지 말지 정함
  const [exchangeId, setExchangeId] = useState(null);
  const [modalType, setModalType] = useState(null);

  //recoil
  const { bank, creditNumber } = useRecoilValue(companyState);

  const openNegative = async () => {
    setNegativeModal(!negativeModal);
  };

  useEffect(() => {
    if (data.seeCoinHistory.length === 0) {
      setDataExist(false);
    }
  }, []);

  const exchangeModalOpen = async (exchangeId, type) => {
    setModalType(type);
    setExchangeId(exchangeId);
    exchangeModalControl();
  };

  const exchangeModalControl = async () => {
    setFastExchangeModal(!fastExchangeModal);
  };

  const navigateFunc = () => {
    exchangeModalControl();
    if (!exchangeId) {
      Toast.show('환전 내역 정보가 올바르지 않습니다', { position: 0 });
      return false;
    }
    setTimeout(() => {
      navigation.navigate('BioMetric', {
        routeName: modalType === 'fast' ? 'fastExchange' : 'cancelExchange',
        exchangeId,
      });
    }, 500);
  };

  const extractor = useCallback((_, index) => index.toString(), []);
  const renderItem = useCallback(({ item }) => {
    return (
      <>
        <WrapperList style={{ width: constants.width }}>
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
                    item.exchange.exchangeStatus === 'CANCEL_WAIT')) ||
                (item.enumType === '구매' &&
                  item.purchase.purchaseStatus === 'WAIT') ||
                ((item.enumType === '입금' || item.enumType === '출금') &&
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
                    item.exchange.exchangeStatus !== 'CANCEL_WAIT' ? (
                      <Touchable
                        onPress={() =>
                          exchangeModalOpen(item.exchange.id, 'fast')
                        }
                      >
                        <TinyBox width={100} bgColor={theme.mainColor}>
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
                  ((item.enumType === '입금' || item.enumType === '출금') &&
                    item.transferStatus === 'SUCCESS') ? (
                  <TinyBox bgColor={theme.mainColor}>
                    <TinyBoxText color={theme.whiteTextColor}>완료</TinyBoxText>
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
                    <TinyBoxText color={theme.whiteTextColor}>취소</TinyBoxText>
                  </TinyBox>
                ) : null}
              </Box>
              {/* 여기에 환전 취소 버튼이 들어가야됑 */}
              {item.enumType === '구매' ? (
                <CancelWrapper>
                  <Touchable
                    onPress={() => {
                      Clipboard.setString(creditNumber.replace(/-/g, ''));
                      Platform.OS === 'ios' || Platform.Version > 25
                        ? Toast.show('계좌가 복사되었습니다', {
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
                      source={require('../../assets/front/cancel_icon.png')}
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
                  <RowSubTitle>{setComma(item.value)}원</RowSubTitle>
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
                        {item.exchange.exchangeStatus === 'CANCEL_WAIT'
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
                        {setComma(item.exchange.estimateExchangeValue)}원
                      </RowSubTitle>
                    </RowBox>
                    <RowBox>
                      <RowTitle>예정일</RowTitle>
                      <RowColon>:</RowColon>
                      <RowSubTitle>
                        {item.exchange.isFastExchange
                          ? '빠른 환전'
                          : moment(item.exchange.estimateExchange).format(
                              'YYYY-M-D(dd)',
                            )}
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
                  <RowSubTitle>{setComma(item.charge)}원</RowSubTitle>
                </RowBox>
              </>
            ) : null}
          </FlatBox>
        </WrapperList>
      </>
    );
  }, []);

  return (
    <>
      <Wrapper>
        <>
          <FlatList
            ListEmptyComponent={
              <NoListContainer>
                <Image
                  style={{ resizeMode: 'contain', height: '25%' }}
                  source={require('../../assets/front/no_history.png')}
                />
                <Text color="#dcdcdc">거래 내역이 없습니다.</Text>
              </NoListContainer>
            }
            scrollIndicatorInsets={{ right: 1 }}
            legacyImplementation={true} //가상화 뷰 사용
            removeClippedSubviews={true} //화면에서 벗어난 item을 unmount
            initialNumToRender={8} //최초에 render할 item 갯수(※화면에 item이 몇개 들어갈 수 있는지 연산하는 작업을 줄여줌)
            data={data.seeCoinHistory}
            keyExtractor={extractor}
            renderItem={renderItem}
            refreshing={true}
            onEndReached={loadMore}
            onEndReachedThreshold={0.01}
            disableVirtualization={false} //비정상적인 스크롤 동작 방지
            ListFooterComponent={
              loading ? (
                <Container>
                  <ActivityIndicator
                    size={'large'}
                    color={theme.activityIndicatorColor}
                  />
                </Container>
              ) : null
            }
          />
        </>
        {/* )} */}
      </Wrapper>
      <Modal
        useNativeDriver={true}
        isVisible={negativeModal}
        onBackdropPress={() => openNegative()}
      >
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
        useNativeDriver={true}
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
    </>
  );
};

CoinHistory.propTypes = {
  data: PropTypes.any,
  refetch: PropTypes.func,
  fetchMore: PropTypes.func,
  month: PropTypes.any,
  setMonth: PropTypes.func,
};
