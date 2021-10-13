import React, { useState } from 'react';
import styled, { withTheme } from 'styled-components';
import Toast from 'react-native-tiny-toast';
import constants from '../../constants';
import CheckBox from 'react-native-check-box';
import { ScrollView } from 'react-native';
import { personalText } from '../../policy';

const ImageContainer = styled.View`
  height: 55px;
  justify-content: center;
  margin-left: 3%;
`;

const Container = styled.View`
  justify-content: center;
`;

const BottomContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: 55px;
`;

const ButtonText = styled.Text`
  color: black;
  margin: 5%;
`;

const BottomButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  font-size: 17px;
`;

const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.backGroundColor};
`;

const ButtonWrapper = styled.View`
  margin-bottom: 20%;
  background-color: ${(props) => props.theme.subColor};
`;

const BottomButtonWrapper = styled.View`
  width: ${constants.width};
  position: absolute;
  bottom: 0;
  align-items: center;
`;

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
  position: relative;
`;

const MainBGColor = styled.View`
  flex: 1;
  background-color: ${(props) => props.bgColor};
`;

const PhoneAuth = ({ navigation }) => {
  const [state, setState] = useState(state);

  const nextButton = async () => {
    if (!state) {
      return Toast.show('개인정보 처리방침에 동의해주셔야 합니다', {
        position: 0,
      });
    } else {
      // iamport 기능 스타트!
      return navigation.navigate('IamportCertification');
    }
  };

  return (
    <>
      <Wrapper>
        <Container>
          <ScrollView
            scrollIndicatorInsets={{ right: 1 }}
            // legacyImplementation={true} //가상화 뷰 사용
            // removeClippedSubviews={true}
          >
            <ButtonText style={{ fontSize: 16, fontWeight: 'bold' }}>
              개인정보의 수집 이용목적
            </ButtonText>
            <ButtonText>{personalText}</ButtonText>
            <ButtonWrapper>
              <Touchable onPress={() => setState((prev) => !prev)}>
                <ImageContainer>
                  <CheckBox
                    checkedCheckBoxColor={'#105943'}
                    uncheckedCheckBoxColor={'lightgrey'}
                    checkBoxColor={state ? 'black' : 'lightgrey'}
                    disabled={true}
                    isChecked={state}
                    onClick={() => null}
                  />
                </ImageContainer>
                <Container>
                  <ButtonText style={{ fontSize: 20, fontWeight: 'bold' }}>
                    개인정보 수집 및 이용 동의
                  </ButtonText>
                </Container>
              </Touchable>
            </ButtonWrapper>
          </ScrollView>
        </Container>

        <BottomButtonWrapper>
          <Touchable
            onPress={() => {
              nextButton();
            }}
          >
            <MainBGColor bgColor={!state ? '#bbbbbb' : '#105943'}>
              <BottomContainer>
                <BottomButtonText>인증하기</BottomButtonText>
              </BottomContainer>
            </MainBGColor>
          </Touchable>
        </BottomButtonWrapper>
      </Wrapper>
    </>
  );
};

export default withTheme(PhoneAuth);
