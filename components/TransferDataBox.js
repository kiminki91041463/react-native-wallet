import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';
import CheckBox from 'react-native-check-box';
import { setComma } from '../utils';
import { View } from 'react-native';

const Wrapper = styled.View`
  width: ${constants.width * 0.9};
  background-color: white;
  border-radius: 15;
  height: 140;
  border-radius: 15px;
  align-items: center;
  margin-top: 10;
  position: relative;
`;

const Image = styled.Image``;

const Touchable = styled.TouchableOpacity``;

const DeleteButton = styled.View`
  position: absolute;
  top: 10;
  right: 10;
`;

const Container = styled.View`
  flex: 1;
  width: 100%;
  padding-left: 10;
  justify-content: center;
`;

const Text = styled.Text`
  font-size: ${props => (props.fontSize ? props.fontSize : 14)};
  color: ${props => (props.color ? props.color : 'black')};
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
  height: ${props => (props.height ? props.height : 'auto')};
`;

const CheckBoxWarpper = styled.View`
  justify-content: space-between;
  flex-direction: row;
`;

const TextBox = styled.View`
  flex: 1;
`;

const CheckBoxMiniWarpper = styled.View`
  flex: 2;
  flex-direction: row;
  align-items: center;
`;

const TransferDataBox = ({
  nickName = null,
  receiver,
  value,
  type = false,
  setTransferDataState = null,
  idx,
  transferDataState,
  charge = 490,
}) => {
  return (
    <Wrapper>
      <Container>
        <Text
          style={{
            lineHeight: 18,
          }}
        >{`받는이 : ${
          nickName ? nickName : `${receiver.substring(0, 20)}...`
        }`}</Text>
        <Text
          style={{
            lineHeight: 18,
          }}
        >{`송금액 : ${setComma(value)}KRWG`}</Text>
        <Text
          style={{
            lineHeight: 18,
          }}
        >{`수수료 : ${type ? `-${setComma(charge)}` : '0'}KRWG`}</Text>
        <CheckBoxWarpper>
          <TextBox>
            <Text
              style={{
                lineHeight: 42,
                color: 'black',
              }}
            >
              수수료 지불자
            </Text>
          </TextBox>
          <CheckBoxMiniWarpper>
            <CheckBox
              checkedCheckBoxColor={'#105943'}
              uncheckedCheckBoxColor={'lightgrey'}
              checkBoxColor={type ? 'black' : 'lightgrey'}
              disabled={true}
              onClick={() => null}
              isChecked={type ? true : false}
            />
            <Text
              style={{
                lineHeight: 42,
                color: type ? 'black' : 'lightgrey',
              }}
            >
              본인 부담
            </Text>
            <CheckBox
              checkedCheckBoxColor={'#105943'}
              uncheckedCheckBoxColor={'lightgrey'}
              checkBoxColor={type ? 'black' : 'lightgrey'}
              onClick={() => null}
              disabled={true}
              isChecked={type ? false : true}
            />
            <Text
              style={{
                lineHeight: 42,
                color: !type ? 'black' : 'lightgrey',
              }}
            >
              상대방
            </Text>
          </CheckBoxMiniWarpper>
        </CheckBoxWarpper>
      </Container>
      {transferDataState.length > 1 ? (
        <DeleteButton>
          <Touchable
            onPress={async () => {
              console.log('idx');
              console.log(idx);
              const spliceArr = await transferDataState.filter((_, i) => {
                return i !== idx;
              });
              setTransferDataState(spliceArr);
            }}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              style={{
                width: 15,
                height: 15,
              }}
              source={require('../assets/front/close.png')}
              resizeMode={'contain'}
            />
          </Touchable>
        </DeleteButton>
      ) : null}
    </Wrapper>
  );
};

TransferDataBox.propTypes = {
  receiver: PropTypes.string.isRequired,
  value: PropTypes.string,
  charge: PropTypes.string,
  type: PropTypes.bool,
  nickName: PropTypes.string,
  setTransferDataState: PropTypes.func,
  idx: PropTypes.number,
  transferDataState: PropTypes.any,
};

export default TransferDataBox;
