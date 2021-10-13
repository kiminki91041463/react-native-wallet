import React from 'react';
/* 아임포트 모듈을 불러옵니다. */
import IMP from 'iamport-react-native';
/* 로딩 컴포넌트를 불러옵니다. */
import Loader from '../../components/Loader';
import Toast from 'react-native-tiny-toast';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import { StackActions } from 'react-navigation';

const USER_PHONE_AUTH = gql`
  mutation userPhoneAuth($imp_uid: String!) {
    userPhoneAuth(imp_uid: $imp_uid) {
      isSuccess
      message
    }
  }
`;

function IamportCertification({ navigation }) {
  const [userPhoneAuthMutation] = useMutation(USER_PHONE_AUTH);
  /* [필수입력] 본인인증 종료 후, 라우터를 변경하고 결과를 전달합니다. */
  async function callback(response) {
    console.log(response.success);
    try {
      if (response.success) {
        const {
          data: { userPhoneAuth },
        } = await userPhoneAuthMutation({
          variables: {
            imp_uid: response.imp_uid,
          },
        });
        Toast.show(userPhoneAuth.message, { position: 0 });
        return navigation.dispatch(StackActions.popToTop());
        // return navigation.pop();
      } else {
        Toast.show('휴대폰 인증에 실패했습니다', { position: 0 });
        return navigation.pop();
      }
    } catch (error) {
      Toast.show('휴대폰 인증에 실패했습니다', { position: 0 });
      return navigation.pop();
    }
  }

  /* [필수입력] 본인인증에 필요한 데이터를 입력합니다. */
  const data = {
    merchant_uid: `mid_${new Date().getTime()}`,
    company: '아임포트',
  };

  return (
    <IMP.Certification
      userCode={'imp73929832'} // 가맹점 식별코드
      loading={<Loader height={true} />} // 웹뷰 로딩 컴포넌트
      data={data} // 본인인증 데이터
      callback={callback} // 본인인증 종료 후 콜백
    />
  );
}

// const _resetFunc = () => {
//   const resetAction = StackActions.reset({
//     index: 0,
//     actions: [NavigationActions.navigate({ routeName: 'TabNavigation' },)],
//   });
//   navigation.dispatch(resetAction);
// };

export default IamportCertification;
