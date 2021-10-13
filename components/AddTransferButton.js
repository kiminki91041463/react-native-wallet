import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';

const Touchable = styled.TouchableOpacity`
  height: 80px;
  margin-top: 15;
  margin-bottom: 80px;
`;

const Container = styled.View`
  width: ${constants.width * 0.9};
  margin: 3px;
  background-color: white;
  padding: 7px;
  border-radius: 15px;
`;
const Text = styled.Text`
  color: #a9a9a9;
  text-align: center;
  font-weight: 400;
  font-size: 24px;
`;

const Mark = styled.Text`
  color: #a9a9a9;
  text-align: center;
  font-weight: 600;
  font-size: 40px;
`;

const AddTransferButton = ({ text, onPress, mark, loading = false }) => (
  <Touchable disabled={loading} onPress={onPress}>
    <Container>
      <Mark>{mark}</Mark>
      <Text>{text}</Text>
    </Container>
  </Touchable>
);

AddTransferButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  mark: PropTypes.string,
};

export default AddTransferButton;
