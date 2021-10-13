import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components';
import LocalAuthentication from 'rn-local-authentication';

const Image = styled.Image`
  width: 30;
  margin-left: 3%;
`;

const ArrowImage = styled.Image`
  /* width: 20; */
  position: absolute;
  top: 20;
  right: 10;
`;

const Container = styled.View`
  height: 55px;
  justify-content: center;
  margin-left: 3%;
`;

const ButtonText = styled.Text`
  color: black;
  font-size: 15px;
`;

const Wrapper = styled.View`
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
`;

const ButtonWrapper = styled.View`
  margin-top: 2;
  background-color: ${props => props.theme.subColor};
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
  /* border: 1px solid blue; */
`;

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
  position: relative;
`;

const MyHistory = ({ navigation }) => {
  useEffect(() => {
    // console.log(`내역 Tab click is working `);
    // if (Platform.OS !== 'ios') {
    //   LocalAuthentication.release();
    // }
  }, []);
  return (
    <>
      <Wrapper>
        {/* <HeaderText>거래 내역</HeaderText> */}
        <ButtonWrapper>
          <Touchable onPress={() => navigation.navigate('CoinHistory')}>
            <Image
              style={{ resizeMode: 'contain' }}
              source={require('../../assets/front/transaction_details_icon1.png')}
            />
            <Container>
              <ButtonText>거래 내역</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable onPress={() => navigation.navigate('PurchaseHistory')}>
            <Image
              style={{ resizeMode: 'contain' }}
              source={require('../../assets/front/transaction_details_icon2.png')}
            />
            <Container>
              <ButtonText>구매 내역</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable onPress={() => navigation.navigate('ExchangeHistory')}>
            <Image
              style={{ resizeMode: 'contain' }}
              source={require('../../assets/front/transaction_details_icon3.png')}
            />
            <Container>
              <ButtonText>환전 내역</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
};

export default MyHistory;
