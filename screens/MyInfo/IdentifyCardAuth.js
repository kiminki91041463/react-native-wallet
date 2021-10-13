import React, { useState, useEffect } from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import styled from 'styled-components';
import constants from '../../constants';
import { Header } from 'react-navigation-stack';
import Toast from 'react-native-tiny-toast';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { StackActions } from 'react-navigation';
import { rsaEncrytion } from '../../enDec';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';

const Warpper = styled.View`
  width: ${constants.width};
  height: ${constants.height * 0.85};
  align-items: center;
`;

const Container = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const View = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${(props) => props.theme.backGroundColor};
  padding-bottom: 2%;
`;

const InputContainer = styled.View`
  margin-top: 4%;
  margin-left: 5%;
`;

const RecommenderText = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: 17px;
`;

const BottomContainer = styled.View`
  align-items: flex-end;
  flex-direction: row;
`;

const ButtonContainerWarpper = styled.View`
  align-items: flex-end;
  flex-direction: row;
`;

const NextButtonContainer = styled.View`
  width: 100%;
`;

const Touchable = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.mainColor};
`;

const Image = styled.Image`
  width: 100%;
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;

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

const TextInput = styled.TextInput`
  width: ${constants.width * 0.9};
  height: 40px;
  color: black;
  text-align: left;
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
`;

const REGISTRATION_CARD_AUTH = gql`
  mutation registrationCardAuth(
    $name: String!
    $registrationNumber: String!
    $registrationDate: String!
  ) {
    registrationCardAuth(
      name: $name
      registrationNumber: $registrationNumber
      registrationDate: $registrationDate
    ) {
      isSuccess
      message
    }
  }
`;

export default ({ navigation }) => {
  return <IdentifyCardAuth navigation={navigation} />;
};

const IdentifyCardAuth = ({ navigation }) => {
  const [inputState, setInputState] = useState({
    name: '',
    registrationNumber: '',
    registrationDate: '',
  });
  const [visible, setVisible] = useState(false);
  const [registrationCardAuthMutation] = useMutation(REGISTRATION_CARD_AUTH);

  const nameChange = (val) => {
    if (val === '') {
      return setInputState((prev) => ({ ...prev, name: val }));
    } else if (val !== '' && isKor(val)) {
      return setInputState((prev) => ({ ...prev, name: val }));
    } else {
      return Toast.show('한글만 입력해주세요', { position: 0 });
    }
  };

  const idNumberChange = (val) => {
    if (val === '') {
      return setInputState((prev) => ({ ...prev, registrationNumber: val }));
    } else if (val !== '' && isNum(val)) {
      return setInputState((prev) => ({ ...prev, registrationNumber: val }));
    } else {
      return Toast.show('숫자만 입력해주세요', { position: 0 });
    }
  };

  const createdAtChange = (val) => {
    if (val === '') {
      return setInputState((prev) => ({ ...prev, registrationDate: val }));
    } else if (val !== '' && isNum(val)) {
      return setInputState((prev) => ({ ...prev, registrationDate: val }));
    } else {
      return Toast.show('숫자만 입력해주세요', { position: 0 });
    }
  };

  const submitFunc = () => {
    if (
      inputState.name === '' ||
      inputState.registrationNumber === '' ||
      inputState.registrationDate === ''
    ) {
      return Toast.show('정보를 모두 입력해주세요', { position: 0 });
    } else if (!isKorSubmit(inputState.name)) {
      return Toast.show('올바른 이름을 입력해주세요', { position: 0 });
    } else if (!isNum(inputState.registrationNumber)) {
      return Toast.show('올바른 주민등록번호를 입력해주세요', { position: 0 });
    } else if (!isNum(inputState.registrationDate)) {
      return Toast.show('올바른 발급일자를 입력해주세요', { position: 0 });
    } else {
      //mutation 실행
      mutationFunc();
    }
  };

  const mutationFunc = async () => {
    const variables = {
      name: await rsaEncrytion(inputState.name),
      registrationNumber: await rsaEncrytion(inputState.registrationNumber),
      registrationDate: await rsaEncrytion(inputState.registrationDate),
    };
    const {
      data: {
        registrationCardAuth: { isSuccess, message },
      },
    } = await registrationCardAuthMutation({
      variables,
    });
    console.log({ isSuccess }, { message });
    if (isSuccess) {
      return setVisible(true);
    } else {
      return Toast.show(message, { position: 0 });
    }
  };

  const modalClose = () => {
    setVisible(false);
    return navigation.dispatch(StackActions.popToTop());
  };

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? Header.HEIGHT + 20 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : null}
        style={{ height: '100%' }}
      >
        <ScrollView
          scrollIndicatorInsets={{ right: 1 }}
          keyboardShouldPersistTaps={'handled'}
          style={{ height: '100%' }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <Warpper>
                <View>
                  <>
                    <Image
                      style={{
                        resizeMode: 'contain',
                        marginTop: '5%',
                        height: '32%',
                      }}
                      source={require('../../assets/front/identifyCard.png')}
                    />
                    <InputContainer>
                      <RecommenderText>① 이름</RecommenderText>
                      <TextInput
                        value={inputState.name}
                        onChangeText={(e) => nameChange(e)}
                        keyboardType="email-address"
                        returnKeyType="next"
                        placeholder="홍길동"
                      />
                    </InputContainer>
                    <InputContainer>
                      <RecommenderText>② 주민등록번호</RecommenderText>
                      <TextInput
                        value={inputState.registrationNumber}
                        onChangeText={(e) => idNumberChange(e)}
                        keyboardType="numeric"
                        returnKeyType="next"
                        placeholder="8207012345678"
                      />
                    </InputContainer>
                    <InputContainer>
                      <RecommenderText>③ 발급일자</RecommenderText>
                      <TextInput
                        value={inputState.registrationDate}
                        onChangeText={(e) => createdAtChange(e)}
                        keyboardType="numeric"
                        // returnKeyType=
                        placeholder="20200302"
                      />
                    </InputContainer>
                  </>
                </View>
              </Warpper>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
        <ButtonContainerWarpper>
          <NextButtonContainer>
            <Touchable
              onPress={() => {
                return submitFunc();
              }}
            >
              <MainBGColor>
                <Touchable
                  onPress={() => {
                    return submitFunc();
                  }}
                >
                  <MainBGColor>
                    <Container>
                      <ButtonText>인증하기</ButtonText>
                    </Container>
                  </MainBGColor>
                </Touchable>
              </MainBGColor>
            </Touchable>
          </NextButtonContainer>
        </ButtonContainerWarpper>
      </KeyboardAvoidingView>
      <Modal isVisible={visible} onBackdropPress={() => modalClose()}>
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
                {`신분증 진위확인 심사중입니다.\n완료까지 최대 24시간 정도\n소요될 수 있습니다.`}
              </ModalText>
            </ModalTextContainer>
            <ModalButtonContainer>
              <ModalTouchable width={'100%'} onPress={() => modalClose()}>
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

IdentifyCardAuth.propTypes = {
  data: PropTypes.any,
};

const isKor = (val) => {
  const koreanRegex = /[ㄱ-ㅎㅏ-ㅣ가-힇ㆍ ᆢ]/g;
  return koreanRegex.test(val);
};

const isNum = (val) => {
  const numRegex = /^[0-9]+$/;
  return numRegex.test(val);
};

const isKorSubmit = (val) => {
  const koreanRegex2 = /^[가-힣]+$/;
  return koreanRegex2.test(val);
};
