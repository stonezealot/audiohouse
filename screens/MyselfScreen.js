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
      home: '',
      serviceEntry: '',
      customer: ''
    };
    navigation = this.props.navigation;
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.myScrollView.scrollTo({ y: 1000 })

    this.getStorage()
  }

  getStorage = async () => {
    console.log('getStorage mobile');
    let home = await SecureStore.getItemAsync('home');
    let serviceEntry = await SecureStore.getItemAsync('serviceEntry');
    return this.setState({
      home: JSON.parse(home),
      serviceEntry: serviceEntry,
    }, () => {
      const { home, serviceEntry } = this.state
      //get customer
      console.log('get customer')
      let url = serviceEntry + 'api/customer/'
      let params = new URLSearchParams();
      params.append('custId', home.custId);
      params.append('orgId', 'A01');
      url += ('?' + params);
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            customer: response[0]
          })
        })
    })
  }

  render() {
    const { customer } = this.state
    return (
      <ScrollView
        style={styles.container}
        contentInset={styles.contentInset}
        ref={(view) => { this.myScrollView = view }}>
        <View style={styles.header} />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Dear {customer.name}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <View style={styles.optionsContainer}>
            <Image style={styles.optionsImage} source={require('../image/information.png')} />
            <Text style={styles.optionsText}>User Information</Text>
            <Image style={styles.optionsRight} source={require('../image/right.png')} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <View style={styles.optionsContainer}>
            <Image style={styles.optionsImage} source={require('../image/account.png')} />
            <Text style={styles.optionsText}>Account</Text>
            <Image style={styles.optionsRight} source={require('../image/right.png')} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Order')}>
          <View style={styles.optionsContainer}>
            <Image style={styles.optionsImage} source={require('../image/order.png')} />
            <Text style={styles.optionsText}>My orders</Text>
            <Image style={styles.optionsRight} source={require('../image/right.png')} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Bookmark')}>
          <View style={styles.optionsContainer}>
            <Image style={styles.optionsImage} source={require('../image/bookmark2.png')} />
            <Text style={styles.optionsText}>Bookmarks</Text>
            <Image style={styles.optionsRight} source={require('../image/right.png')} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Credit')}>
          <View style={styles.optionsContainer}>
            <Image style={styles.optionsImage} source={require('../image/credit.png')} />
            <Text style={styles.optionsText}>Credit</Text>
            <Image style={styles.optionsRight} source={require('../image/right.png')} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Ewallet')}>
          <View style={styles.optionsContainer}>
            <Image style={styles.optionsImage} source={require('../image/wallet.png')} />
            <Text style={styles.optionsText}>eWallet</Text>
            <Image style={styles.optionsRight} source={require('../image/right.png')} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.optionsContainer}>
            <Image style={styles.optionsImage} source={require('../image/about.png')} />
            <Text style={styles.optionsText}>About us</Text>
            <Image style={styles.optionsRight} source={require('../image/right.png')} />
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
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#EE113D'
  },
  titleText: {
    color: 'white',
    fontSize: 40,
    // fontFamily: 'varela'
    fontFamily: 'ronaldo',

  },
  contentInset: {
    top: -1000, left: 0, bottom: 0, right: 0
  },
  optionsContainer: {
    height: 60,
    width: width,
    borderBottomWidth: 0.5,
    borderColor: '#EEEEEE',
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row'
  },
  optionsImage: {
    height: 30,
    width: 30,
    marginLeft: 10,
    marginRight: 10
  },
  optionsRight: {
    height: 30,
    width: 30,
    position: 'absolute',
    right: 10
  },
  optionsText: {
    fontSize: 20,
    color: '#2c2c2c',
    fontWeight: ('bold', '400'),
    fontFamily: 'varela'
  }
})