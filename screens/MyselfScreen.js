import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  FlatList,
  TextInput,
  DeviceEventEmitter
} from 'react-native';
import { SecureStore } from "../storage";
import URLSearchParams from 'url-search-params';
import SwipeView from 'react-native-swipeout';

var { height, width } = Dimensions.get('window');

export default class MyselfScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    navigation = this.props.navigation;
  }
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress = {() => navigation.navigate('User')}>
          <View style={styles.optionsContainer}>
            <Text>User Information</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.optionsContainer}>
            <Text>Account</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.optionsContainer}>
            <Text>My orders</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.optionsContainer}>
            <Text>Bookmarks</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.optionsContainer}>
            <Text>Credit</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.optionsContainer}>
            <Text>eWallet</Text>
          </View>
        </TouchableOpacity>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  optionsContainer:{
    height:100,
    width:width,
    marginTop:20,
    backgroundColor:'white',
    justifyContent: 'center',
  }
})