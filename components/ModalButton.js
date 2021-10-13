import React from 'react';
import styled from 'styled-components';
import constants from '../constants';
import PropTypes from 'prop-types';

const Touchable = styled.TouchableOpacity`
  padding: 2px;
`;
const Container = styled.View`
    display : flex;
    /* background-color:${props => props.theme.blueColor}; */
    padding : 10px;
    border-radius:4px;
    width:${constants.width / 4};
`;
const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

const ModalButton = ({ onPress, text }) => (
  <Touchable disabled={false} onPress={onPress}>
    <Container>
      <Text>{text}</Text>
    </Container>
  </Touchable>
);

ModalButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ModalButton;
