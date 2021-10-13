import React from 'react';
import { Picker } from '@react-native-picker/picker';
import styled from 'styled-components';
import constants from '../constants';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';

import {
  gwangju,
  gugmin,
  nonghyeob,
  busan,
  saemaulGeumgo,
  suhyeob,
  shinhan,
  sinhyeob,
  woori,
  jeonbuk,
  jeju,
  kakao,
  hangugCity,
  BNKgyeongnam,
  DGBdaegu,
  IBKgieob,
  KEBhana,
  SCjeil,
} from '../assets/front/bank';

const DropDownContainer = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
  width: ${constants.width * 0.9};
  margin: 15px 5px 15px 15px;
  justify-content: space-between;
  text-align: right;
  color: gray;
  font-size: 30px;
`;

const Image = styled.Image`
  width: 22px;
  resize-mode: contain;
  margin-left: 10;
  margin-right: 10;
`;

const RowContainer = styled.View`
  height: 28px;
  margin: 7px;
  flex-direction: row;
  align-items: center;
`;

const RowText = styled.Text`
  color: black;
  font-size: 20px;
`;

const banks = [
  // { image : null, label: '은행선택', value: null },
  { image: gugmin, label: '국민', value: '국민' },
  { image: KEBhana, label: 'KEB하나', value: 'KEB하나' },
  { image: woori, label: '우리', value: '우리' },
  { image: shinhan, label: '신한', value: '신한' },
  { image: SCjeil, label: 'SC제일', value: 'SC제일' },
  { image: hangugCity, label: '한국씨티', value: '한국씨티' },
  { image: kakao, label: '카카오', value: '카카오' },
  { image: IBKgieob, label: 'IBK기업', value: 'IBK기업' },
  { image: nonghyeob, label: '농협', value: '농협' },
  { image: suhyeob, label: '수협', value: '수협' },
  { image: busan, label: '부산', value: '부산' },
  { image: gwangju, label: '광주', value: '광주' },
  { image: BNKgyeongnam, label: 'BNK경남', value: 'BNK경남' },
  { image: DGBdaegu, label: 'DGB대구', value: 'DGB대구' },
  { image: jeonbuk, label: '전북', value: '전북' },
  { image: jeju, label: '제주', value: '제주' },
  { image: sinhyeob, label: '신협', value: '신협' },
  { image: saemaulGeumgo, label: '새마을금고', value: '새마을금고' },
];

const DropdownBank = ({ setSelectBank, selectedValue }) => {
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
      height: 15,
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
      height: 15,
    },
    placeholderColor: 'grey',
  };
  return (
    <>
      <DropDownContainer>
        <Picker
          style={pickerStyle}
          placeholder={{ label: '은행선택 ▽', value: null }}
          selectedValue={selectedValue}
          useNativeAndroidPickerStyle={false}
          onValueChange={(value) => {
            setSelectBank(value);
          }}
          InputAccessoryView={() => null}
        >
          {banks.map(({ image, label, value }, idx) => {
            return <Picker.Item key={idx} label={label} value={value} />;
          })}
        </Picker>
      </DropDownContainer>
    </>
  );
};
export default DropdownBank;
DropdownBank.propTypes = {
  setSelectBank: PropTypes.func,
};
