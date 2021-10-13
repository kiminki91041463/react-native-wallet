import React from 'react';
import styled, { withTheme } from 'styled-components';
import { ActivityIndicator, Text } from 'react-native';

const Container = styled.View`
  height: ${(props) => (props.height ? '100%' : '55px')};
  align-items: center;
  justify-content: ${(props) => (props.height ? 'flex-start' : 'center')};
  flex: 1;
`;

const Loader = ({ theme, height }) => {
  return (
    <Container height={height}>
      <ActivityIndicator size={'large'} color={theme.mainColor} />
    </Container>
  );
};
export default withTheme(Loader);
