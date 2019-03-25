import React from 'react';
import { Platform ,View,Text } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
  createTabNavigator
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused, tintColor }) => (
    <TabBarIcon
      tintColor={tintColor}
      focused={focused}
      name={
        Platform.OS === 'ios' ? 'ios-home' : 'md-home'
      }
    />
  ),
  activeTintColor:'#6b52ae', //活动选项卡的标签和图标颜色。
  //          activeBackgroundColor:'#000',//活动选项卡的背景颜色
              inactiveTintColor:'#333',//非活动选项卡的标签和图标颜色。
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Cart',
  tabBarIcon: ({ focused, tintColor }) => (
    <TabBarIcon
      focused={focused}
      tintColor={tintColor}
      name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Myself',
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
  LinksStack,
  SettingsStack,
});


