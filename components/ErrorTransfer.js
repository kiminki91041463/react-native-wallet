import React, { useEffect } from 'react';
import { Alert, Platform, BackHandler } from 'react-native';
import styled from 'styled-components';
import RNExitApp from 'react-native-exit-app';
const Image = styled.Image`
  width: 100%;
`;

const Container = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;
const Error = () => {
  useEffect(() => {
    Alert.alert(
      '알림',
      '서버와 통신이 원활하지 않습니다.\n잠시 후 다시 실행해 주세요',
      [
        {
          text: '앱 종료',
          onPress: () => {
            RNExitApp.exitApp();
          },
        },
      ],
      { cancelable: false },
    );
  }, []);
  return (
    <Container>
      <Image
        resizeMode="contain"
        source={require('../assets/front/error.jpg')}
      ></Image>
    </Container>
  );
};

export default Error;
