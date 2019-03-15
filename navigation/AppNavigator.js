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

import MainTabNavigator from './MainTabNavigator';

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Start: {
    screen: StartScreen
  },
  Main: {
    screen: MainTabNavigator
  },
}));



// import React from 'react';
// import {
//   createStackNavigator,
//   createTabNavigator,
//   createBottomTabNavigator,
//   createDrawerNavigator,
// } from 'react-navigation';

// import Ionicons from 'react-native-vector-icons/Ionicons';


// import StartScreen from '../screens/StartScreen';



// import HomeScreen from '../screens/HomeScreen';
// import LinksScreen from '../screens/LinksScreen';
// import SettingsScreen from '../screens/SettingsScreen';



// //底部导航
// const AppTabNavigators = createBottomTabNavigator({
//   Home: {
//     screen: HomeScreen,
//     navigationOptions: {
//       tabBarLabel: 'Home',//底部标题
//     },

//   },
//   Links: {
//     screen: LinksScreen,
//     navigationOptions: {
//       tabBarLabel: 'Links',
//     }
//   },
//   Settings: {
//     screen: SettingsScreen,
//     navigationOptions: {
//       tabBarLabel: 'Settings',
//     }
//   }

// }, {
//     tabBarPosition: 'bottom',//位置
//     tabBarOptions: {
//       showIcon: true,//是否显示图标！！！！！！！
//       style: {
//         height: 45,//底部导航的宽度
//         backgroundColor: '#211305',//底部导航的颜色
//       },
//       labelStyle: {
//         fontSize: 12,//字体大小
//         marginTop: -2,//字体距离图标大小
//       },

//     }

//   });



// //顶部导航，主入口，要放在其他导航后面，（加载顺序）
// export const AppStackNavigator = createStackNavigator({
//   Start: {
//     screen: StartScreen,
//     navigationOptions: {
//       header: null,
//     }
//   },
//   HomeTab: {//底部导航（也是主页）
//     screen: AppTabNavigators,
//     navigationOptions: {
//       header: null,
//     }
//   }

// });