import React, { useRef } from 'react';
import styled, { withTheme } from 'styled-components';
import { Animated, TouchableHighlight } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { someState } from '../recoil/recoilAtoms';
import { useRecoilState } from 'recoil';

const SIZE = 80;

const MainImageWarpper = styled.View`
  flex: 1;
  margin-bottom: 30;
  border-radius: 40px;
  background-color: ${(props) => props.theme.mainColor};
`;

const View = styled.View``;

const Image = styled.Image`
  width: ${(props) => (props.width ? props.width : 15)};
`;

export default withTheme(({ navigation }) => {
  const [{ buttonActive }, setRecoilSomeState] = useRecoilState(someState);
  const activeButton = () => {
    if (buttonActive === 0) {
      return setRecoilSomeState((prev) => ({ ...prev, buttonActive: 1 }));
    } else {
      return setRecoilSomeState((prev) => ({ ...prev, buttonActive: 0 }));
    }
  };
  // eslint-disable-next-line no-undef
  mode = new Animated.Value(buttonActive); //context 0 or 1
  const toggleView = async (type) => {
    //type : 토글버튼 자체를 누름 = 0 / 다른 메뉴를 누름(스크린 이동) = 1
    if (type === 'button') {
      //토글은 펼쳤다 접었다
      Animated.timing(this.mode, {
        toValue: this.mode._value == 0 ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => activeButton(), 300); // context값 변경
    } else {
      //메뉴는 무조건 접힘
      Animated.timing(this.mode, {
        toValue: this.mode._value === 0 ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const firstX = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, -65],
  });
  const firstY = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -25],
  });
  //==============
  const secondX = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, -45],
  });
  const secondY = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -60],
  });
  //==============
  const thirdX = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 10],
  });
  const thirdY = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -60],
  });
  //==============
  const fourthX = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 50],
  });
  const fourthY = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -22],
  });
  //==============
  const opacity = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const rotation = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animStyle = {
    transform: [
      {
        translateX: firstX,
        translateY: firstY,
      },
    ],
  };

  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        zIndex: -1,
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          transform: [
            {
              translateX: firstX,
            },
            {
              translateY: firstY,
            },
          ],
          opacity,
        }}
      >
        <TouchableHighlight
          onPress={() => {}}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE / 2,
            height: SIZE / 2,
            borderRadius: SIZE / 4,
            backgroundColor: '#f2b92a',
          }}
        >
          <TouchableOpacity
            activeOpacity={2}
            onPress={async () => {
              // event.stopPropagation();
              toggleView('menu');
              setTimeout(() => {
                activeButton();
                navigation.navigate('Transfer');
              }, 270);
            }}
          >
            <Image
              style={{ width: 33, resizeMode: 'contain' }}
              source={require('../assets/front/transfer_text.png')}
            />
          </TouchableOpacity>
        </TouchableHighlight>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          transform: [
            {
              translateX: secondX,
            },
            {
              translateY: secondY,
            },
          ],
          opacity,
        }}
      >
        <TouchableHighlight
          onPress={() => {}}
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE / 2,
            height: SIZE / 2,
            borderRadius: SIZE / 4,
            backgroundColor: '#25b027',
          }}
        >
          <TouchableOpacity
            activeOpacity={2}
            onPress={() => {
              toggleView('menu');
              setTimeout(() => {
                activeButton();
                navigation.navigate('PurchaseRequest');
              }, 270);
            }}
          >
            <Image
              style={{ width: 21, resizeMode: 'contain' }} //width 를 21로 맞춰줘야 밑에 내역(history)와 비슷해짐
              source={require('../assets/front/purchase_text.png')}
            />
          </TouchableOpacity>
        </TouchableHighlight>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          transform: [
            {
              translateX: thirdX,
            },
            {
              translateY: thirdY,
            },
          ],
          opacity,
        }}
      >
        <TouchableHighlight
          onPress={() => {}}
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE / 2,
            height: SIZE / 2,
            borderRadius: SIZE / 4,
            backgroundColor: '#368dff',
          }}
        >
          <TouchableOpacity
            activeOpacity={2}
            onPress={() => {
              toggleView('menu');
              setTimeout(() => {
                activeButton();
                navigation.navigate('ExchangeRequest');
              }, 270);
            }}
          >
            <Image
              style={{ width: 21, resizeMode: 'contain' }}
              source={require('../assets/front/currency_exchange_text.png')}
            />
          </TouchableOpacity>
        </TouchableHighlight>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          transform: [
            {
              translateX: fourthX,
            },
            {
              translateY: fourthY,
            },
          ],
          opacity,
        }}
      >
        <TouchableHighlight
          onPress={() => {}}
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE / 2,
            height: SIZE / 2,
            borderRadius: SIZE / 4,
            backgroundColor: '#105943',
          }}
        >
          <TouchableOpacity
            activeOpacity={2}
            onPress={() => {
              toggleView('menu');
              setTimeout(() => {
                activeButton();
                navigation.navigate('MyHistory');
              }, 270);
            }}
          >
            <Image
              style={{ width: 30, resizeMode: 'contain' }}
              source={require('../assets/front/transaction_details_text.png')}
            />
          </TouchableOpacity>
        </TouchableHighlight>
      </Animated.View>
      <MainImageWarpper>
        <TouchableHighlight
          onPress={() => toggleView('button')}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
          }}
        >
          <Animated.View
            style={{
              transform: [{ rotate: rotation }],
            }}
          >
            <Image
              width={23}
              style={{ resizeMode: 'contain' }}
              source={require('../assets/front/nav_icon0.png')}
            />
          </Animated.View>
        </TouchableHighlight>
      </MainImageWarpper>
    </View>
  );
});
