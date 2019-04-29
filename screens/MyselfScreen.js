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

  componentDidMount() {
    this.myScrollView.scrollTo({ y: 1000 })
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentInset={styles.contentInset}
        ref={(view) => { this.myScrollView = view }}>
        <View style={styles.header} />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Dear Xu</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsText}>User Information</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsText}>Account</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Order')}>
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsText}>My orders</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Bookmark')}>
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsText}>Bookmarks</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsText}>Credit</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Ewallet')}>
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsText}>eWallet</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsText}>about us</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  header: {
    height: 1000,
    backgroundColor: '#EE113D',
  },
  titleContainer:{
    height:150,
    backgroundColor:'#EE113D'
  },
  titleText:{
    color:'white',
    fontSize:40,
    position:'absolute',
    bottom:0
  },
  contentInset: {
    top: -1000, left: 0, bottom: 0, right: 0
  },
  optionsContainer: {
    height: 60,
    width: width,
    borderBottomWidth:0.5,
    borderColor:'#EEEEEE',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  optionsText:{
    fontSize:16,
    fontWeight:('normal','100')
  }
})