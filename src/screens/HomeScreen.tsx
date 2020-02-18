import React from 'react';

import { NavigationTypes } from '../types';
import HomeContent from './content/HomeContent';

const HomeScreen: React.SFC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  return <HomeContent navigation={navigation} />;
};

export default HomeScreen;
