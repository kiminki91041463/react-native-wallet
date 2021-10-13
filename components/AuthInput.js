import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';

const Container = styled.View`
  margin: 15px auto;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
  width: ${constants.width * 0.9};
`;
const TextInput = styled.TextInput`
  width: ${constants.width * 0.9};
  height: ${(props) => (props.textHeight ? props.textHeight : '40px')};
  color: black;
  text-align: left;
`;

const AuthInput = ({
  type,
  placeholder = null,
  value = '',
  autoCapitalize = 'none',
  returnKeyType = 'done',
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = true,
  secureTextEntry = true,
  keyboardType = 'default',
}) => (
  <Container>
    {type === 'ID' ? (
      <TextInput
        secureTextEntry={false}
        placeholderTextColor="#888"
        onChangeText={onChange}
        keyboardType="email-address"
        placeholder={placeholder}
        returnKeyType={returnKeyType}
        value={value}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={autoCorrect}
      />
    ) : type === 'number' ? (
      <TextInput
        secureTextEntry={false}
        keyboardType="numeric"
        onChangeText={onChange}
        placeholder={placeholder}
        returnKeyType={returnKeyType}
        value={value}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={autoCorrect}
      />
    ) : (
      <TextInput
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="black"
        onChangeText={onChange}
        placeholder={placeholder}
        returnKeyType={returnKeyType}
        value={value}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={autoCorrect}
      />
    )}
  </Container>
);

AuthInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
  onChange: PropTypes.func.isRequired,
  returnKeyType: PropTypes.oneOf(['done', 'go', 'next', 'search', 'send']),
  onEndEditing: PropTypes.func,
  autoCorrect: PropTypes.bool,
  onSubmitEditing: PropTypes.func,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
  ]),
};

export default AuthInput;
