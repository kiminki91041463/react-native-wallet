import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled, { withTheme } from 'styled-components';
import constants from '../constants';
import PropTypes from 'prop-types';

const View = styled.View`
  width: ${constants.width * 0.9};
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 2%;
`;

const Touchable = styled.TouchableOpacity`
  border-radius: 10;
  background-color: ${props => props.theme.mainColor};
`;

const Container = styled.View`
  justify-content: center;
  height: 55px;
`;

const Text = styled.Text`
  flex: 1;
  color: ${props => props.theme.whiteTextColor};
  top: 30%;
  text-align: center;
  font-size: 17px;
`;

const AuthButton = ({ theme, text, onPress, loading = false }) => (
  <View>
    <Touchable disabled={loading} onPress={onPress}>
      <Container>
        {loading ? (
          <ActivityIndicator
            size={'large'}
            color={theme.activityIndicatorColor}
          />
        ) : (
          <Text>{text}</Text>
        )}
      </Container>
    </Touchable>
  </View>
);

AuthButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default withTheme(AuthButton);
