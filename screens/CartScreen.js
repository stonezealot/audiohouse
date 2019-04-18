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
  DeviceEventEmitter
} from 'react-native';
import { SecureStore } from "../storage";
import URLSearchParams from 'url-search-params';
import SwipeView from 'react-native-swipeout';

var { height, width } = Dimensions.get('window');

export default class CartScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      serviceEntry: '',
      home: '',
      cartlines: this.props.navigation.getParam("cartlines"),
      qty: 1,
      refresh: true,
    };
    navigation = this.props.navigation;
    this.handleCheckoutButton = this.handleCheckoutButton.bind(this);
    this.qtyPlus = this.qtyPlus.bind(this);
    this.qtyMinus = this.qtyMinus.bind(this);
    this.cartlineDelete = this.cartlineDelete.bind(this);
    this.getStorage = this.getStorage.bind(this);
    this.props.navigation.addListener('willFocus', () => {this.getStorage()});
  }

  static navigationOptions = {
    title: 'Cart',
  };

  getStorage = async () => {
    console.log('getStorage mobile');
    let home = await SecureStore.getItemAsync('home');
    let serviceEntry = await SecureStore.getItemAsync('serviceEntry');

    return this.setState({
      home: JSON.parse(home),
      serviceEntry: serviceEntry
    }, () => {
      const { home, serviceEntry } = this.state;
      let url = serviceEntry + 'api/cartlines/'
      let params = new URLSearchParams();
      console.log('serviceEntry:  ' + serviceEntry);
      console.log('custId:  ' + home.custId)
      params.append('custId', home.custId);
      params.append('ecshopId', 'AUDIOHOUSE');
      url += ('?' + params);
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({ cartlines: response }, () => {
            // console.log(this.state.cartlines)
          })
        })
    })
  }

  componentDidMount() {
    this.getStorage();
  }

  handleCheckoutButton() {
    this.setState({
      cartlines: this.state.cartlines
    })
  }

  qtyPlus(recKey) {
    const serviceEntry = this.state.serviceEntry;
    const home = this.state.home;
    let url = serviceEntry + 'api/cartlines/' + recKey + '/qty-plus';
    console.log(url);
    console.log(home.custId);
    const body = {
      orgId: "A01",
      custId: home.custId,
      ecshopId: "AUDIOHOUSE"
    };
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    })
      .then(
        response => {
          if (!response.ok) {
          } else {
            return response.json();
          }
        })
      .then(response => {
        this.setState({
          cartlines: response
        })
      })
  }

  qtyMinus(recKey) {
    const serviceEntry = this.state.serviceEntry;
    const home = this.state.home;
    let url = serviceEntry + 'api/cartlines/' + recKey + '/qty-minus';
    console.log(url);
    console.log(home.custId);
    const body = {
      orgId: "A01",
      custId: home.custId,
      ecshopId: "AUDIOHOUSE"
    };
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    })
      .then(
        response => {
          if (!response.ok) {
          } else {
            return response.json();
          }
        })
      .then(response => {
        this.setState({
          cartlines: response
        })
      })
  }

  cartlineDelete(recKey){
    const serviceEntry = this.state.serviceEntry;
    const home = this.state.home;
    let url = serviceEntry + 'api/cartlines/' + recKey + '/delete';
    console.log(url);
    console.log(home.custId);
    const body = {
      orgId: "A01",
      custId: home.custId,
      ecshopId: "AUDIOHOUSE"
    };
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    })
      .then(
        response => {
          if (!response.ok) {
          } else {
            return response.json();
          }
        })
      .then(response => {
        this.setState({
          cartlines: response
        })
      })
  }

  handleCartMenu(item) {

    const Rightbuttons=[
      {
        backgroundColor: 'red',
        color: 'white',
        text: 'Delete',
        onPress: () => this.cartlineDelete(item.recKey)
      }]

    return (
      <SwipeView
        right={Rightbuttons}
        autoClose={true}>
        <View style={styles.cartlineItemContainer}>

          <Image style={styles.cartlineImage} />
          <View>
            <Text style={styles.cartlineName}>{item.name}</Text>
            <View style={{ height: 70, backgroundColor: 'pink' }}>
              <TouchableOpacity>
                <Text style={styles.choiceText}>delivery</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.choiceText}>installation</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: width / 5, height: 40, justifyContent: 'center', marginRight: 60 }}>
                <Text style={styles.netPrice}>${item.netPrice}</Text>
              </View>
              <TouchableOpacity onPress={() => this.qtyMinus(item.recKey)}>
                <Image style={styles.handleQty} source={require('../image/minus.png')} />
              </TouchableOpacity>
              <View style={{ width: 60, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.qty}>{item.stkQty}</Text>
              </View>
              <TouchableOpacity onPress={() => this.qtyPlus(item.recKey)}>
                <Image style={styles.handleQty} source={require('../image/plus.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SwipeView>
    )
  }


  _extraUniqueKey(item, index) {
    return "index" + index + item;
  }


  render() {
    const { home } = this.state;
    return (
      <View style={styles.container}>
        <FlatList style={{ flex: 1 }}
          extraData={this.state}
          keyExtractor={this._extraUniqueKey}
          data={this.state.cartlines}
          renderItem={({ item }) => this.handleCartMenu(item)} />
        <View style={styles.bottomBtnContainer}>
          <View style={styles.checkoutBtnContainer}>
            <TouchableOpacity onPress={this.handleCheckoutButton}>
              <Text style={styles.checkoutBtnText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  cartlineItemContainer: {
    height: 150,
    width: width,
    margin: 0.5,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 0.2,
    borderColor: '#EEEEEE',
    borderRadius: 5,
  },
  cartlineImage: {
    height: 140,
    width: 140,
    margin: 5,
    backgroundColor: 'powderblue'
  },
  cartlineName: {
    position: 'relative',
    left: 1,
    width: width - 145,
    height: 40,
    fontSize: 15,
    fontWeight: ('bold', '500'),
    backgroundColor: 'white',
  },
  choiceText: {
    height: 30,
    marginTop: 5,
    fontSize: 20
  },
  netPrice: {
    backgroundColor: 'white',
    fontSize: 20,
    color: 'red',
  },
  handleQty: {
    height: 24,
    width: 24
  },
  qty: {
    backgroundColor: 'white',
    textAlign: 'center',
    width: 40,
    fontSize: 20
  },
  bottomBtnContainer: {
    backgroundColor: 'white',
    height: 50,
    width: width,
    flexDirection: 'row',

  },
  checkoutBtnContainer: {
    height: 50,
    width: width * 2 / 5,
    backgroundColor: '#EE113D',
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
  },
  checkoutBtnText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: ('bold', '600')
  }
});
