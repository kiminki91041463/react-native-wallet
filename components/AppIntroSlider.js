import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import constants from '../constants';
import styled, { withTheme } from 'styled-components';
import { basicState } from '../recoil/recoilAtoms';
import { useSetRecoilState } from 'recoil';

const SkipButton = styled.View`
  position: absolute;
  left: 28%;
  top: 70%;
  z-index: 9999;
  width: 44%;
`;

const Text = styled.Text`
  color:${(props) => props.theme.whiteTextColor}
  text-align: center;
  padding: 10px;
  font-size: 20px;
`;

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#105943',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // image: {
  //   width: constants.width,
  //   height: constants.height
  // }
});

const slides = [
  {
    key: 'somethun',
    title: 'Title 1',
    image: require('../assets/front/introSlider_image1.jpg'),
    imageStyle: {
      width: constants.width,
      height: constants.height,
    },
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    image: require('../assets/front/introSlider_image2.jpg'),
    imageStyle: {
      width: constants.width,
      height: constants.height,
    },
  },
  {
    key: 'somethun-three',
    title: 'Title 3',
    image: require('../assets/front/introSlider_image3.jpg'),
    imageStyle: {
      width: constants.width,
      height: constants.height,
    },
  },
  {
    key: 'somethun-four',
    title: 'Title 4',
    image: require('../assets/front/introSlider_image4.jpg'),
    imageStyle: {
      width: constants.width,
      height: constants.height,
    },
  },
  // {
  //   key: "somethun-five",

  //   title: "Title 5",
  //   image: require("../assets/front/new_intro_slider_5.png"),
  //   imageStyle: {
  //     width: constants.width,
  //     height: constants.height
  //   }
  //   // backgroundColor: "#0033cc"
  // }
  // {
  //   key: "somethun1",
  //   title: "Title 6",
  //   image: require("../assets/images/wallet_creation_img.png"),
  //   backgroundColor: "#9900ff"
  // }
];

const AppIntroSliderComponent = ({ theme }) => {
  const setRecoilBasicState = useSetRecoilState(basicState);
  const onPressDone = async () => {
    await AsyncStorage.setItem('beginning', 'true');
    return setRecoilBasicState((prev) => ({ ...prev, beginning: true }));
  };

  const _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="arrow-right" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };
  const _renderDoneButton = () => {
    return (
      <TouchableOpacity onPress={() => onPressDone()}>
        <View style={styles.doneButtonCircle}>
          <Icon name="check" color="rgba(255, 255, 255, .9)" size={24} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <AppIntroSlider
        slides={slides}
        renderDoneButton={_renderDoneButton}
        renderNextButton={_renderNextButton}
        activeDotStyle={{ backgroundColor: theme.mainColor }}
        // renderSkipButton={_renderSkipButton}
      />
      <SkipButton>
        <TouchableOpacity
          style={{ borderRadius: 5, backgroundColor: theme.mainColor }}
          onPress={() => onPressDone()}
        >
          <Text>그루 시작하기</Text>
        </TouchableOpacity>
      </SkipButton>
    </>
  );
};
export default withTheme(AppIntroSliderComponent);
