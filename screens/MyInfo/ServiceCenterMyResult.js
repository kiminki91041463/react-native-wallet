import React, { useState, useCallback } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { ScrollView, RefreshControl } from 'react-native';
import styled, { withTheme } from 'styled-components';
import Modal from 'react-native-modal';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import Toast from 'react-native-tiny-toast';

import constants from '../../constants';
import Error from '../../components/Error';
import Loader from '../../components/Loader';

const SEE_MY_INQUIRY_LIST = gql`
  query seeMyInquiryList {
    seeMyInquiryList {
      id
      createdAt
      content
      isCheck
      inquiryType {
        inquiryName
      }
      inquiryReply {
        reply
      }
    }
  }
`;

const DELETE_INQUIRY = gql`
  mutation deleteInquiry($id: String!) {
    deleteInquiry(id: $id)
  }
`;

export default withTheme(({ theme, navigation }) => {
  const { loading, error, data, refetch } = useQuery(SEE_MY_INQUIRY_LIST, {
    fetchPolicy: 'network-only',
  });
  if (loading) return <Loader />;

  if (error) return <Error navigation={navigation} />;

  return (
    <ServiceCenterMyResult
      data={data.seeMyInquiryList}
      navigation={navigation}
      refetch={refetch}
      theme={theme}
    />
  );
});

const ServiceCenterMyResult = ({ theme, data, refetch }) => {
  // ============ 아코디언 변수가 담기는 state ============
  const [state, setState] = useState({
    activeSections: [],
  });
  //============= 삭제 시 inquiry 테이블 id 담는 변수 =============
  const [inquiryId, setInquiryId] = useState('');
  //============= 로딩 state =============
  const [loading, setLoading] = useState(false);
  // ============= 새로고침 =============
  const [refreshing, setRefreshing] = useState(false);
  // ============ 모달 상태 state ============
  const [isModal, setIsModal] = useState(false);
  // ============== 내 문의 글 삭제 ==============
  const [deleteInquiryMutation] = useMutation(DELETE_INQUIRY);
  // ================= 새로고침 시 실행 =================
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log(e);
      Toast.show('새로고침을\n실패했습니다', {
        position: 0,
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  // ============ 모달 팝업 닫히는 함수 ============
  const handleModal = async () => {
    setIsModal(!isModal); //ModalVisible값이 현재의 반대로 바뀜
  };

  // ============ 삭제 버튼 클릭 시 팝업되는 모달 함수 ============
  const _onDeletePopup = data => {
    setIsModal(true);
    setInquiryId(data.id);
  };

  // ============ 모달에서 확인(삭제) 버튼 클릭 시 진행되는 함수 ============
  const _onDeleteService = async () => {
    try {
      setLoading(true);
      const {
        data: { deleteInquiry },
      } = await deleteInquiryMutation({
        variables: {
          id: inquiryId,
        },
      });
      if (deleteInquiry) {
        console.log('삭제완료');
      }
      setIsModal(false);
      await refetch();
    } catch (error) {
      console.log(error);
      setIsModal(false);
    } finally {
      setLoading(false);
      setIsModal(false);
    }
  };

  // ============ 아코디언 헤더 ============
  const _renderHeader = data => {
    //android에서는 아코디언
    return (
      <WrapperList>
        <TextContainer>
          <HorizonBox justifyContent={'space-between'} alignItems={'center'}>
            <Text fontSize={'15px'} color={theme.mainColor}>
              [{data.inquiryType.inquiryName}]
            </Text>

            {data.inquiryReply &&
            data.inquiryReply.reply &&
            data.inquiryReply.reply.length > 1 ? (
              <HorizonBox alignItems={'center'} justifyContent={'flex-end'}>
                <MainBGColor
                  style={{
                    borderRadius: 5,
                    justifyContent: 'center',
                    height: 22,
                    width: 60,
                  }}
                >
                  <GradientBox>
                    <Text color={theme.whiteTextColor}>답변완료</Text>
                  </GradientBox>
                </MainBGColor>
                <View
                  style={{
                    marginLeft: 10,
                  }}
                >
                  <Image
                    style={{
                      resizeMode: 'contain',
                      height: 18,
                      width: 18,
                    }}
                    source={require('../../assets/front/pop_up_purchase_complete_icon.png')}
                  />
                </View>
              </HorizonBox>
            ) : (
              <HorizonBox alignItems={'center'} justifyContent={'flex-end'}>
                <BoaderBox>
                  <Text style={{ color: theme.mainColor }}>답변대기</Text>
                </BoaderBox>
                <TouchableOpacity onPress={() => _onDeletePopup(data)}>
                  <Image
                    style={{
                      resizeMode: 'contain',
                      height: 18,
                      width: 18,
                    }}
                    source={require('../../assets/front/close_btn.png')}
                  />
                </TouchableOpacity>
              </HorizonBox>
            )}
          </HorizonBox>
          <HorizonBox justifyContent={'space-between'} alignItems={'center'}>
            <View>
              <Text fontSize={'15px'}>
                {data.content.split(/[\n]+/)[0].length > 20
                  ? `${data.content.split(/[\n]+/)[0].substring(0, 20)}...`
                  : `${data.content.split(/[\n]+/)[0]}`}
              </Text>
            </View>
            <View>
              <Text fontSize={'13px'} color={theme.lightGrayColor}>
                {data.createdAt.substring(0, 10)}
              </Text>
            </View>
          </HorizonBox>
        </TextContainer>
      </WrapperList>
    );
  };

  // ============ 아코디언 숨겨진 컨텐츠 ============
  const _renderContent = data => {
    return (
      <WrapperContent>
        <View style={{ marginTop: 5 }}>
          <Text fontWeight={'bold'} marginBottom={'4px'}>
            제목
          </Text>
          <Text marginBottom={'20px'} style={{ lineHeight: 16 }}>
            {data.content}
          </Text>
        </View>
        <View>
          <Text fontWeight={'bold'} marginBottom={'4px'}>
            답변
          </Text>
          {data.inquiryReply &&
          data.inquiryReply.reply &&
          data.inquiryReply.reply.length > 1 ? (
            <Text style={{ lineHeight: 16 }}>{data.inquiryReply.reply}</Text>
          ) : (
            <Text style={{ lineHeight: 16 }}>
              관리자가 확인 후 신속히 답변드리겠습니다
            </Text>
          )}
        </View>
        <View style={{ marginTop: 10 }}>
          {data.inquiryReply &&
          data.inquiryReply.reply &&
          data.inquiryReply.reply.length > 1 ? (
            <Text style={{ lineHeight: 16, color: theme.grayColor }}>
              ✳︎ 답변이 달린 문의는 삭제 할 수 없습니다
            </Text>
          ) : null}
        </View>
      </WrapperContent>
    );
  };

  // ============ 아코디언 update ============
  const _updateSections = activeSections => {
    setState({ activeSections });
  };

  return (
    <>
      <Wrapper>
        <ScrollView
          scrollIndicatorInsets={{ right: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {data && data.length === 0 ? (
            <NoListContainer>
              <Image
                style={{ resizeMode: 'contain', height: '25%' }}
                source={require('../../assets/front/no_myService2.png')}
              />
              <Text fontSize={'15px'} color={theme.lightGrayColor}>
                내 문의 내역이 없습니다.
              </Text>
            </NoListContainer>
          ) : (
            <Accordion
              sections={data}
              activeSections={state.activeSections}
              renderHeader={_renderHeader}
              renderContent={_renderContent}
              onChange={_updateSections}
              underlayColor={'rgba(0,0,0,0.1)'}
              expandMultiple={true} // 섹션들이 각각 독립적으로 펴고 접혀지는 props
            />
          )}
        </ScrollView>
      </Wrapper>
      {/* =========== 삭제 버튼 클릭 시 팝업 모달 =========== */}
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
            <Text>문의 내역을 삭제하시겠습니까?</Text>
          </VerticalBox>
          <ModalButtonContainer>
            <ModalTouchable onPress={handleModal}>
              <ModalContainer>
                <CancelButtonText>아니요</CancelButtonText>
              </ModalContainer>
            </ModalTouchable>
            <ModalTouchable
              onPress={() => _onDeleteService(data)}
              disabled={loading}
            >
              <RadiusRight>
                <MainBGColor
                  style={{
                    borderBottomRightRadius: 10,
                  }}
                >
                  <ModalContainer>
                    <ButtonText>확인</ButtonText>
                  </ModalContainer>
                </MainBGColor>
              </RadiusRight>
            </ModalTouchable>
          </ModalButtonContainer>
        </VerticalBox>
      </Modal>
    </>
  );
};

const Wrapper = styled.View`
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
`;

const NoListContainer = styled.View`
  height: ${constants.height * 0.8};
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const WrapperList = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.borderBottomColor};
  padding: 3px 10px;
`;

const WrapperContent = styled.View`
  padding: 3px 10px;
  background-color: #f5f5f5;
  min-height: 100px;
`;

const TextContainer = styled.View`
  height: 55px;
  justify-content: center;
`;

const VerticalBox = styled.View`
  flex-direction: column;
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : 'flex-start'};
  align-items: ${props => (props.alignItems ? props.alignItems : 'stretch')};
  background-color: ${props => (props.bgColor ? props.bgColor : 'white')};
  padding-top: ${props => (props.paddingTop ? props.paddingTop : 0)};
  padding-bottom: ${props => (props.paddingBottom ? props.paddingBottom : 0)};
  padding-right: ${props => (props.paddingRight ? props.paddingRight : 0)};
  padding-left: ${props => (props.paddingLeft ? props.paddingLeft : 0)};
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)};
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)};
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)};
  border: ${props => (props.border ? props.border : 'none')};
  border-radius: ${props => (props.borderRadius ? props.borderRadius : 0)};
  height: ${props => (props.height ? props.height : 'auto')};
  width: ${props => (props.width ? props.width : 'auto')};
`;

const HorizonBox = styled.View`
  flex: 1;
  flex-direction: row;
  border: ${props => (props.border ? props.border : 'none')};
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : 'flex-start'};
  align-items: ${props => (props.alignItems ? props.alignItems : 'stretch')};
`;

const Text = styled.Text`
  color: ${props => (props.color ? props.color : 'black')};
  font-size: ${props => (props.fontSize ? props.fontSize : '14px')};
  padding-left: ${props => (props.paddingLeft ? props.paddingLeft : 0)};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 'normal')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)};
`;

const Image = styled.Image``;

const GradientBox = styled.View`
  align-items: center;
  justify-content: center;
`;

const BoaderBox = styled.View`
  min-width: 60px;
  height: 22px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.subColor};
  border-radius: 5px;
  border-width: 1px;
  border-color: ${props => props.theme.mainColor};
`;

const TouchableOpacity = styled.TouchableOpacity`
  margin-left: 10px;
`;

// ============== 모달 관련 styled components ==============
const ModalButtonContainer = styled.View`
  justify-content: flex-end;
  flex-direction: row;
`;

const ModalTouchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-end;
`;

const ModalContainer = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.borderBottomColor};
`;

const CancelButtonText = styled.Text`
  color: ${props => props.theme.blackTextColor};
  text-align: center;
  font-size: 17px;
`;

const RadiusRight = styled.View`
  overflow: hidden;
  border-bottom-right-radius: 10;
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.whiteTextColor};
  text-align: center;
  font-size: 17px;
`;

const View = styled.View`
  height: auto;
`;

const MainBGColor = styled.View`
  background-color: ${props => props.theme.mainColor};
`;
