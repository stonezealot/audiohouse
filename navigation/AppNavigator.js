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
import MyselfScreen from '../screens/MyselfScreen';
import StartScreen from '../screens/StartScreen';
import ProductScreen from '../screens/ProductScreen'
import SearchScreen from '../screens/SearchScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import UserScreen from '../screens/UserScreen'
import AccountScreen from '../screens/AccountScreen'
import BookmarkScreen from '../screens/BookmarkScreen'
import OrderScreen from '../screens/OrderScreen'
import EwalletScreen from '../screens/EwalletScreen'
import CreditScreen from '../screens/CreditScreen'
import CheckoutDeliveryScreen from '../screens/CheckoutDeliveryScreen'

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
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    },
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      header: null,
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
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      header: null,
    }
  },
  ProductCart: {
    screen: CartScreen,
    navigationOptions: {
      header: null,
    }
  },
  User: {
    screen: UserScreen,
    navigationOptions: {
      header: null,
    }
  },
  Account: {
    screen: AccountScreen,
    navigationOptions: {
      header: null,
    }
  },
  Bookmark: {
    screen: BookmarkScreen,
    navigationOptions: {
      header: null,
    }
  },
  Order: {
    screen: OrderScreen,
    navigationOptions: {
      header: null,
    }
  },
  Ewallet: {
    screen: EwalletScreen,
    navigationOptions: {
      header: null,
    }
  },
  Credit: {
    screen: CreditScreen,
    navigationOptions: {
      header: null,
    }
  },
  CheckoutDelivery: {
    screen: CheckoutDeliveryScreen,
    navigationOptions: {
      header: null,
    }
  }

}));
