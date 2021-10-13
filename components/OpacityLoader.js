import React from 'react';
import styled from 'styled-components';
import { Dimensions } from 'react-native';
import Loader from './Loader';

const View = styled.View`
  z-index: 1;
  position: absolute;
  width: ${Dimensions.get('screen').width}px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const OpacityView = styled.View`
  z-index: 1;
  position: absolute;
  width: ${Dimensions.get('screen').width}px;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: grey;
  opacity: 0.3;
`;

function OpacityLoader() {
  return (
    <>
      <OpacityView />
      <View>
        <Loader />
      </View>
    </>
  );
}

export default OpacityLoader;
