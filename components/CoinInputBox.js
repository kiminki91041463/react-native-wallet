import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';

const Container = styled.View`
  margin: 15px auto;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
  width: ${props =>
    props.isModalWidth ? constants.width * 0.8 : constants.width * 0.85};
`;

const TextInput = styled.TextInput`
  width: ${props =>
    props.isModalWidth ? constants.width * 0.7 : constants.width * 0.7};
  height: 40px;
  color: black;
  
  text-align: left;
  font-size: 16px;
`;

const Text = styled.Text`
  width: ${constants.width * 0.15};
  color: #105943;
  height: 30px;
  font-size: 20px;
  text-align: right;
  margin-right: 15px;
  padding-right: ${props => (props.paddingRight ? props.paddingRight : 0)};
`;

const ClearButton = styled.TouchableOpacity`
  position: absolute;
  right: 17%;
  width: 30px;
`;

const ClearBtnBox = styled.View`
  margin: 0 auto;
`;

const ClearImage = styled.Image``;

const CoinInputBox = ({
  value,
  setCoinValue,
  keyboardType = 'default',
  autoCapitalize = 'none',
  returnKeyType = 'done',
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = true,
  text = 'KRWG',
  modalVisible = false,
  paddingRight = null,
  isModalWidth = false,
  type = true,
  editable = true,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const clearText = () => {
    if (value && !modalVisible) {
      if (type) {
        return setCoinValue('');
      } else {
        return setCoinValue(userState => ({ ...userState, coinValue: '' }));
      }
    }
  };

  return (
    <Container
      style={
        isFocus
          ? {
              borderBottomColor: '#105943',
            }
          : {
              borderBottomColor: '#dcdcdc',
            }
      }
      isModalWidth={isModalWidth}
    >
      <TextInput
        onFocus={() => setIsFocus(true)}
        onChangeText={onChange}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        value={value}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={autoCorrect}
        isModalWidth={isModalWidth}
        editable={editable}
      ></TextInput>
      {value ? (
        <ClearButton onPress={() => clearText()}>
          <ClearBtnBox>
            <ClearImage
              style={{ resizeMode: 'contain', width: 15 }}
              source={require('../assets/front/clearButton.png')}
            />
          </ClearBtnBox>
        </ClearButton>
      ) : null}
      <Text paddingRight={paddingRight}>{text}</Text>
    </Container>
  );
};

CoinInputBox.propTypes = {
  value: PropTypes.string.isRequired,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
  ]),
  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
  onChange: PropTypes.func.isRequired,
  returnKeyType: PropTypes.oneOf(['done', 'go', 'next', 'search', 'send']),
  onSubmitEditing: PropTypes.func,
  autoCorrect: PropTypes.bool,
  setCoinValue: PropTypes.func,
  text: PropTypes.string,
  modalVisible: PropTypes.bool,
  paddingRight: PropTypes.number,
  isModalWidth: PropTypes.bool,
};

export default CoinInputBox;
