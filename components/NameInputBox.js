import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';

const Container = styled.View`
  margin: 15px auto;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  width: ${props =>
    props.isModalWidth ? constants.width * 0.8 : constants.width * 0.9};
`;
const TextInput = styled.TextInput`
  width: ${constants.width * 0.8};
  height: 45px;
  color: black;
  text-align: left;
  font-size: 20px;
  margin-right: 5px;
`;

const NameInputBox = ({
  value,
  keyboardType = 'default',
  autoCapitalize = 'none',
  returnKeyType = 'done',
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = true,
  isModalWidth = false,
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
      isModalWidth={isModalWidth}
    >
      <TextInput
        onFocus={() => setIsFocus(true)}
        onChangeText={onChange}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        value={value}
        placeholder={''}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={autoCorrect}
      />
      {/* <Image
        style={{ resizeMode: "contain" }}
        source={require("../assets/front/search_icon.png")}
      /> */}
    </Container>
  );
};

NameInputBox.propTypes = {
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
  isModalWidth: PropTypes.bool,
};

export default NameInputBox;
