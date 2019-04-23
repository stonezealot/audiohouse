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
  }
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <View>
            <Text>User Information</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <Text>My orders</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <Text>Bookmarks</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <Text>Credit</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
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
})