import React from 'react';
import PropTypes from 'prop-types';
import { AppContainer, AppContainerFirst } from './WalletNavigator';
const WalletNavigation = ({ policy }) => {
  return policy ? <AppContainer /> : <AppContainerFirst />;
};

export default WalletNavigation;
