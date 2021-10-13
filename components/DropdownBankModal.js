import React from 'react';
import styled from 'styled-components';
import constants from '../constants';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
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

const Touchable = styled.TouchableOpacity`
  width: ${constants.width * 0.9};
`;

const EmptyContainer = styled.View`
  height: ${(props) => props.height};
`;

const DropDownContainer = styled.View`
  width: 100%;
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

const DropdownBankModal = ({ setSelectBank, setBankModalVisible }) => {
  return (
    <DropDownContainer>
      <ScrollView
        scrollIndicatorInsets={{ right: 1 }}
        legacyImplementation={true} //가상화 뷰 사용
        removeClippedSubviews={true}
      >
        <EmptyContainer height={40} />
        {banks.map((item, idx) => {
          return (
            <Touchable
              onPress={() => {
                setSelectBank(item.value);
                setBankModalVisible(false);
              }}
              key={`a${idx}`}
            >
              <RowContainer>
                <Image source={item.image} alt={`${item.value}`} />
                <RowText>{item.label}</RowText>
              </RowContainer>
            </Touchable>
          );
        })}
        <EmptyContainer height={20} />
      </ScrollView>
    </DropDownContainer>
  );
};
export default DropdownBankModal;
DropdownBankModal.propTypes = {
  setSelectBank: PropTypes.func,
  setBankModalVisible: PropTypes.func,
};
