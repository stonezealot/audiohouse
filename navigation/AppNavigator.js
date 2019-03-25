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
    transitionConfig: () => ({
      transitionSpec: {
          duration: 300,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
          const { layout, position, scene } = sceneProps;
          const { index } = scene;

          const height = layout.initHeight;
          //沿Y轴平移
          const translateY = position.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [height, 0, 0],
          });
          //透明度
          const opacity = position.interpolate({
              inputRange: [index - 1, index - 0.99, index],
              outputRange: [0, 1, 1],
          });
          return { opacity, transform: [{ translateY }] };
      },
  }),

  },
  Item: {
    screen: ItemScreen,
    navigationOptions: {
      header: null,
    }
  }
}));
