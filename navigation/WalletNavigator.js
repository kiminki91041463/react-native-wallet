import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import WalletsScreen from '../screens/Wallet/WalletsScreen';
import PolicyScreen from '../screens/Wallet/PolicyScreen';
import CreateWalletScreen from '../screens/Wallet/CreateWalletScreen';
import ImportWalletScreen from '../screens/Wallet/ImportWalletScreen';
import BioMetric from '../screens/Auth/BioMetric';
import LoginBioMetric from '../screens/Auth/LoginBioMetric';
import MyInfoBioMetric from '../screens/Auth/MyInfoBioMetric';
import LoginTerminal from '../screens/Auth/LoginTerminal';

const WalletNavigationFirst = createStackNavigator(
  {
    PolicyScreen: {
      screen: PolicyScreen,
      navigationOptions: {
        headerTitle: '약관 동의',
        // headerLeft: null,
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
  },
  {
    headerBackTitleVisible: false,
    headerLayoutPreset: 'center',
    initialRouteName: 'PolicyScreen',
  },
);

const WalletNavigation = createStackNavigator(
  {
    LoginTerminal: {
      screen: LoginTerminal,
      navigationOptions: {
        headerShown: false,
      },
    },
    WalletsScreen: {
      screen: WalletsScreen,
      navigationOptions: {
        headerTitle: '최초 지갑 생성',
        // headerLeft: null,
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
    CreateWalletScreen: {
      screen: CreateWalletScreen,
      navigationOptions: {
        headerTitle: '지갑 생성',
        // headerLeft: null,
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
    ImportWalletScreen: {
      screen: ImportWalletScreen,
      navigationOptions: {
        headerTitle: '지갑 불러오기',
        // headerLeft: null,
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
    BioMetric: {
      screen: BioMetric,
      navigationOptions: {
        headerShown: false,
      },
    },
    LoginBioMetric: {
      screen: LoginBioMetric,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyInfoBioMetric: {
      screen: MyInfoBioMetric,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    headerBackTitleVisible: false,
    headerLayoutPreset: 'center',
    initialRouteName: 'LoginTerminal',
  },
);

// createAppContainer의 return값인 Class형 Component 객체를 const에 담아야 react must return Component가 충족됨
export const AppContainerFirst = createAppContainer(WalletNavigationFirst);
export const AppContainer = createAppContainer(WalletNavigation);
