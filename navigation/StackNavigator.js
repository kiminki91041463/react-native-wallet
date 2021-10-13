import React from 'react';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import TabNavigation from './TabNavigation';
import TabNavigationMyInfo from './TabNavigationMyInfo';
import KeyManage from '../screens/MyInfo/KeyManage';
import AppLock from '../screens/MyInfo/AppLock';
import Backup from '../screens/MyInfo/Backup';
// import ResetPIN from '../screens/MyInfo/ResetPIN';
import BioMetric from '../screens/Auth/BioMetric';
import TransferSecond from '../screens/Tabs/TransferSecond';
import CoinHistory from '../screens/History/CoinHistory';
import PurchaseHistory from '../screens/History/PurchaseHistory';
import ExchangeHistory from '../screens/History/ExchangeHistory';
import PurchaseRequest from '../screens/Tabs/PurchaseRequest';
import MyInfo from '../screens/MyInfo/MyInfo';
import ExchangeRequest from '../screens/Tabs/ExchangeRequest';
import ExchangeSecond from '../screens/Tabs/ExchangeSecond';
import MyHistory from '../screens/Tabs/MyHistory';
import EmailAuth from '../screens/MyInfo/EmailAuth';
import PhoneAuth from '../screens/MyInfo/PhoneAuth';
import IdentifyAuth from '../screens/MyInfo/IdentifyAuth';
import IdentifyCardAuth from '../screens/MyInfo/IdentifyCardAuth';
import DriverLicenseAuth from '../screens/MyInfo/DriverLicenseAuth';
import ServiceCenter from '../screens/MyInfo/ServiceCenter';
import Certification from '../screens/MyInfo/Certification';
import IamportCertification from '../screens/Auth/IamportCertification';
import ServiceCenterMyResult from '../screens/MyInfo/ServiceCenterMyResult';
import ServiceCenterOneToOne from '../screens/MyInfo/ServiceCenterOneToOne';
import QRscanner from '../screens/Tabs/QRscanner';
import { setComma } from '../utils';

import Transfer from '../screens/Tabs/Transfer';

const MainNavigation = createStackNavigator(
  {
    TabNavigation: {
      screen: TabNavigation,
      navigationOptions: {
        headerShown: false,
      },
    },
    Transfer: {
      screen: Transfer,
      navigationOptions: {
        headerTitle: '송금',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerTintColor: '#000',
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    EmailAuth: {
      screen: EmailAuth,
      navigationOptions: {
        headerTitle: '이메일 인증',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    PhoneAuth: {
      screen: PhoneAuth,
      navigationOptions: {
        headerTitle: '휴대폰 본인인증',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    IdentifyAuth: {
      screen: IdentifyAuth,
      navigationOptions: {
        headerTitle: '신분증 선택',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    IdentifyCardAuth: {
      screen: IdentifyCardAuth,
      navigationOptions: {
        headerTitle: '주민등록증 인증',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    DriverLicenseAuth: {
      screen: DriverLicenseAuth,
      navigationOptions: {
        headerTitle: '운전면허증 인증',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    QRscanner: {
      screen: QRscanner,
      navigationOptions: {
        headerTitle: 'QR코드 스캐너',
        headerTintColor: '#000',
        headerRight: false,
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    TransferSecond: {
      screen: TransferSecond,
      navigationOptions: {
        headerTitle: '송금 주소',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    MyHistory: {
      screen: MyHistory,
      navigationOptions: {
        headerTitle: '거래 내역',
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    MyInfo: {
      screen: MyInfo,
      navigationOptions: {
        headerTitle: '내 정보',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    CoinHistory: {
      screen: CoinHistory,
      navigationOptions: {
        headerTitle: '거래 내역',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    PurchaseHistory: {
      screen: PurchaseHistory,
      navigationOptions: {
        headerTitle: '구매 내역',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    ExchangeHistory: {
      screen: ExchangeHistory,
      navigationOptions: {
        headerTitle: '환전 내역',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    PurchaseRequest: {
      screen: PurchaseRequest,
      navigationOptions: {
        headerTitle: '구매 신청',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    ExchangeRequest: {
      screen: ExchangeRequest,
      navigationOptions: {
        headerTitle: '환전 신청',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    ExchangeSecond: {
      screen: ExchangeSecond,
      navigationOptions: ({ navigation }) => {
        const hedearTitleVal = navigation.getParam('headerTitle');
        return {
          headerTitle: `${setComma(hedearTitleVal)}원 출금 예정`,
          headerTintColor: '#000',
          headerTitleStyle: {
            color: 'black',
            fontSize: 17,
            fontWeight: 'normal',
          },
          headerStyle: {
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#dcdcdc',
            backgroundColor: '#fff',
          },
        };
      },
    },
    KeyManage: {
      screen: KeyManage,
      navigationOptions: {
        headerTitle: '백업',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    AppLock: {
      screen: AppLock,
      navigationOptions: {
        headerTitle: '지문 설정',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },

    BioMetric: {
      screen: BioMetric,
      navigationOptions: {
        headerShown: false,
      },
    },
    IamportCertification: {
      screen: IamportCertification,
      navigationOptions: {
        // headerShown: false,
        headerTitle: 'PASS',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerRight: null,
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    Backup: {
      screen: Backup,
      navigationOptions: {
        // headerShown: false, //여기서는 헤더를 숨겨주고, 그 페이지 내에서 헤더를 새로만들어보자
        headerTitle: '백업',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    // ResetPIN: {
    //   screen: ResetPIN,
    //   navigationOptions: {
    //     headerTitle: 'PIN 초기화',
    //     headerTintColor: '#000',
    //     headerTitleStyle: {
    //       color: 'black',
    //       fontSize: 17,
    //       fontWeight: 'normal',
    //     },
    //     headerStyle: {
    //       elevation: 0,
    //       borderBottomWidth: 1,
    //       borderBottomColor: '#dcdcdc',
    //       backgroundColor: '#fff',
    //     },
    //   },
    // },
    ServiceCenter: {
      screen: ServiceCenter,
      navigationOptions: {
        headerTitle: '고객센터',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    Certification: {
      screen: Certification,
      navigationOptions: {
        headerTitle: '본인 인증',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    ServiceCenterOneToOne: {
      screen: ServiceCenterOneToOne,
      navigationOptions: {
        headerTitle: '1:1문의',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },

    ServiceCenterMyResult: {
      screen: ServiceCenterMyResult,
      navigationOptions: {
        headerTitle: '내 문의 내역',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
  },
  {
    // headerMode: "none",
    made: 'modal',
    headerLayoutPreset: 'center',
    headerBackTitleVisible: false,
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('QRscanner')}>
            <Image
              style={{
                width: 30,
                height: 30,
                marginRight: 10,
              }}
              source={require('../assets/front/qr_icon.png')}
            />
          </TouchableOpacity>
        ),
      };
    },
  },
);

//본인인증 하기전
const MainNavigationMyInfo = createStackNavigator(
  {
    TabNavigation: {
      screen: TabNavigationMyInfo,
      navigationOptions: {
        headerShown: false,
      },
    },
    Transfer: {
      screen: Transfer,
      navigationOptions: {
        headerTitle: '송금',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    EmailAuth: {
      screen: EmailAuth,
      navigationOptions: {
        headerTitle: '이메일 인증',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    QRscanner: {
      screen: QRscanner,
      navigationOptions: {
        headerTitle: 'QR코드 스캐너',
        headerTintColor: '#000',
        headerRight: false,
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    TransferSecond: {
      screen: TransferSecond,
      navigationOptions: {
        // headerBackTitle: "true",
        // headerLeft:
        headerTitle: '송금 주소',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    MyHistory: {
      screen: MyHistory,
      navigationOptions: {
        headerTitle: '거래 내역',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    MyInfo: {
      screen: MyInfo,
      navigationOptions: {
        headerTitle: '내 정보',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    CoinHistory: {
      screen: CoinHistory,
      navigationOptions: {
        headerTitle: '거래 내역',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    PurchaseHistory: {
      screen: PurchaseHistory,
      navigationOptions: {
        headerTitle: '구매 내역',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    ExchangeHistory: {
      screen: ExchangeHistory,
      navigationOptions: {
        headerTitle: '환전 내역',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    PurchaseRequest: {
      screen: PurchaseRequest,
      navigationOptions: {
        headerTitle: '구매 신청',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    ExchangeRequest: {
      screen: ExchangeRequest,
      navigationOptions: {
        headerTitle: '환전 신청',
        headerTintColor: '#000',
        headerTitleStyle: {
          color: 'black',
          fontSize: 17,
          fontWeight: 'normal',
        },
        headerStyle: {
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#dcdcdc',
          backgroundColor: '#fff',
        },
      },
    },
    ExchangeSecond: {
      screen: ExchangeSecond,
      navigationOptions: ({ navigation }) => {
        const hedearTitleVal = navigation.getParam('headerTitle');
        return {
          headerTitle: `${setComma(hedearTitleVal)}원 출금 예정`,
          headerTintColor: '#000',
          headerTitleStyle: {
            color: 'black',
            fontSize: 17,
            fontWeight: 'normal',
          },
          headerStyle: {
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#dcdcdc',
            backgroundColor: '#fff',
          },
        };
      },
    },
    BioMetric: {
      screen: BioMetric,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    // headerMode: "none",
    made: 'modal',
    headerLayoutPreset: 'center',
    headerBackTitleVisible: false,
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('QRscanner')}>
            <Image
              style={{
                width: 30,
                height: 30,
                marginRight: 10,
              }}
              source={require('../assets/front/qr_icon.png')}
            />
          </TouchableOpacity>
        ),
      };
    },
  },
);

// createAppContainer의 return값인 Class형 Component 객체를 const에 담아야 react must return Component가 충족됨
export const AppContainer = createAppContainer(MainNavigation);
export const AppContainerMyInfo = createAppContainer(MainNavigationMyInfo);
