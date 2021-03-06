import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';

const Container = styled.View`
  margin: 15px auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
  width: ${constants.width * 0.9};
  background-color : #fff;
`;

const TextInput = styled.TextInput`
  width: ${constants.width * 0.89};
  height: 40px;
  padding-left: 2%;
  color: black;
  text-align: left;
  font-size: 16px;
  background-color: ${props => (props.bgColor ? props.bgColor : '#fff')};
`;
const CreditNumberInputBox = ({
  value,
  keyboardType = 'default',
  autoCapitalize = 'none',
  returnKeyType = 'done',
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = true,
  editable = true,
  placeholder = '- 생략하고 입력'
}) => {
  const [isFocus, setIsFocus] = useState(false);
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
    >
      <TextInput
        onFocus={() => setIsFocus(true)}
        onChangeText={onChange}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={'#aaa'}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={autoCorrect}
        // bgColor={!editable ? '#' : null}
        editable={editable}
      />
    </Container>
  );
};

CreditNumberInputBox.propTypes = {
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
};

export default CreditNumberInputBox;
