import React from 'react';
import styled, { withTheme } from 'styled-components';
import Toast from 'react-native-tiny-toast';

const Image = styled.Image`
  width: 30;
  margin-left: 3%;
`;

const ArrowImage = styled.Image`
  position: absolute;
  top: 20;
  right: 10;
`;

const ImageContainer = styled.View`
  height: 55px;
  justify-content: center;
  margin-left: 3%;
`;

const Container = styled.View`
  height: 55px;
  justify-content: center;
  margin-left: 3%;
`;

const ButtonText = styled.Text`
  color: black;
`;

const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.backGroundColor};
`;

const ButtonWrapper = styled.View`
  margin-top: 2;
  background-color: ${(props) => props.theme.subColor};
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
`;

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
  position: relative;
`;

export default withTheme(({ navigation }) => {
  return (
    <>
      <Wrapper>
        <ButtonWrapper>
          <Touchable onPress={() => navigation.navigate('IdentifyCardAuth')}>
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/identifyCardAuth.png')}
              />
            </ImageContainer>
            <Container>
              <ButtonText>주민등록증 인증</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable
            onPress={() => {
              navigation.navigate('DriverLicenseAuth');
            }}
          >
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/driverCardAuth.png')}
              />
            </ImageContainer>
            <Container>
              <ButtonText>운전면허증 인증</ButtonText>
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
});
