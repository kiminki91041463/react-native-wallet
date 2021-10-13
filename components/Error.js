import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Alert } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
const Image = styled.Image`
  width: 100%;
`;

const Container = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;
const Error = ({ navigation, route = null }) => {
  _resetFunc = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'TabNavigation' })],
    });
    navigation.dispatch(resetAction);
  };
  useEffect(() => {
    Alert.alert(
      '알림',
      '서버와 통신이 원활하지 않습니다.\n잠시 후 다시 실행해 주세요',
      [
        {
          text: route ? '새로고침' : '뒤로가기',
          onPress: () => (route ? _resetFunc() : navigation.goBack()),
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
