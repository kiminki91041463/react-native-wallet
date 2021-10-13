import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.View`
  margin-top: 15px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
`;

const Text = styled.Text`
  flex: 1;
  color: white;
  padding-left: 2%;
`;

const TextInput = styled.TextInput`
  flex: 4;
  height: auto;
  /* border: 1px solid blue;0 */
  padding-right: 2%;
  color: white;
  text-align: right;
`;

const NewCoinInputBox = ({
  value,
  keyboardType = 'default',
  autoCapitalize = 'none',
  returnKeyType = 'done',
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = true,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <Container
      style={
        isFocus
          ? {
              borderBottomColor: '#5d4ce3',
            }
          : {
              borderBottomColor: '#555363',
            }
      }
    >
      <Text>금액 입력</Text>
      <TextInput
        onFocus={() => setIsFocus(true)}
        onChangeText={onChange}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        value={value}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={autoCorrect}
      />
      <Text>Coin</Text>
    </Container>
  );
};

NewCoinInputBox.propTypes = {
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

export default NewCoinInputBox;
