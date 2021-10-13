import React from 'react';
import styled, { withTheme } from 'styled-components';
import constants from '../constants';
import PropTypes from 'prop-types';
import { ImageBackground, View } from 'react-native';

const Container = styled.View`
  flex-direction: column;
  justify-content: center;
  width: ${constants.width};
  height: ${constants.height * 0.3};
`;

const Warpper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Image = styled.Image`
  height: 40px;
`;

const TextInput = styled.Text`
  color: ${props => props.theme.whiteTextColor};
  font-size: 32px;
  padding-bottom: 1%;
`;

const Text = styled.Text`
  text-align: right;
  color: ${props => props.theme.whiteTextColor};
  font-size: 30px;
  font-weight: 100;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.borderBottomColor};
`;

const CoinTextInput = styled.Text`
  color: ${props => props.theme.whiteTextColor};
  font-size: 20px;
`;

const AddressTextInput = styled.Text`
  color: ${props => props.theme.whiteTextColor};
  font-size: 20px;
  margin-top: 15%;
  margin-bottom: 5%;
  text-align: center;
  flex: 1;
`;

const HeaderText = styled.Text`
  color: ${props => props.theme.whiteTextColor};
  text-align: left;
  font-weight: 600;
  margin-top: 8%;
  margin-left: 5%;
`;

const CoinText = styled.Text`
  align-items: flex-end;
  color: ${props => props.theme.whiteTextColor};
  font-size: 16px;
  font-weight: 100;
`;

const AddressWarpper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
`;

const Touchable = styled.TouchableOpacity`
  margin-top: 10px;
`;

const TouchableContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: 55px;
`;

const WrapperView = styled.View`
  width: ${constants.width * 0.95};
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 2%;
`;

const ContainerTwo = styled.View`
  margin-top: 10px;
  height: 55px;
  background-color: ${props => props.theme.subColor};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const HoldingInvestBox = ({
  theme,
  seeUserInvestList,
  investCancelFunc,
  // backHandlerHandel
}) => {
  const {
    id,
    amount,
    KeppIn,
    account,
    bank,
    creditNumber,
    expirationDate,
    isCancel,
  } = seeUserInvestList[0];
  // console.log("isCancel : ", isCancel);
  return (
    <>
      <View style={{ backgroundColor: theme.mainColor }}>
        <ImageBackground
          style={{ resizeMode: 'contain' }}
          // source={require("../assets/images/money_coin_bg.png")}
        >
          <Container>
            <>
              <Warpper>
                <Image
                  style={{ resizeMode: 'contain' }}
                  // source={require("../assets/images/w_icon.png")}
                />
                <TextInput>{amount}원</TextInput>
              </Warpper>
              <Warpper>
                <CoinTextInput>{KeppIn}</CoinTextInput>
                <CoinText> Coin</CoinText>
              </Warpper>
              <Warpper>
                <CoinTextInput>{expirationDate}</CoinTextInput>
              </Warpper>
            </>
          </Container>
        </ImageBackground>
      </View>
      <AddressWarpper>
        <AddressTextInput>{bank} 은행 </AddressTextInput>
        <AddressTextInput>{account}</AddressTextInput>
      </AddressWarpper>
      <WrapperView>
        <HeaderText>출금 계좌번호</HeaderText>
        <Text>{creditNumber}</Text>
        {isCancel ? (
          <>
            <ContainerTwo>
              <CoinText>이미 해지되었습니다</CoinText>
            </ContainerTwo>
          </>
        ) : (
          <>
            <Touchable
              onPress={() => {
                //해지 신청 func
                investCancelFunc(id);
              }}
            >
              <View
                style={{ borderRadius: 10, backgroundColor: theme.mainColor }}
              >
                <TouchableContainer>
                  <CoinText>해지신청</CoinText>
                </TouchableContainer>
              </View>
            </Touchable>
          </>
        )}
      </WrapperView>
    </>
  );
};

HoldingInvestBox.propTypes = {
  seeUserInvestList: PropTypes.array,
  investCancelFunc: PropTypes.func,
};

export default withTheme(HoldingInvestBox);
