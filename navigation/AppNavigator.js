import React from 'react';
import {
  createDrawerNavigator,
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StartScreen from '../screens/StartScreen';
import ItemScreen from '../screens/ItemScreen'

import MainTabNavigator from './MainTabNavigator';

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Start: {
    screen: StartScreen
  },
  Main: {
    screen: MainTabNavigator,
    // navigationOptions: {
    //   drawerLockMode: 'locked-closed'
    // }
  },
  Item: {
    screen: ItemScreen,
    // navigationOptions:{
    //   drawerLockMode:'locked-closed'
    // }
  }
}));
