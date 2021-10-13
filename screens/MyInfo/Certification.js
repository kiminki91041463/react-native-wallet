import React, { useState, useCallback } from 'react';
import styled, { withTheme } from 'styled-components';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import { ScrollView, RefreshControl } from 'react-native';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import Toast from 'react-native-tiny-toast';
import PropTypes from 'prop-types';

const CenterImage = styled.Image`
  margin: 30px auto;
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

const ButtonText = styled.Text`
  color: black;
`;

const TextHeader = styled.Text`
  color: ${(props) => (props.textColor ? props.theme.mainColor : 'black')};
  font-weight: bold;
  font-size: ${(props) => (props.fontSize ? props.fontSize : '20px')};
`;

const TextWrapper = styled.Text`
  overflow: hidden;
  text-align: center;
  margin: 20px;
`;

const Text = styled.Text`
  color: black;
  text-align: center;
  font-size: 16px;
  margin: 10px;
`;

const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.backGroundColor};
`;

const ButtonWrapper = styled.View`
  background-color: ${(props) =>
    props.bgColor ? props.theme.lightGray : props.theme.subColor};
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
`;

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
  position: relative;
`;

const MiniTouchable = styled.TouchableOpacity`
  position: absolute;
  right: 5%;
  top: 30%;
`;

const MiniContainer = styled.View`
  width: 45;
  height: 25;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: ${(props) =>
    props.bgColor === 'SUCCESS'
      ? props.theme.mainColor
      : props.bgColor === 'FAIL'
      ? props.theme.redColor
      : props.theme.subColor};
  border-width: 1px;
  border-color: ${(props) =>
    props.bgColor === 'FAIL' ? '#ff6e6e' : '#105943'};
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
      <Certification
        data={data.isAuthUser}
        navigation={navigation}
        refetch={refetch}
      />
    );
  }
});
const Certification = ({ data, navigation, refetch }) => {
  const [refresh, setRefresh] = useState(false);
  const emailBtnFunc = () => {
    if (data.bool[0]) {
      return Toast.show('이미 인증하셨습니다', { position: 0 });
    } else {
      return navigation.navigate('EmailAuth');
    }
  };

  const phoneBtnFunc = () => {
    if (data.bool[1]) {
      return Toast.show('이미 인증하셨습니다', { position: 0 });
    } else if (!data.bool[0]) {
      return Toast.show('이메일 인증을 먼저 완료해주세요', {
        position: 0,
      });
    } else {
      return navigation.navigate('PhoneAuth');
    }
  };

  const identifyBtnFunc = () => {
    if (data.status === 'SUCCESS') {
      return Toast.show('이미 인증하셨습니다', { position: 0 });
    } else if (data.status === 'WAIT') {
      return Toast.show('심사가 진행중입니다', { position: 0 });
    } else if (!data.bool[0] || !data.bool[1]) {
      return Toast.show('이메일,휴대폰 인증을 먼저 완료해주세요', {
        position: 0,
      });
    } else {
      return navigation.navigate('IdentifyAuth');
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefresh(true);
      await refetch();
    } catch (e) {
      console.log(e);
      Toast.show('새로고침을\n실패했습니다', {
        position: 0,
      });
    } finally {
      setRefresh(false);
    }
  }, []);

  return (
    <>
      <Wrapper>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          scrollIndicatorInsets={{ right: 1 }}
          style={{ height: '100%' }}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        >
          <TextWrapper>
            <TextHeader
              numberOfLines={1}
              ellipsizeMode="tail"
            >{`회원님의 현재 보안 등급`}</TextHeader>
            <TextHeader
              textColor={true}
              numberOfLines={1}
              ellipsizeMode="tail"
            >{`  레벨${
              data.bool.lastIndexOf(true) + 1 === 2 && data.status === 'SUCCESS'
                ? 3
                : data.bool.lastIndexOf(true) + 1
            }`}</TextHeader>
          </TextWrapper>
          <Text>
            {data.bool.every((item) => {
              return item;
            })
              ? '모든 인증을 완료하였습니다.\n그루 앱의 모든 서비스를 이용하실 수 있습니다.'
              : `디지털 자산(KRWG)의 구매, 송금 및 환전\n거래는 모든 인증을 완료하여야 합니다.`}
          </Text>
          <CenterImage
            style={{
              resizeMode: 'contain',
            }}
            source={require('../../assets/front/certification_icon.png')}
          />
          <ButtonWrapper bgColor={data.bool[0]}>
            <Touchable
              onPress={() => {
                emailBtnFunc();
              }}
            >
              <ImageContainer>
                <TextHeader
                  textColor={true}
                  fontSize={16}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >{` 레벨1`}</TextHeader>
              </ImageContainer>
              <Container>
                <ButtonText>이메일 인증</ButtonText>
              </Container>
              <MiniTouchable
                onPress={() => {
                  emailBtnFunc();
                }}
              >
                <MiniContainer bgColor={data.bool[0] ? 'SUCCESS' : null}>
                  <ButtonText
                    style={{
                      color: data.bool[0] ? '#ffffff' : '#105943',
                    }}
                  >
                    {data.bool[0] ? '완료' : '인증'}
                  </ButtonText>
                </MiniContainer>
              </MiniTouchable>
            </Touchable>
          </ButtonWrapper>
          <ButtonWrapper bgColor={data.bool[1]}>
            <Touchable
              onPress={() => {
                phoneBtnFunc();
              }}
            >
              <ImageContainer>
                <TextHeader
                  textColor={true}
                  fontSize={16}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >{` 레벨2`}</TextHeader>
              </ImageContainer>
              <Container>
                <ButtonText>휴대폰 본인인증</ButtonText>
              </Container>
              <MiniTouchable
                onPress={() => {
                  phoneBtnFunc();
                }}
              >
                <MiniContainer bgColor={data.bool[1] ? 'SUCCESS' : null}>
                  <ButtonText
                    style={{
                      color: data.bool[1] ? '#ffffff' : '#105943',
                    }}
                  >
                    {data.bool[1] ? '완료' : '인증'}
                  </ButtonText>
                </MiniContainer>
              </MiniTouchable>
            </Touchable>
          </ButtonWrapper>

          <ButtonWrapper bgColor={data.status === 'SUCCESS' ? true : false}>
            <Touchable
              onPress={() => {
                identifyBtnFunc();
              }}
            >
              <ImageContainer>
                <TextHeader
                  textColor={true}
                  fontSize={16}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >{` 레벨3`}</TextHeader>
              </ImageContainer>
              <Container>
                <ButtonText>신분증 인증</ButtonText>
              </Container>
              <MiniTouchable
                onPress={() => {
                  identifyBtnFunc();
                }}
              >
                <MiniContainer bgColor={data.status}>
                  <ButtonText
                    style={{
                      color:
                        data.status === 'SUCCESS' || data.status === 'FAIL'
                          ? '#ffffff'
                          : '#105943',
                    }}
                  >
                    {data.status === 'NOAPPLY'
                      ? '인증'
                      : data.status === 'WAIT'
                      ? '심사중'
                      : data.status === 'FAIL'
                      ? '재인증'
                      : '완료'}
                  </ButtonText>
                </MiniContainer>
              </MiniTouchable>
            </Touchable>
          </ButtonWrapper>
        </ScrollView>
      </Wrapper>
    </>
  );
};
Certification.propTypes = {
  data: PropTypes.any,
};
