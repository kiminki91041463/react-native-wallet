import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

const Touchable = styled.TouchableOpacity`
  flex: 1;
`;

const Container = styled.View`
  margin: 3px;
  background-color: ${props => props.theme.subColor};
  justify-content: center;
  align-items: center;
  height: 40px;
  /* border-radius: 5px; */
  border: 1px solid #105943;
`;
const Text2 = styled.Text`
  color: #105943;
  text-align: center;
  font-weight: 400;
  font-size: 13px;
`;

const CoinButton = ({ text, onPress, loading = false }) => (
  <Touchable disabled={loading} onPress={onPress}>
    <Container>
      {/* <Text
        allowFontScaling={false}
        style={{
          color: "#36b5b6",
          textAlign: "center",
          fontWeight: "400",
          fontSize: 13,
        }}
      >
        {text}
      </Text> */}
      <Text2 allowFontScaling={false}>{text}</Text2>
    </Container>
  </Touchable>
);

CoinButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default CoinButton;
