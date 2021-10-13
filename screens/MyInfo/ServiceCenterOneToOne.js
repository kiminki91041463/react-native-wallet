import React, { useState, useEffect } from 'react';
import styled, { withTheme } from 'styled-components';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Vibration,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import Toast from 'react-native-tiny-toast';
import constants from '../../constants';
import DropdownServiceCenter from '../../components/DropdownServiceCenter';
import ServiceCenterInputBox from '../../components/ServiceCenterInputBox';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import { Header } from 'react-navigation-stack';

const SEE_INQUIRY_TYPE_LIST = gql`
  query seeInquiryTypeList {
    seeInquiryTypeList {
      inquiryName
      inquiryNumber
    }
  }
`;

const CREATE_INQUIRY = gql`
  mutation createInquiry($inquiryType: String!, $content: String!) {
    createInquiry(inquiryType: $inquiryType, content: $content)
  }
`;

export default withTheme(({ theme, navigation }) => {
  const { loading, error, data } = useQuery(SEE_INQUIRY_TYPE_LIST, {
    fetchPolicy: 'network-only',
  });

  if (loading) return <Loader />;

  if (error) {
    return <Error navigation={navigation} />;
  }

  //쿼리로 뽑은 data를 label과 value 값으로 나눠서 다시 저장
  const newTypes = data.seeInquiryTypeList.map((item) => {
    return { label: item.inquiryName, value: item.inquiryName };
  });

  return (
    <ServiceCenterOneToOne
      InquiryType={newTypes}
      navigation={navigation}
      theme={theme}
    />
  );
});

const ServiceCenterOneToOne = ({ theme, InquiryType, navigation }) => {
  // ============== 문의 유형 선택 시 값 담기는 state ==============
  const [selectOption, setSelectOption] = useState(null);
  // ============== 문의 내용 작성 시 값 담기는 state ==============
  const [contents, setContents] = useState(null);
  // ============ 모달 상태 state ============
  const [isModal, setIsModal] = useState(false);
  // ============ 로딩 상태 state ============
  const [loading, setLoading] = useState(false);
  const defaultArr = [{ label: '문의 유형을 선택하세요', value: null }];
  // ============== 고객센터 문의 글 작성 ==============
  const [createInquiryMutation] = useMutation(CREATE_INQUIRY);

  // ============== 문의 내용 입력 함수  ==============
  const _handleContentsInput = (value) => {
    setContents(value);
  };

  // ============== 문의 작성 완료 후 모달 닫힘 + MyInfo 페이지로 이동 ==============
  const handleModal = async () => {
    await setIsModal(!isModal); //ModalVisible값이 현재의 반대로 바뀜

    setTimeout(() => {
      navigation.navigate('ServiceCenter');
    }, 50);
  };

  useEffect(() => {
    return () => setIsModal(false);
  }, []);

  // ============== 문의하기 버튼 클릭 시 작동하는 함수 ==============
  const _onCreateInquiry = async () => {
    if (!selectOption || selectOption.length < 1) {
      return Toast.show('문의 유형을 선택해 주세요', {
        position: 0,
      });
    }
    if (!contents || contents.length < 1) {
      return Toast.show('문의 내용을 작성해 주세요', {
        position: 0,
      });
    }
    try {
      setIsModal(true);
      setLoading(true);
      const {
        data: { createInquiry },
      } = await createInquiryMutation({
        variables: {
          content: contents,
          inquiryType: selectOption,
        },
      });
      if (createInquiry) {
        return console.log('문의 생성 성공');
      }
    } catch (error) {
      Vibration.vibrate(150);
      Toast.show('문의 작성 실패\n다시 확인해주세요', {
        position: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? Header.HEIGHT + 20 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ height: '100%' }}
      >
        <ScrollView
          scrollIndicatorInsets={{ right: 1 }}
          keyboardShouldPersistTaps={'handled'} //키보드가 열려도 버튼이나 input 등이가능하도록 하는 props
          style={{ height: '100%' }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <VerticalBox
              alignItems={'center'}
              paddingLeft={'20px'}
              paddingRight={'20px'}
              paddingBottom={'100px'}
            >
              {/* ========= 최상단 멘트 2줄 ========= */}
              <VerticalBox marginTop={'40px'} alignItems={'center'}>
                <Text fontSize={'17px'} fontWeight={'bold'}>
                  그루 고객센터에서 도와드립니다
                </Text>
                <Text color={theme.lightGrayColor} marginTop={'8px'}>
                  문의내용을 상세하게 적어주세요
                </Text>
              </VerticalBox>
              {/* ========= 이미지 ========= */}
              <VerticalBox marginTop={'30px'} marginBottom={'20px'}>
                <Image
                  style={{ resizeMode: 'contain' }}
                  source={require('../../assets/front/serviceCenterImage.png')}
                />
              </VerticalBox>
              {/* ========= 문의 유형 드롭 박스 ========= */}
              <VerticalBox marginBottom={'5px'} width={'100%'}>
                <Text fontWeight={'bold'}>문의 유형</Text>
              </VerticalBox>

              <DropdownServiceCenter
                selectedValue={selectOption}
                setSelectOption={setSelectOption}
                InquiryType={defaultArr.concat(InquiryType)}
              />
              {/* ========= 상세 내용 input 박스 ========= */}
              <VerticalBox
                marginTop={'20px'}
                marginBottom={'5px'}
                width={'100%'}
              >
                <Text fontWeight={'bold'}>문의 내용</Text>
              </VerticalBox>
              <ServiceCenterInputBox
                title={'문의 내용'}
                placeholder={
                  '최대 2,000자 이내\n문의 내용 입력 시, 주민등록번호, 전화번호 등\n고객님의 소중한 개인 정보가 입력되지 않도록 유의해 주세요'
                }
                multiline
                height={'150px'}
                textAlignVertical={'top'}
                maxLength={1000}
                onChangeText={(value) => _handleContentsInput(value)}
                value={contents}
              />
            </VerticalBox>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
      <StaticButtonContainer>
        <MainBGColor>
          <StaticButton onPress={_onCreateInquiry} disabled={loading}>
            <Text
              textAlign={'center'}
              fontSize={20}
              color={theme.whiteTextColor}
            >
              문의하기
            </Text>
          </StaticButton>
        </MainBGColor>
      </StaticButtonContainer>

      {/* =============== 문의하기 버튼 클릭시 모달 =============== */}
      <Modal
        isVisible={isModal}
        style={{
          alignItems: 'center',
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
        }}
        onBackdropPress={() => handleModal()}
      >
        <VerticalBox
          borderRadius={'10px'}
          width={'300px'}
          height={'210px'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Image
            style={{
              resizeMode: 'contain',
              height: '22%',
              marginTop: 20,
            }}
            source={require('../../assets/front/pop_up_purchase_complete_icon.png')}
          />
          <VerticalBox alignItems={'center'} marginBottom={'10px'}>
            <Text>1:1문의가 등록되었습니다</Text>
            <Text marginTop={'5px'}>
              답변은 내 문의내역에서 확인 가능합니다
            </Text>
          </VerticalBox>
          <ModalButtonContainer>
            <MainBGColor style={{}}>
              <TouchableOpacity onPress={handleModal}>
                <Text
                  textAlign={'center'}
                  fontSize={14}
                  color={theme.whiteTextColor}
                >
                  확인
                </Text>
              </TouchableOpacity>
            </MainBGColor>
          </ModalButtonContainer>
        </VerticalBox>
      </Modal>
    </>
  );
};

const VerticalBox = styled.View`
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : 'flex-start'};
  align-items: ${(props) => (props.alignItems ? props.alignItems : 'stretch')};
  background-color: ${(props) => (props.bgColor ? props.bgColor : 'white')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : 0)};
  padding-bottom: ${(props) => (props.paddingBottom ? props.paddingBottom : 0)};
  padding-right: ${(props) => (props.paddingRight ? props.paddingRight : 0)};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : 0)};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)};
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)};
  margin-right: ${(props) => (props.marginRight ? props.marginRight : 0)};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)};
  border: ${(props) => (props.border ? props.border : 'none')};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 0)};
  height: ${(props) => (props.height ? props.height : 'auto')};
  width: ${(props) => (props.width ? props.width : 'auto')};
`;

const Text = styled.Text`
  color: ${(props) => (props.color ? props.color : 'black')};
  font-size: ${(props) => (props.fontSize ? props.fontSize : '14px')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 'normal')};
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : 0)};
  padding-bottom: ${(props) => (props.paddingBottom ? props.paddingBottom : 0)};
  padding-right: ${(props) => (props.paddingRight ? props.paddingRight : 0)};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : 0)};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)};
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)};
  width: ${(props) => (props.width ? props.width : 'auto')};
  min-width: ${(props) => (props.minWidth ? props.minWidth : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
`;

const Image = styled.Image`
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 0)};
  height: ${constants.height * 0.2};
  margin-bottom: 15px;
`;

const ModalButtonContainer = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 8;
  border-bottom-left-radius: 8;
  width: 100%;
`;

const TouchableOpacity = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const StaticButtonContainer = styled.View`
  position: absolute;
  bottom: 0;
`;

const StaticButton = styled.TouchableOpacity`
  width: ${constants.width};
  height: 60px;
  justify-content: center;
  align-items: center;
`;

const MainBGColor = styled.View`
  background-color: ${(props) => props.theme.mainColor};
`;
