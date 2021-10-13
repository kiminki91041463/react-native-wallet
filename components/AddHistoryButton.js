import React from 'react';
import styled, { withTheme } from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';

const Wrapper = styled.View`
  align-items: center;
`;

const Touchable = styled.TouchableOpacity`
  width: ${constants.width * 0.9};
  height: 55px;
  background-color: ${(props) => props.theme.mainColor};
`;

const Container = styled.View`
  margin: 3px;
  padding: 12px;
`;

const Text = styled.Text`
  color: ${(props) => props.theme.whiteTextColor};
  text-align: center;
  font-weight: 400;
  font-size: 17px;
`;

const AddTransferButton = ({ text, onPress, loading = false }) => (
  <Wrapper>
    <Touchable disabled={loading} onPress={onPress}>
      <Container>
        <Text>{text}</Text>
      </Container>
    </Touchable>
  </Wrapper>
);

AddTransferButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  mark: PropTypes.string,
};

export default withTheme(AddTransferButton);
