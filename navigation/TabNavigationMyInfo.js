import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { TouchableOpacity } from "react-native-gesture-handler";
import Home from '../screens/Tabs/Home';
import MyInfoBioMetric from '../screens/Auth/MyInfoBioMetric';
import { createStackNavigator } from 'react-navigation-stack';
import AddButton from '../components/AddButton';
import { View } from 'native-base';

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      initialRoute: {
        screen: initialRoute,
        navigationOptions: ({ navigation }) => {
          return {
            ...customConfig,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('QRscanner')}
              >
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
    },
    {
      headerLayoutPreset: 'center',
    },
  );
export default createBottomTabNavigator(
  {
    Home: {
      screen: stackFactory(Home, {
        headerTitle: '홈',
        headerBackTitle: null,
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
      }),
      navigationOptions: {
        tabBarButtonComponent: ({ onPress, children }) => {
          return (
            <View style={{ flex: 2 }}>
              <TouchableOpacity
                style={{
                  height: '100%',
                }}
                onPress={onPress}
                activeOpacity={1}
              >
                {children}
              </TouchableOpacity>
            </View>
          );
        },
        tabBarIcon({ focused }) {
          return (
            <Image
              style={{ height: 40 }}
              resizeMode="contain"
              source={
                focused
                  ? require('../assets/front/home_on.png')
                  : require('../assets/front/home_off.png')
              }
            />
          );
        },
      },
    },
    Adding: {
      screen: () => null, // Empty screen
      navigationOptions: ({ navigation }) => {
        return {
          tabBarButtonComponent: ({ children }) => {
            return <View style={{ flex: 1 }}>{children}</View>;
          },
          tabBarOnPress: () => null,
          tabBarIcon() {
            return <AddButton navigation={navigation} />;
          },
        };
      },
    },
    MyInfoBioMetric: {
      screen: MyInfoBioMetric,
      navigationOptions: {
        headerShown: false,
        tabBarButtonComponent: ({ onPress, children }) => {
          return (
            <View style={{ flex: 2 }}>
              <TouchableOpacity
                style={{
                  height: '100%',
                }}
                onPress={onPress}
                activeOpacity={1}
              >
                {children}
              </TouchableOpacity>
            </View>
          );
        },
        tabBarIcon({ focused }) {
          return (
            <Image
              style={{ height: 40 }}
              resizeMode="contain"
              source={
                focused
                  ? // ? require("../assets/images/nav_list_icon.png")
                    // : require("../assets/images/nav_list_icon_off.png")
                    require('../assets/front/internal_information_on.png')
                  : require('../assets/front/internal_information_off.png')
              }
            />
          );
        },
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false, // hide labels
      activeTintColor: '#F8F8F8', // active icon color
      inactiveTintColor: '#586589', // inactive icon color
      style: {
        height: 50,
        backgroundColor: '#ecf2eb', // TabBar background
      },
    },
    headerBackTitleVisible: false,
  },
);
