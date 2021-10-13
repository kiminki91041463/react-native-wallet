import React from 'react';
import styled from 'styled-components';

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

function ServiceCenter({ navigation }) {
  return (
    <>
      <Wrapper>
        <ButtonWrapper>
          <Touchable
            onPress={() => navigation.navigate('ServiceCenterOneToOne')}
          >
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/serviceCenter.png')}
              />
            </ImageContainer>
            <Container>
              <ButtonText>1:1 문의</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable
            onPress={() => navigation.navigate('ServiceCenterMyResult')}
          >
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/ServiceCenter_myInfo.png')}
              />
            </ImageContainer>
            <Container>
              <ButtonText>내 문의 내역</ButtonText>
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
}

export default ServiceCenter;
