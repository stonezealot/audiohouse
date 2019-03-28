import React from 'react';
import {
  createDrawerNavigator,
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StartScreen from '../screens/StartScreen';
import ProductScreen from '../screens/ProductScreen'
import SearchScreen from '../screens/SearchScreen'

import MainTabNavigator from './MainTabNavigator';
import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';

export default createAppContainer(createStackNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Start: {
    screen: StartScreen,
    navigationOptions: {
      header: null
    },
  },
  Main: {
    screen: MainTabNavigator,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    },
  },
  Product: {
    screen: ProductScreen,
    navigationOptions: {
      header: null,
    }
  },
  Search:{
    screen: SearchScreen,
    navigationOptions:{
      header:null,
    }
  }
}));
