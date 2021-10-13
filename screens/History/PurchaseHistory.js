import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import styled, { withTheme } from 'styled-components';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import constants from '../../constants';
import { setComma } from '../../utils';
import PropTypes from 'prop-types';
import Error from '../../components/Error';
import Modal from 'react-native-modal';
import { companyState } from '../../recoil/recoilAtoms';
import { useRecoilValue } from 'recoil';
import 'moment/locale/ko';
import moment from 'moment';

//======모달 전용=======

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

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  text-align: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : 17)};
`;
//=============

//=======내역 박스 전용======
const RowBox = styled.View`
  flex-direction: row;
  margin: 1px 0;
  align-items: center;
`;

const FlatBox = styled.View`
  border-width: 1;
  border-color: ${(props) => props.theme.lightGrayColor};
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
  width: 40;
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

const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.backGroundColor};
  padding-bottom: 10;
`;

const WrapperList = styled.View`
  padding: 10px 15px 0;
`;

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
`;
//=============

const Text = styled.Text`
  font-size: 15;
  color: ${(props) => (props.color ? props.color : props.theme.blackTextColor)};
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const NoListContainer = styled.View`
  height: ${constants.height * 0.8};
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Image = styled.Image``;

const SEE_MY_PURCHASE_LIST = gql`
  {
    seeMyPurchaseList {
      requestAmount
      purchaseStatus
      isCheck
      createdAt
    }
  }
`;

export default withTheme(({ theme, navigation }) => {
  const { loading, error, data } = useQuery(SEE_MY_PURCHASE_LIST, {
    fetchPolicy: 'network-only',
  });

  if (loading)
    return (
      <Container>
        <ActivityIndicator
          size={'large'}
          color={theme.activityIndicatorColor}
        />
      </Container>
    );

  if (error) {
    return <Error navigation={navigation} />;
  }

  if (data && data.seeMyPurchaseList)
    return <PurchaseHistory data={data.seeMyPurchaseList} theme={theme} />;
});

const PurchaseHistory = ({ theme, data }) => {
  useEffect(() => {
    moment.locale('ko');
  }, []);
  const [negativeModal, setNegativeModal] = useState(false); //거절 물음표 Modal 보일지 말지 정함
  const openNegative = async () => {
    setNegativeModal(!negativeModal);
  };

  //recoil
  const { bank, creditNumber } = useRecoilValue(companyState);

  //새로운 보내기,받기 이벤트 리슨
  const renderSection = () => {
    return (
      <>
        {data.length === 0 ? (
          <NoListContainer>
            <Image
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/no_history.png')}
            />
            <Text color={theme.grayColor}>구매 내역이 없습니다</Text>
          </NoListContainer>
        ) : (
          <FlatList
            scrollIndicatorInsets={{ right: 1 }}
            legacyImplementation={true}
            removeClippedSubviews={true}
            initialNumToRender={14}
            data={data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <WrapperList>
                <FlatBox>
                  <Date>{item.createdAt}</Date>
                  <RowBox
                    style={{
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <SectionTitle>[구매]</SectionTitle>
                      {item.purchaseStatus === 'WAIT' ? (
                        <TinyBox bgColor={theme.sanjiBackColor}>
                          <TinyBoxText color={theme.sanjiTextColor}>
                            대기
                          </TinyBoxText>
                        </TinyBox>
                      ) : item.purchaseStatus === 'APPROVE' ? (
                        <TinyBox bgColor={theme.mainColor}>
                          <TinyBoxText color={theme.whiteTextColor}>
                            완료
                          </TinyBoxText>
                        </TinyBox>
                      ) : (
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
                      )}
                    </Box>
                  </RowBox>
                  <RowBox>
                    <RowTitle>신청금액</RowTitle>
                    <RowColon>:</RowColon>
                    <RowSubTitle>{setComma(item.requestAmount)}원</RowSubTitle>
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
                </FlatBox>
              </WrapperList>
            )}
          />
        )}
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
      </>
    );
  };

  return (
    <>
      <Wrapper>{renderSection()}</Wrapper>
    </>
  );
};
PurchaseHistory.propTypes = {
  data: PropTypes.any,
};
