import React from 'react';
import PropTypes from 'prop-types';
import { AppContainer, AppContainerMyInfo } from './StackNavigator';
// import { nonExecutableDefinitionMessage } from "graphql/validation/rules/ExecutableDefinitions";

//createSwitchNavigator를 사용해보자
const MainNavigation = ({ myInfoCheck }) => {
  //navController에서 전달받은 myInfoCheck props로 navigation을 상황에 맞게 return한다
  return myInfoCheck ? <AppContainer /> : <AppContainerMyInfo />;
};

export default MainNavigation;

MainNavigation.propTypes = {
  myInfoCheck: PropTypes.bool,
};
