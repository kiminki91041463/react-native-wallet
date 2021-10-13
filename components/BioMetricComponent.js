import React from 'react';
import styled, { withTheme } from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bioMetricColor};
`;

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Touchable = styled.TouchableOpacity`
  width: 30%;
  align-items: center;
  justify-content: center;
`;

const FingerPrintImage = styled.Image`
  width: 30%;
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  margin-bottom: 10%;
`;

const BioMetricComponent = ({
  text,
}) => {
  return (
    <>
      <Container>
        <View>
          {
            <>
              <FingerPrintImage
                style={{
                  resizeMode: 'contain',
                  width: '30%',
                  height: '30%',
                  marginBottom: 10,
                }}
                source={require('../assets/front/fingerprint_recognition_img.png')}
              />
              <Text>{text}</Text>
              <FingerPrintImage
                style={{ resizeMode: 'contain' }}
                source={require('../assets/front/fingerprint_recognition_icon2.png')}
              />
            </>
          }
        </View>
      </Container>
    </>
  );
};

BioMetricComponent.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  type: PropTypes.bool,
  setBioCheckPossible: PropTypes.func,
};

export default withTheme(BioMetricComponent);
