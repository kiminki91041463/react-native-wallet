import React, { useState } from 'react';
import styled, { withTheme } from 'styled-components';
import Modal from 'react-native-modal';
import Toast from 'react-native-tiny-toast';
import { Dimensions } from 'react-native';
import { basicState } from '../../recoil/recoilAtoms';
import { useRecoilValue } from 'recoil';

const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.backGroundColor};
  justify-content: space-between;
`;

const Container = styled.View`
  align-items: center;
  margin-top: 130px;
  justify-content: space-between;
`;

const ImageContainer = styled.View`
  justify-content: space-between;
  align-items: center;
`;

const Image = styled.Image`
  margin: 0 auto;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  text-align: center;
  font-size: 17px;
`;

const Text = styled.Text`
  color: ${(props) => (props.color ? props.color : props.theme.blackTextColor)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : 14)};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 400)};
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'center')};
  margin: 5px 0;
`;

const TextContainer = styled.View`
  width: ${(props) => (props.width ? props.width : 'auto')};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : 'flex-start'};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)};
`;

const TouchableContainer = styled.View`
  background-color: ${(props) => props.theme.subColor};
  padding: 20px;
  border: ${(props) =>
    props.border ? props.border : `1px solid ${props.theme.borderBottomColor}`};
`;

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MiniTouchable = styled.TouchableOpacity``;

const MiniContainer = styled.View`
  align-items: center;
  padding-bottom: 10;
`;

const SwitchContainer = styled.View`
  border-radius: 100;
  justify-content: center;
  width: 130%;
  height: 35px;
  background-color: ${(props) => props.theme.mainColor};
`;

const ButtonText2 = styled.Text`
  text-align: center;
  color: ${(props) => props.theme.whiteTextColor};
  font-size: ${(props) => (props.fontSize ? props.fontSize : 17)};
`;

const ModalView = styled.View`
  background-color: ${(props) => props.theme.subColor};
  width: 300;
  height: ${(props) => (props.height ? props.height : 300)};
  align-items: center;
  border-radius: 11px;
`;

const ModalImage = styled.Image`
  margin-top: 10px;
`;

const ModalTextContainer = styled.View`
  flex: 1;
  width: 250;
  justify-content: center;
  margin-bottom: 5;
  margin-top: 10;
`;

const ModalText = styled.Text`
  text-align: center;
  padding: 10px;
`;
const ModalButtonContainer = styled.View`
  justify-content: flex-end;
  flex-direction: row;
`;

const ModalWarpper = styled.View`
  align-items: center;
`;

const ModalTouchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-end;
  overflow: hidden;
`;

const ModalContainer = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.borderBottomColor};
`;

const RadiusRight = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
  border-bottom-left-radius: 10;
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const LoginTerminal = ({ theme, navigation }) => {
  //state
  const [modalVisible, setModalVisible] = useState(false);

  //recoil
  const { walletExist } = useRecoilValue(basicState);

  const navigateFunc = () => {
    try {
      setModalVisible(false);
      // 일단 바이오 매트릭을 거치는 걸로 해보자 ※환전에서 어차피 써먹어야하기 때문
      setTimeout(() => {
        navigation.navigate('ImportWalletScreen');
      }, 500);
    } catch (error) {
      Toast.show(
        '서버와 연결이 원활하지 않습니다\n잠시 후, 다시 실행해 주십시오',
        { position: 0 },
      );
    }
  };

  return (
    <Wrapper>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <ModalWarpper>
          <ModalView height={'200px'}>
            <ModalImage
              style={{
                resizeMode: 'contain',
                height: '25%',
                marginTop: 20,
              }}
              source={require('../../assets/front/popup_1.png')}
            />
            <ModalTextContainer>
              <ModalText
                style={{
                  height: 60,
                  alignItems: 'center',
                }}
              >
                {`개인키/니모닉단어로 불러오기`}
              </ModalText>
            </ModalTextContainer>
            <ModalButtonContainer>
              <ModalTouchable onPress={() => navigateFunc()}>
                <RadiusRight>
                  <MainBGColor
                    style={{
                      borderBottomLeftRadius: 10,
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
      <Container>
        <ImageContainer>
          <Image
            source={require('../../assets/front/login_logo2.png')}
            style={{
              resizeMode: 'contain',
              height: Dimensions.get('screen').height * 0.3,
            }}
          />
          {/* <TextContainer paddingBottom={30}>
            <Text fontSize={24}>은행보다 더 쉬운</Text>
            <Text fontSize={24} fontWeight={600} color={theme.mainColor}>
              블록체인 송금 서비스 그루 
            </Text>
          </TextContainer> */}
          {!walletExist ? (
            <MiniTouchable
              style={{
                marginTop: Dimensions.get('screen').height * 0.1,
              }}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <MiniContainer>
                <SwitchContainer>
                  <ButtonText2>지갑 불러오기</ButtonText2>
                </SwitchContainer>
              </MiniContainer>
            </MiniTouchable>
          ) : null}
        </ImageContainer>
      </Container>
      {walletExist ? (
        <TouchableContainer>
          <Touchable onPress={() => navigation.navigate('LoginBioMetric')}>
            <TextContainer
              marginLeft={20}
              width={'60%'}
              justifyContent={'center'}
            >
              <Text fontSize={14} color={theme.grayColor} textAlign={'left'}>
                등록 된 PIN / 지문으로 간편하게!
              </Text>
              <Text fontSize={18} fontWeight={600} textAlign={'left'}>
                로그인하기
              </Text>
            </TextContainer>

            <Image
              style={{
                resizeMode: 'contain',
                height: '110%',
              }}
              source={require('../../assets/front/login_img2.png')}
            />
          </Touchable>
        </TouchableContainer>
      ) : (
        <>
          <TouchableContainer>
            <Touchable onPress={() => navigation.navigate('WalletsScreen')}>
              <TextContainer
                marginLeft={20}
                width={'60%'}
                justifyContent={'center'}
              >
                <Text fontSize={14} color={theme.grayColor} textAlign={'left'}>
                  그루가 처음이신가요?
                </Text>
                <Text fontSize={18} fontWeight={600} textAlign={'left'}>
                  지갑만들기
                </Text>
              </TextContainer>
              <Image
                style={{
                  resizeMode: 'contain',
                  height: '110%',
                }}
                source={require('../../assets/front/login_img1.png')}
              />
            </Touchable>
          </TouchableContainer>
        </>
      )}
    </Wrapper>
  );
};

export default withTheme(LoginTerminal);
