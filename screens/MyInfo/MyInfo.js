import React from 'react';
import styled, { withTheme } from 'styled-components';
import { basicState } from '../../recoil/recoilAtoms';
import { useRecoilState } from 'recoil';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const Image = styled.Image`
  width: 30;
  margin-left: 3%;
`;

const ArrowImage = styled.Image`
  position: absolute;
  top: 20;
  right: 10;
`;

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

const TextWrapper = styled.Text`
  overflow: hidden;
`;

const ButtonText = styled.Text`
  color: black;
`;

const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.backGroundColor};
`;

const TextHeader = styled.Text`
  color: ${(props) => (props.textColor ? props.theme.mainColor : 'black')};
  font-weight: bold;
`;

const ButtonWrapper = styled.View`
  margin-top: 2;
  background-color: ${(props) => props.theme.subColor};
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
`;

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
  position: relative;
`;

const IS_AUTH_USER = gql`
  query isAuthUser {
    isAuthUser {
      bool
      status
    }
  }
`;

export default withTheme(({ navigation }) => {
  const { loading, data, error, refetch } = useQuery(IS_AUTH_USER);

  if (error) {
    return <Error navigation={navigation} route={'myInfo'} />;
  }

  if (loading) {
    return <Loader />;
  }

  if (!loading && !error) {
    return (
      <MyInfo
        data={data.isAuthUser}
        navigation={navigation}
        refetch={refetch}
      />
    );
  }
});
const MyInfo = ({ data, navigation, refetch }) => {
  //recoil
  const [{ authType: prevAuthType }, setRecoilBasicState] = useRecoilState(
    basicState,
  );

  useEffect(() => {
    navigation.addListener('willFocus', () => {
      refetch();
    });
  }, []);

  //recoil setter func
  const changeAuthTypeFunc = async () => {
    await AsyncStorage.setItem('authType', 'pin');
    return setRecoilBasicState((prev) => ({ ...prev, authType: 'pin' }));
  };

  return (
    <>
      <Wrapper>
        <ButtonWrapper>
          <Touchable onPress={() => navigation.navigate('KeyManage')}>
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/backup_icon.png')}
              />
            </ImageContainer>
            <Container>
              <ButtonText>지갑 정보 백업</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable onPress={() => navigation.navigate('AppLock')}>
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/fingerprint_setting_icon.png')}
              />
            </ImageContainer>
            <Container>
              <ButtonText>지문 설정</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable
            onPress={async () => {
              await changeAuthTypeFunc();
              navigation.navigate('BioMetric', {
                routeName: 'ResetPIN',
                prevAuthType,
              });
            }}
          >
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/pin_initialization_icon.png')}
              />
            </ImageContainer>
            <Container>
              <ButtonText>PIN번호 재설정</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable onPress={() => navigation.navigate('ServiceCenter')}>
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/serviceCenter.png')}
              />
            </ImageContainer>
            <Container>
              <ButtonText>고객센터</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>

        <ButtonWrapper>
          <Touchable onPress={() => navigation.navigate('Certification')}>
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/certification.png')}
              />
            </ImageContainer>
            <Container>
              <TextWrapper>
                <ButtonText>{`본인 인증`}</ButtonText>
                <ButtonText>{`  [보안 등급`}</ButtonText>
                <TextHeader
                  textColor={true}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >{`  레벨${
                  data.bool.lastIndexOf(true) + 1 === 2 &&
                  data.status === 'SUCCESS'
                    ? 3
                    : data.bool.lastIndexOf(true) + 1
                }`}</TextHeader>
                <ButtonText>{`]`}</ButtonText>
              </TextWrapper>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
};
MyInfo.propTypes = {
  data: PropTypes.any,
};
