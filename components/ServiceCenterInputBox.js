import React from 'react';
import styled from 'styled-components';
import constants from "../constants"

const VerticalBox = styled.View`
  flex-direction: column;
  width: 100%;
`;

const TextInput = styled.TextInput`
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  height: ${props => (props.height ? props.height : 'auto')};
  padding-top: ${props => (props.paddingTop ? props.paddingTop : '5px')};
  padding-bottom: ${props =>
    props.paddingBottom ? props.paddingBottom : '5px'};
  padding-left: ${props => (props.paddingLeft ? props.paddingLeft : '5px')};
  padding-right:${props => (props.paddingRight ? props.paddingRight : '5px')}
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)};
  height: ${props => (props.height ? props.height : 'auto')};
  background-color: white;
`;

function ServiceCenterInputBox({
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  value = '',
  onChangeText,
  height,
  multiline,
  textAlignVertical,
  autoCorrect = false,
  maxLength,
}) {
  return (
    <VerticalBox>
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        height={height}
        textAlignVertical={textAlignVertical}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        scrollEnabled={false}
      ></TextInput>
    </VerticalBox>
  );
}

export default ServiceCenterInputBox;
