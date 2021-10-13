import React from 'react';
import { Picker } from '@react-native-picker/picker';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';

const Container = styled.View`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const Image = styled.Image`
  width: ${(props) => (props.width ? props.width : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  margin-right: ${(props) => (props.marginRight ? props.marginRight : 0)};
`;

const DropdownServiceCenter = ({
  InquiryType,
  setSelectOption,
  selectedValue,
}) => {
  const pickerStyle = {
    inputIOSContainer: {
      borderWidth: 1,
      borderColor: '#dcdcdc',
      borderRadius: 5,
      justifyContent: 'center',
    },
    inputIOS: {
      color: 'black',
      fontWeight: 'normal',
      paddingLeft: 10,
      width: Dimensions.get('screen').width,
      height: 30,
    },
    inputAndroidContainer: {
      borderWidth: 1,
      borderColor: '#dcdcdc',
      borderRadius: 5,
      justifyContent: 'center',
    },
    inputAndroid: {
      color: 'black',
      fontWeight: 'normal',
      paddingLeft: 10,
      width: Dimensions.get('screen').width,
      height: 30,
    },
    placeholderColor: 'grey',
  };
  return (
    <>
      <Container>
        <Picker
          style={pickerStyle}
          placeholder={{ label: '문의 유형을 선택하세요', value: null }}
          selectedValue={selectedValue}
          useNativeAndroidPickerStyle={false}
          onValueChange={(value) => {
            setSelectOption(value);
          }}
          InputAccessoryView={() => null}
          Icon={() => (
            <Image
              source={require('../assets/front/arrow_bottom.png')}
              resizeMode={'contain'}
              width={'15px'}
              height={'15px'}
              marginRight={'10px'}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          )}
        >
          {InquiryType.map(({ label, value }, idx) => {
            return <Picker.Item key={idx} label={label} value={value} />;
          })}
        </Picker>
      </Container>
    </>
  );
};
export default DropdownServiceCenter;
DropdownServiceCenter.propTypes = {
  setSelectOption: PropTypes.func,
};
