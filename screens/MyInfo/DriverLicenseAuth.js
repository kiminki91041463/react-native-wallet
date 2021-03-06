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
  mutation licenseCardAuth(
    $name: String!
    $birthDate: String!
    $driverLicenseNumber: String!
    $driverLicenseCryptoNumber: String!
  ) {
    licenseCardAuth(
      name: $name
      birthDate: $birthDate
      driverLicenseNumber: $driverLicenseNumber
      driverLicenseCryptoNumber: $driverLicenseCryptoNumber
    ) {
      isSuccess
      message
    }
  }
`;

export default ({ navigation }) => {
  return <DriverLicenseAuth navigation={navigation} />;
};

const DriverLicenseAuth = ({ navigation }) => {
  const [inputState, setInputState] = useState({
    name: '',
    birthDate: '',
    driverLicenseNumber: '',
    driverLicenseCryptoNumber: '',
  });
  const [visible, setVisible] = useState(false);
  const [licenseCardAuthMutation] = useMutation(REGISTRATION_CARD_AUTH);

  const nameChange = (val) => {
    if (val === '') {
      return setInputState((prev) => ({ ...prev, name: val }));
    } else if (val !== '' && isKor(val)) {
      return setInputState((prev) => ({ ...prev, name: val }));
    } else {
      return Toast.show('????????? ??????????????????', { position: 0 });
    }
  };

  const birthChange = (val) => {
    if (val === '') {
      return setInputState((prev) => ({ ...prev, birthDate: val }));
    } else if (val !== '' && isNum(val)) {
      return setInputState((prev) => ({ ...prev, birthDate: val }));
    } else {
      return Toast.show('????????? ??????????????????', { position: 0 });
    }
  };

  const idNumberChange = (val) => {
    if (val === '') {
      return setInputState((prev) => ({ ...prev, driverLicenseNumber: val }));
    } else if (val !== '' && isNum(val)) {
      return setInputState((prev) => ({ ...prev, driverLicenseNumber: val }));
    } else {
      return Toast.show('????????? ??????????????????', { position: 0 });
    }
  };

  const cryptoChange = (val) => {
    if (val === '') {
      return setInputState((prev) => ({
        ...prev,
        driverLicenseCryptoNumber: val,
      }));
    } else if (val !== '' && isCrypto(val)) {
      return setInputState((prev) => ({
        ...prev,
        driverLicenseCryptoNumber: val,
      }));
    } else {
      return Toast.show('??????,????????? ??????????????????', { position: 0 });
    }
  };

  const submitFunc = () => {
    if (
      inputState.name === '' ||
      inputState.birthDate === '' ||
      inputState.driverLicenseNumber === '' ||
      inputState.driverLicenseCryptoNumber === ''
    ) {
      return Toast.show('????????? ?????? ??????????????????', { position: 0 });
    } else if (!isKorSubmit(inputState.name)) {
      return Toast.show('????????? ????????? ??????????????????', { position: 0 });
    } else if (!isNum(inputState.birthDate)) {
      return Toast.show('????????? ??????????????? ??????????????????', { position: 0 });
    } else if (!isNum(inputState.driverLicenseNumber)) {
      return Toast.show('????????? ????????????????????? ??????????????????', { position: 0 });
    } else if (!isCrypto(inputState.driverLicenseCryptoNumber)) {
      return Toast.show('????????? ????????????????????? ??????????????????', { position: 0 });
    } else {
      //mutation ??????
      mutationFunc();
    }
  };

  const mutationFunc = async () => {
    const variables = {
      name: await rsaEncrytion(inputState.name),
      birthDate: await rsaEncrytion(inputState.birthDate),
      driverLicenseNumber: await rsaEncrytion(inputState.driverLicenseNumber),
      driverLicenseCryptoNumber: await rsaEncrytion(
        inputState.driverLicenseCryptoNumber,
      ),
    };
    const {
      data: {
        licenseCardAuth: { isSuccess, message },
      },
    } = await licenseCardAuthMutation({
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
        style={{ flex: 1 }}
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
                      source={require('../../assets/front/driverCard.png')}
                    />
                    <InputContainer>
                      <RecommenderText>??? ??????</RecommenderText>
                      <TextInput
                        value={inputState.name}
                        onChangeText={(e) => nameChange(e)}
                        keyboardType="email-address"
                        returnKeyType="next"
                        placeholder="?????????"
                      />
                    </InputContainer>
                    <InputContainer>
                      <RecommenderText>??? ????????????</RecommenderText>
                      <TextInput
                        value={inputState.birthDate}
                        onChangeText={(e) => birthChange(e)}
                        keyboardType="numeric"
                        returnKeyType="next"
                        placeholder="920116"
                      />
                    </InputContainer>
                    <InputContainer>
                      <RecommenderText>??? ??????????????????</RecommenderText>
                      <TextInput
                        value={inputState.driverLicenseNumber}
                        onChangeText={(e) => idNumberChange(e)}
                        keyboardType="numeric"
                        returnKeyType="done"
                        placeholder="-?????? ??????"
                      />
                    </InputContainer>
                    <InputContainer>
                      <RecommenderText>??? ??????????????????</RecommenderText>
                      <TextInput
                        value={inputState.driverLicenseCryptoNumber}
                        onChangeText={(e) => cryptoChange(e)}
                        keyboardType="email-address"
                        returnKeyType="done"
                        placeholder="8H1X3Y"
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
                      <ButtonText>????????????</ButtonText>
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
                {`????????? ???????????? ??????????????????.\n???????????? ?????? 24?????? ??????\n????????? ??? ????????????.`}
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
                      <ButtonText>??????</ButtonText>
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

DriverLicenseAuth.propTypes = {
  data: PropTypes.any,
};

const isKor = (val) => {
  const koreanRegex = /[???-??????-??????-?????? ???]/g;
  return koreanRegex.test(val);
};

const isNum = (val) => {
  const numRegex = /^[0-9]+$/;
  return numRegex.test(val);
};

const isKorSubmit = (val) => {
  const koreanRegex2 = /^[???-???]+$/;
  return koreanRegex2.test(val);
};

const isCrypto = (val) => {
  const cryptoRegex = /^[A-Za-z0-9+]*$/;
  return cryptoRegex.test(val);
};
