import React from 'react';
import styled, { withTheme } from 'styled-components';
import constants from '../constants';
import { ImageBackground, ActivityIndicator, View } from 'react-native';
import { setComma } from '../utils';
import PropTypes from 'prop-types';
import { userBalance } from '../recoil/recoilAtoms';
import { useRecoilValue } from 'recoil';

const Main = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: ${constants.width};
  height: ${constants.height * 0.3};
`;

const CoinBoxText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  font-weight: bold;
  position: absolute;
  padding: 10px;
  height: ${constants.height * 0.3};
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${constants.height * 0.3};
`;

const Money = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  padding-top: 3%;
`;

const TextInput = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  font-size: 30px;
  font-weight: bold;
  padding-bottom: 1%;
`;

const Text = styled.Text`
  align-items: flex-start;
  color: ${(props) => props.theme.whiteTextColor};
  font-size: 20px;
  font-weight: 400;
  width: ${constants.width * 0.2};
`;

const GifContainer = styled.View`
  position: absolute;
  bottom: 0;
  width: ${constants.width};
  height: ${constants.height * 0.25};
  overflow: hidden;
`;

const Gif = styled.Image`
  width: 100%;
  height: 100%;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const ImageContainer = styled.View`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

const Image = styled.Image`
  width: 100%;
  height: 100%;
`;

const HoldingCoinBox = ({
  theme,
  code,
  nickName,
  transactionLoading = false,
}) => {
  const { KRWG, TRX } = useRecoilValue(userBalance);
  return (
    <Main>
      <ImageBackground
        style={{ resizeMode: 'contain' }}
        source={require('../assets/front/remittance_bg.png')}
      >
        <Container>
          <CoinBoxText>
            {nickName !== null ? `[${code}] ${nickName}님` : null}
          </CoinBoxText>
          <Wrapper>
            {/* {isLoading ? ( */}
            <>
              {transactionLoading ? (
                <GifContainer>
                  <Gif
                    style={{ resizeMode: 'contain' }}
                    source={require('../assets/front/transactionLoading300.gif')}
                  />
                </GifContainer>
              ) : KRWG === null ? (
                <>
                  <ActivityIndicator
                    size={'large'}
                    color={theme.activityIndicatorColor}
                  />
                </>
              ) : (
                <View
                  style={{
                    paddingTop: '15%',
                  }}
                >
                  <Money>
                    <RowContainer>
                      <ImageContainer>
                        <Image
                          source={require('../assets/front/lf_icon.png')}
                          resizeMode={'contain'}
                        />
                      </ImageContainer>
                      <TextInput>
                        {KRWG > 0 ? setComma(KRWG / 1000000) : 0}
                      </TextInput>
                      <Text> KRWG</Text>
                    </RowContainer>
                  </Money>
                  <Money>
                    <RowContainer>
                      <ImageContainer>
                        <Image
                          source={require('../assets/front/tron_icon.png')}
                          resizeMode={'contain'}
                        />
                      </ImageContainer>
                      <TextInput>
                        {TRX > 0 ? setComma(TRX / 1000000) : 0}
                      </TextInput>
                      <Text> TRX</Text>
                    </RowContainer>
                  </Money>
                </View>
              )}
            </>
            {/* ) : (
              <>
                <ActivityIndicator size={"large"} color={"#bbbbbb"} />
              </>
            )} */}
          </Wrapper>
        </Container>
      </ImageBackground>
    </Main>
  );
};
export default withTheme(HoldingCoinBox);

HoldingCoinBox.propTypes = {
  setAssertCoinValue: PropTypes.func,
  code: PropTypes.string,
  nickName: PropTypes.string,
  transactionLoading: PropTypes.bool,
};
