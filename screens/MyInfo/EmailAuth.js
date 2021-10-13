import React, { useState, useEffect } from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import styled from 'styled-components';
import constants from '../../constants';
import { Header } from 'react-navigation-stack';
import Toast from 'react-native-tiny-toast';
import AuthInput from '../../components/AuthInput';
import PropTypes from 'prop-types';
import axios from 'axios';
import options from '../../apollo';
import OpacityLoader from '../../components/OpacityLoader';
import { StackActions } from 'react-navigation';

const Warpper = styled.View`
  width: ${constants.width};
  height: ${constants.height * 0.85};
  align-items: center;
`;

const WrapperInput = styled.View``;

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
  margin-top: 10%;
  flex: 1;
`;

const MiniTouchable = styled.TouchableOpacity`
  position: absolute;
  right: 1;
  top: 15;
`;

const ButtonText2 = styled.Text`
  color: ${(props) => (props.color ? props.color : props.theme.mainColor)};
  text-align: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : 13)};
`;

const MiniContainer = styled.View`
  width: 73;
  height: 30;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${(props) => props.theme.subColor};
  border-width: 1px;
  border-color: ${(props) => props.theme.mainColor};
  margin-right: 20px;
`;

const Text = styled.Text`
  color: black;
  text-align: center;
  font-size: 16px;
  padding: 5px;
  margin: 20px 0;
  border: 1px solid white;
`;

const RecommenderText = styled.Text`
  color: black;
  text-align: left;
  font-weight: 600;
  margin-top: 3%;
  margin-left: 5%;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: 17px;
`;

const BottomContainer = styled.View`
  position: absolute;
  bottom: 0;
  align-items: flex-end;
  flex-direction: row;
`;

const ButtonContainerWarpper = styled.View`
  align-items: center;
`;

const NextButtonContainer = styled.View`
  width: ${constants.width};
`;

const Touchable = styled.TouchableOpacity`
  justify-content: flex-end;
  background-color: ${(props) => props.theme.mainColor};
`;

const Image = styled.Image`
  margin: 10px auto;
`;

export default ({ navigation }) => {
  return <Recommendation navigation={navigation} />;
};

const Recommendation = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // if (Platform.OS !== 'ios') {
    //   LocalAuthentication.release();
    // }
  }, []);

  const handleOnSend = async () => {
    setIsLoading(true);

    if (!email || email.length < 1) {
      setIsLoading(false);

      return Toast.show('이메일을 입력해주세요', { position: 0 });
    } else if (!isEmail(email)) {
      setIsLoading(false);

      return Toast.show('올바른 이메일을 입력해주세요', { position: 0 });
    }

    const token = await AsyncStorage.getItem('jwt');

    try {
      const { data } = await axios({
        url: `${options.uri}/auth/email`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        data: {
          email,
        },
      });
      if (data.result === 'fail') {
        setIsLoading(false);

        return Toast.show(data.message, { position: 0 });
      }

      Toast.show(data.message, { position: 0 });
      return navigation.dispatch(StackActions.popToTop());
    } catch (e) {
      console.log(e);
      setIsLoading(false);

      Toast.show('서버와 통신이 원활하지 않습니다.', { position: 0 });
    }
  };

  return (
    <>
      {isLoading && <OpacityLoader />}

      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? Header.HEIGHT + 20 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          style={{ height: '100%' }}
          scrollIndicatorInsets={{ right: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <Warpper>
                <View>
                  <>
                    <Text>{`이메일을 이용해\n본인인증을 진행해주세요`}</Text>
                    <Image
                      style={{
                        resizeMode: 'contain',
                        height: '25%',
                      }}
                      source={require('../../assets/front/recommender_img.png')}
                    />
                    <InputContainer>
                      <RecommenderText>이메일</RecommenderText>
                      <WrapperInput>
                        <AuthInput
                          value={email}
                          onChange={(val) => setEmail(val)}
                          keyboardType="email-address"
                          returnKeyType="done"
                          secureTextEntry={false}
                          autoCorrect={false}
                          placeholder=""
                        />

                        <MiniTouchable onPress={handleOnSend}>
                          <MiniContainer>
                            <ButtonText2>발송</ButtonText2>
                          </MiniContainer>
                        </MiniTouchable>
                      </WrapperInput>
                    </InputContainer>
                  </>
                </View>
              </Warpper>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const ConfirmButton = () => {
  return (
    <BottomContainer>
      <ButtonContainerWarpper>
        <NextButtonContainer>
          <Touchable
            onPress={() => {
              // 코인 구매 Modal handle
              console.log('완료....');
            }}
          >
            <Container>
              <ButtonText>완료</ButtonText>
            </Container>
          </Touchable>
        </NextButtonContainer>
      </ButtonContainerWarpper>
    </BottomContainer>
  );
};
Recommendation.propTypes = {
  data: PropTypes.any,
};

const isEmail = (email) => {
  const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  return emailRegex.test(email);
};
