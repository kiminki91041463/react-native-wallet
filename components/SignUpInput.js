import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';
import styles from '../styles';

const Container = styled.View`
  margin-bottom: 12px;
`;

const HorizonBox = styled.View`
  flex-direction: row;
`;

const Title = styled.Text`
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 5px;
  flex: 1;
`;

const TextInput = styled.TextInput`
  width: ${constants.width / 1.05};
  padding: 12px;
  background-color: white;
  border: 1px solid ${props => props.theme.lightGreyColor};
  border-radius: 4px;
  font-size: 15px;
`;

const ErrorText = styled.Text`
  color: red;
  padding-left: 6px;
  width: 100%;
  font-size: 12px;
  flex: ${props => (props.errorFlex ? props.errorFlex : 4)};
`;

const SignUpInput = ({
  title = null,
  placeholder = '',
  value,
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = false,
  keyboardType = 'default',
  secureTextEntry = false,
  onBlur = null,
  error = null,
  errorFlex = null,
  editable = true,
}) => (
  <Container>
    <HorizonBox>
      {title ? <Title>{title}</Title> : null}
      {error && <ErrorText errorFlex={errorFlex}>{error}</ErrorText>}
    </HorizonBox>

    <TextInput
      placeholder={placeholder}
      placeholderTextColor={styles.darkGreyColor}
      value={value}
      onChangeText={onChange}
      onSubmitEditing={onSubmitEditing}
      autoCorrect={autoCorrect}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      onBlur={onBlur}
      editable={editable}
    />
  </Container>
);

SignUpInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func,
  autoCorrect: PropTypes.bool,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
  ]),
  secureTextEntry: PropTypes.bool,
  title: PropTypes.string,
  error: PropTypes.string,
  onBlur: PropTypes.func,
  errorFlex: PropTypes.number,
  editable: PropTypes.bool,
};

export default SignUpInput;
