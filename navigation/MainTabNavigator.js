import React from 'react';
import { Platform, View, Text } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
  createTabNavigator
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import MyselfScreen from '../screens/MyselfScreen';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarOptions: {
    activeTintColor: '#FF1C64',
  },
  tabBarIcon: ({ focused, tintColor }) => (
    <TabBarIcon
      tintColor={tintColor}
      focused={focused}
      name={
        Platform.OS === 'ios' ? 'ios-home' : 'md-home'
      }
    />
  ),
};

const CartStack = createStackNavigator({
  Cart: CartScreen,
});

CartStack.navigationOptions = {
  tabBarLabel: 'Cart',
  tabBarOptions: {
    activeTintColor: '#FF1C64',
  },
  tabBarIcon: ({ focused, tintColor }) => (
    <TabBarIcon
      focused={focused}
      tintColor={tintColor}
      name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
      style={{ color: tintColor }}
    />
  ),
};

const MyselfStack = createStackNavigator({
  Myself: MyselfScreen,
});

MyselfStack.navigationOptions = {
  tabBarLabel: 'Myself',
  tabBarOptions: {
    activeTintColor: '#FF1C64',
  },
  tabBarIcon: ({ focused, tintColor }) => (
    <TabBarIcon
      focused={focused}
      tintColor={tintColor}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};


export default createBottomTabNavigator({
  HomeStack,
  CartStack,
  MyselfStack,
});


