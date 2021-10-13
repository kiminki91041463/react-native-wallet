import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SecureStorage from 'react-native-secure-storage';
import Toast from 'react-native-tiny-toast';

const Image = styled.Image`
  width: 30;
  margin-left: 3%;
`;

const ArrowImage = styled.Image`
  /* width: 20; */
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

const ButtonText = styled.Text`
  color: black;
`;

const Wrapper = styled.View`
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
`;

const ButtonWrapper = styled.View`
  margin-top: 2;
  background-color: ${props => props.theme.subColor};
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
`;

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
  position: relative;
`;

const KeyManage = ({ navigation }) => {
  const [mnemonicExist, setMnemonicExist] = useState(null);

  const getAsyncStorage = async () => {
    const secureData = await SecureStorage.getItem('secureData');
    const parseSecureData = JSON.parse(secureData);
    if (
      parseSecureData.mnemonic !== undefined &&
      parseSecureData.mnemonic !== null
    ) {
      setMnemonicExist(true);
    } else {
      setMnemonicExist(false);
    }
  };
  useEffect(() => {
    getAsyncStorage();
  }, []);

  useEffect(() => {
    if (mnemonicExist === false) {
      Toast.show('기기에 니모닉 단어가 저장되어있지 않습니다', { position: 0 });
    }
  }, [mnemonicExist]);

  const mnemonicNotExist = () => {
    if (mnemonicExist) {
      return (
        <ButtonWrapper>
          <Touchable
            transparent
            iconLeft
            large
            block
            onPress={() =>
              navigation.navigate('Backup', {
                type: 'Mnemonic',
              })
            }
          >
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/nemonic_backup_icon.png')}
              />
            </ImageContainer>
            <Container>
              <ButtonText>니모닉 단어 백업</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
      );
    } else if (mnemonicExist === false) {
      return <></>;
    }
  };

  return (
    <>
      <Wrapper>
        {/* <HeaderText>키 관리</HeaderText> */}
        <ButtonWrapper>
          <Touchable
            onPress={() =>
              navigation.navigate('Backup', {
                type: 'Private',
              })
            }
          >
            <ImageContainer>
              <Image
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/front/private_key_backup_icon.png')}
              />
            </ImageContainer>
            <Container>
              <ButtonText>프라이빗 키 백업</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: 'contain', height: '25%' }}
              source={require('../../assets/front/arrow_icon.png')}
            />
          </Touchable>
        </ButtonWrapper>
        {mnemonicNotExist()}
      </Wrapper>
    </>
  );
};

export default KeyManage;
