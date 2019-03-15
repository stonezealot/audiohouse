import React from 'react';
import { Platform } from 'react-native';
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
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});

// const AppTabNavigators = createTabNavigator({
//   Home: {
//     screen: HomeScreen,
//     navigationOptions: {
//       tabBarLabel: 'Home'
//     }
//   },
//   Links: {
//     screen: LinksScreen,
//     navigation: {
//       tabBarLabel: 'Links'
//     }
//   },
//   Settings: {
//     screen: SettingsScreen,
//     navigationOptions: {
//       tabBarLabel: 'Settings'
//     }
//   }
// }, {
//     tabBarPosition: 'bottom',
//     tabBarOptions: {
//       showIcon: false,
//       style: {
//         height: 45,
//         backgroundColor: '#211305'
//       },
//       labelStyle: {
//         fontSize: 12,//字体大小
//         marginTop: -2,//字体距离图标大小
//       },
//     }
//   })



// export default  AppStackNavigator = createStackNavigator({
//   Start: {  
//     screen: StartScreen,
//     navigationOptions: {
//       header: null
//     }
//   },
//   HomeTab: {
//     screen: AppStackNavigator,
//     navigationOptions: {
//       header: null
//     }
//   }
// })