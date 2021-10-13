import React, { useState, useEffect } from 'react';
import styled, { withTheme } from 'styled-components';
import Toast from 'react-native-tiny-toast';
import constants from '../../constants';
import CheckBox from 'react-native-check-box';
import Modal from 'react-native-modal';
import { useSetRecoilState } from 'recoil';
import { basicState } from '../../recoil/recoilAtoms';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native';
import {
  policyText,
  personalText,
  personalCollectAgreeText,
} from '../../policy';

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

const BottomContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: 55px;
`;

const ButtonText = styled.Text`
  color: black;
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
  margin-top: 2;
  background-color: ${(props) => props.theme.subColor};
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
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

const ModalBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const ModalWarpper = styled.View`
  align-items: center;
`;

const ModalTextContainer = styled.View`
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)};
  height: 390px;
`;

const ModalTextHeaderView = styled.View`
  width: 100%;
  height: 55px;
  line-height: 55px;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.borderBottomColor};
`;

const ModalTextHeader = styled.Text`
  color: #333333;
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'auto')};
  font-size: ${(props) => (props.fontSize ? props.fontSize : 18)};
  font-weight: bold;
  margin: 10px;
`;

const ModalView = styled.View`
  background-color: ${(props) => props.theme.subColor};
  align-items: center;
  border-radius: 11px;
  width: 90%;
  height: 500px;
`;

const ModalButtonContainer = styled.View`
  justify-content: flex-end;
  flex-direction: row;
`;

const ModalTouchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-end;
`;

const RadiusLeftRight = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
  border-bottom-left-radius: 10;
`;

const ModalContainer = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const PolicyScreen = () => {
  const setBasicState = useSetRecoilState(basicState);
  const [type, setType] = useState('policy');
  const [state, setState] = useState({
    policy: false,
    personal: false,
    personalAgree: false,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const nextButton = async () => {
    if (state.policy && state.personal && state.personalAgree) {
      setBasicState((prev) => ({ ...prev, policy: true }));
      await AsyncStorage.setItem('policy', 'true');
    } else {
      return Toast.show('약관에 모두 동의해주셔야 합니다', { position: 0 });
    }
  };
  const closeModal = () => {
    if (modalVisible) {
      return setModalVisible(false);
    } else {
      return;
    }
  };

  const policyApprove = async (type) => {
    if (type === 'policy') {
      setState((prev) => ({ ...prev, policy: true }));
      setModalVisible(false);
    } else if (type === 'personalAgree') {
      setState((prev) => ({ ...prev, personalAgree: true }));
      setModalVisible(false);
    } else {
      setState((prev) => ({ ...prev, personal: true }));
      setModalVisible(false);
    }
  };

  const modalOpen = (type) => {
    setType(type);
    setModalVisible(true);
  };

  return (
    <>
      <Wrapper>
        {/* <HeaderText>키 관리</HeaderText> */}
        <ButtonWrapper>
          <Touchable onPress={() => modalOpen('policy')}>
            <ImageContainer>
              <CheckBox
                checkedCheckBoxColor={'#105943'}
                uncheckedCheckBoxColor={'lightgrey'}
                checkBoxColor={state.policy ? 'black' : 'lightgrey'}
                disabled={true}
                isChecked={state.policy}
                onClick={() => null}
              />
            </ImageContainer>
            <Container>
              <ButtonText>[필수] 그루 이용약관</ButtonText>
            </Container>
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable onPress={() => modalOpen('personalAgree')}>
            <ImageContainer>
              <CheckBox
                checkedCheckBoxColor={'#105943'}
                uncheckedCheckBoxColor={'lightgrey'}
                checkBoxColor={state.personalAgree ? 'black' : 'lightgrey'}
                disabled={true}
                isChecked={state.personalAgree}
                onClick={() => null}
              />
            </ImageContainer>
            <Container>
              <ButtonText>[필수] 개인정보 수집 및 이용 동의서</ButtonText>
            </Container>
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable onPress={() => modalOpen('personal')}>
            <ImageContainer>
              <CheckBox
                checkedCheckBoxColor={'#105943'}
                uncheckedCheckBoxColor={'lightgrey'}
                checkBoxColor={state.personal ? 'black' : 'lightgrey'}
                disabled={true}
                isChecked={state.personal}
                onClick={() => null}
              />
            </ImageContainer>
            <Container>
              <ButtonText>[필수] 개인정보 처리 방침</ButtonText>
            </Container>
          </Touchable>
        </ButtonWrapper>
        <BottomButtonWrapper>
          <Touchable
            disabled={!state.policy || !state.personal || !state.personalAgree}
            onPress={() => {
              nextButton();
            }}
          >
            <MainBGColor
              bgColor={
                !state.policy || !state.personal || !state.personalAgree
                  ? '#bbbbbb'
                  : '#105943'
              }
            >
              <BottomContainer>
                <BottomButtonText>동의하고 계속하기</BottomButtonText>
              </BottomContainer>
            </MainBGColor>
          </Touchable>
        </BottomButtonWrapper>
      </Wrapper>
      <Modal
        animationInTiming={350}
        animationOutTiming={350}
        isVisible={modalVisible}
        hideModalContentWhileAnimating={true}
        onBackdropPress={closeModal}
        useNativeDriver={true}
      >
        <ModalWarpper>
          <ModalView>
            <ModalTextHeaderView>
              <ModalTextHeader textAlign={'center'}>
                {type ? `이용약관` : '개인정보 수집 및 이용'}
              </ModalTextHeader>
            </ModalTextHeaderView>
            <ModalTextContainer>
              <ScrollView
                scrollIndicatorInsets={{ right: 1 }}
                legacyImplementation={true} //가상화 뷰 사용
                removeClippedSubviews={true}
              >
                <ModalTextHeader fontSize={13}>
                  {type === 'policy'
                    ? policyText
                    : type === 'personalAgree'
                    ? personalCollectAgreeText
                    : personalText}
                </ModalTextHeader>
              </ScrollView>
            </ModalTextContainer>
            <ModalButtonContainer>
              <ModalTouchable onPress={() => policyApprove(type)}>
                <RadiusLeftRight>
                  <ModalBGColor
                    style={{
                      borderBottomRightRadius: 10,
                      borderBottomLeftRadius: 10,
                    }}
                  >
                    <ModalContainer>
                      <BottomButtonText>동의하기</BottomButtonText>
                    </ModalContainer>
                  </ModalBGColor>
                </RadiusLeftRight>
              </ModalTouchable>
            </ModalButtonContainer>
          </ModalView>
        </ModalWarpper>
      </Modal>
    </>
  );
};

export default withTheme(PolicyScreen);
