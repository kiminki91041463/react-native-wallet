import React, { useState, useEffect } from 'react';
import styled, { withTheme } from 'styled-components';
import { ActivityIndicator, Platform } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import SecureStorage from 'react-native-secure-storage';
import { TextInput } from 'react-native-gesture-handler';
import constants from '../../constants';
import Toast from 'react-native-tiny-toast';

const ActivityIndicatorWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.View`
  position: relative;
  flex: 1;
  background-color: ${(props) => props.theme.backGroundColor};
  color: ${(props) => props.theme.whiteTextColor};
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.theme.subColor};
  align-items: center;
  margin-top: 10;
`;

const AddressWrapper = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.theme.subColor};
  align-items: center;
`;

const ExplainWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: 75;
`;

const ExplainText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  margin-left: 3%;
  font-size: 14px;
  justify-content: center;
  line-height: 18;
  padding: 3px;
  width: 80%;
`;

const AddressText = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
  margin-left: 3%;
  font-size: 12px;
  /* border-bottom-width: 1px; */
`;

const Touchable = styled.TouchableOpacity`
  width: ${constants.width};
`;

const MiniTouchable = styled.TouchableOpacity``;

const MiniContainer = styled.View`
  width: 50;
  height: 30;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  font-size: ${(props) => (props.fontSize ? props.fontSize : 12)};
`;

const Image = styled.Image`
  width: 30;
  margin-left: 3%;
`;

const Text = styled.Text`
  color: ${(props) => props.theme.blackTextColor};
`;

const KeyWrapper = styled.View`
  margin: 5%;
`;

const KeyButtonWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.borderBottomColor};
  padding-bottom: 8px;
  justify-content: space-between;
`;

const KeyValueWrapper = styled.View`
  height: ${constants.height * 0.25};
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.subColor};
`;

const ButtonWrapper = styled.View`
  width: ${constants.width};
  position: absolute;
  bottom: 0;
  align-items: center;
`;

const Container = styled.View`
  align-items: center;
  justify-content: center;
  height: 55px;
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

const Backup = ({ theme, navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [secureDataValue, setSecureDataValue] = useState(null);
  const type = navigation.getParam('type');
  const getAsyncStorage = async () => {
    const secureData = await SecureStorage.getItem('secureData');
    const parseSecureData = JSON.parse(secureData);
    setSecureDataValue(parseSecureData);
  };

  useEffect(() => {
    getAsyncStorage();
  }, []);

  return (
    <>
      {secureDataValue === null ? (
        <>
          <ActivityIndicatorWrapper>
            <ActivityIndicator
              size="large"
              color={theme.activityIndicatorColor}
            />
          </ActivityIndicatorWrapper>
        </>
      ) : (
        <>
          {type === 'Private' ? (
            <>
              <Wrapper>
                <AddressWrapper>
                  <Image
                    style={{ resizeMode: 'contain' }}
                    source={require('../../assets/front/backup_icon1.png')}
                  />
                  <AddressText>{secureDataValue.address}</AddressText>
                </AddressWrapper>
                <KeyWrapper>
                  <KeyButtonWrapper>
                    <Text>프라이빗 키 정보</Text>
                    <MiniTouchable
                      onPress={() => {
                        setIsVisible(!isVisible);
                      }}
                    >
                      <MainBGColor style={{ borderRadius: 5 }}>
                        <MiniContainer>
                          {!isVisible ? (
                            <ButtonText>보기</ButtonText>
                          ) : (
                            <ButtonText>숨김</ButtonText>
                          )}
                        </MiniContainer>
                      </MainBGColor>
                    </MiniTouchable>
                  </KeyButtonWrapper>
                  <KeyValueWrapper>
                    <TextInput
                      editable={false}
                      multiline={true}
                      style={
                        isVisible
                          ? { color: theme.mainColor, fontSize: 20 }
                          : { color: theme.grayColor, fontSize: 25 }
                      }
                      // secureTextEntry={!isVisible} //ios 적용안됨 ㅠㅠ
                    >
                      {isVisible
                        ? secureDataValue.privateKey
                        : '*************************************************************'}
                    </TextInput>
                  </KeyValueWrapper>
                </KeyWrapper>
                <ExplainWrapper>
                  <Image
                    style={{ resizeMode: 'contain' }}
                    source={require('../../assets/front/backup_icon2.png')}
                  />
                  <ExplainText>{`프라이빗 키 정보를 캡쳐해서 보관하는 것은\n안전하지 않습니다. 생성된 프라이빗 키\n정보를 안전하게 보관하는 것을 권장합니다`}</ExplainText>
                </ExplainWrapper>
                <ExplainWrapper>
                  <Image
                    style={{ resizeMode: 'contain' }}
                    source={require('../../assets/front/backup_icon3.png')}
                  />
                  <ExplainText>{`그루는 유저의 프라이빗 키 정보를 절대\n수집하지 않습니다.`}</ExplainText>
                </ExplainWrapper>
                <ButtonWrapper>
                  <Touchable
                    onPress={() => {
                      Clipboard.setString(secureDataValue.privateKey);
                      Platform.OS === 'ios' || Platform.Version > 25
                        ? Toast.show('개인키 복사가 완료되었습니다', {
                            position: 0,
                          })
                        : null;

                      // setToastVisible(true);
                      // setTimeout(() => setToastVisible(false), 2500);
                    }}
                  >
                    <MainBGColor>
                      <Container>
                        <ButtonText style={{ fontSize: 17 }}>
                          프라이빗 키 복사하기
                        </ButtonText>
                      </Container>
                    </MainBGColor>
                  </Touchable>
                </ButtonWrapper>
              </Wrapper>
            </>
          ) : (
            <>
              <Wrapper>
                <AddressWrapper>
                  <Image
                    style={{ resizeMode: 'contain' }}
                    source={require('../../assets/front/backup_icon1.png')}
                  />
                  <AddressText>{secureDataValue.address}</AddressText>
                </AddressWrapper>
                <KeyWrapper>
                  <KeyButtonWrapper>
                    <Text>니모닉 단어 정보</Text>
                    <MiniTouchable
                      onPress={() => {
                        setIsVisible(!isVisible);
                      }}
                    >
                      <MainBGColor style={{ borderRadius: 5 }}>
                        <MiniContainer>
                          {!isVisible ? (
                            <ButtonText>보기</ButtonText>
                          ) : (
                            <ButtonText>숨김</ButtonText>
                          )}
                        </MiniContainer>
                      </MainBGColor>
                    </MiniTouchable>
                  </KeyButtonWrapper>
                  <KeyValueWrapper>
                    <TextInput
                      editable={false}
                      multiline={true}
                      style={
                        isVisible
                          ? { color: theme.mainColor, fontSize: 20 }
                          : { color: theme.grayColor, fontSize: 25 }
                      }
                      // secureTextEntry={!isVisible}
                    >
                      {isVisible
                        ? secureDataValue.mnemonic
                        : '*************************************************************'}
                    </TextInput>
                  </KeyValueWrapper>
                </KeyWrapper>
                <ExplainWrapper>
                  <Image
                    style={{ resizeMode: 'contain' }}
                    source={require('../../assets/front/backup_icon2.png')}
                  />
                  <ExplainText>{`니모닉 단어 정보를 캡쳐해서 보관하는 것은\n안전하지 않습니다. 생성된 니모닉 단어 정보를\n안전하게 보관하는 것을 권장합니다`}</ExplainText>
                </ExplainWrapper>
                <ExplainWrapper>
                  <Image
                    style={{ resizeMode: 'contain' }}
                    source={require('../../assets/front/backup_icon3.png')}
                  />
                  <ExplainText>{`그루는 유저의 니모닉 단어 정보를 절대\n수집하지 않습니다`}</ExplainText>
                </ExplainWrapper>
                <ButtonWrapper>
                  <Touchable
                    onPress={() => {
                      Clipboard.setString(secureDataValue.mnemonic);
                      Platform.OS === 'ios' || Platform.Version > 25
                        ? Toast.show('니모닉 복사가 완료되었습니다', {
                            position: 0,
                          })
                        : null;
                    }}
                  >
                    <MainBGColor>
                      <Container>
                        <ButtonText style={{ fontSize: 17 }}>
                          니모닉 단어 복사하기
                        </ButtonText>
                      </Container>
                    </MainBGColor>
                  </Touchable>
                </ButtonWrapper>
              </Wrapper>
            </>
          )}
        </>
      )}
    </>
  );
};

export default withTheme(Backup);
