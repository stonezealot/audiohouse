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

export default class CartScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      serviceEntry: '',
      home: '',
      cartlines: this.props.navigation.getParam("cartlines"),
      carts: '',
    };
    navigation = this.props.navigation;
    this.handleCheckoutButton = this.handleCheckoutButton.bind(this);
    this.qtyPlus = this.qtyPlus.bind(this);
    this.qtyMinus = this.qtyMinus.bind(this);
    this.editQty = this.editQty.bind(this);
    this.cartlineDelete = this.cartlineDelete.bind(this);
    this.getStorage = this.getStorage.bind(this);
    this.props.navigation.addListener('willFocus', () => { this.getStorage() });
  }

  static navigationOptions = {
    header: null,
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
      //get cartlines
      console.log('get cartlines')
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
          this.setState({ cartlines: response })
        })

      //get carts
      console.log('get carts')
      url = serviceEntry + 'api/carts/'
      params = new URLSearchParams();
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
          this.setState({ carts: response[0] })
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
      .then(this.getStorage)
    console.log('recKey: ' + recKey + ': qty + 1')
  }

  qtyMinus(recKey) {
    const serviceEntry = this.state.serviceEntry;
    const home = this.state.home;
    let url = serviceEntry + 'api/cartlines/' + recKey + '/qty-minus';
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
      .then(this.getStorage)
    console.log('recKey: ' + recKey + ': qty - 1')
  }

  editQty(qty, recKey, stkId) {
    if (qty <= 0) {
      console.log('qty <= 0')
      qty = 1;
    }
    console.log(qty + ' ' + recKey + ' ' + stkId)
    const serviceEntry = this.state.serviceEntry;
    const home = this.state.home;
    let url = serviceEntry + 'api/cartlines/' + recKey + '/edit-qty';
    const body = {
      orgId: "A01",
      custId: home.custId,
      ecshopId: "AUDIOHOUSE",
      stkId: stkId,
      qty: qty
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
      .then(this.getStorage)
    console.log('recKey: ' + recKey + ': qty => ' + qty)
  }


  cartlineDelete(recKey) {
    const serviceEntry = this.state.serviceEntry;
    const home = this.state.home;
    let url = serviceEntry + 'api/cartlines/' + recKey + '/delete';
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
      .then(this.getStorage)
    console.log('recKey: ' + recKey + ': deleted')
  }

  handleCartMenu(item) {

    const Rightbuttons = [
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
                <TextInput
                  defaultValue={item.stkQty.toString()}
                  style={styles.qty}
                  keyboardType='numeric'
                  onEndEditing={(inputData) => this.editQty(inputData.nativeEvent.text, item.recKey, item.stkId)} />
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
    const carts = this.state.carts;
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Cart</Text>
        </View>
        <FlatList style={{ flex: 1 }}
          extraData={this.state}
          keyExtractor={this._extraUniqueKey}
          data={this.state.cartlines}
          renderItem={({ item }) => this.handleCartMenu(item)} />
        <View style={styles.bottomBtnContainer}>
          <View style={{ width: width * 4 / 6 }}>
            <View style={{ flexDirection: 'row', borderColor: '#D5D5D5', borderBottomWidth: 0.5 }}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalAmountText}>${carts.subTotal}</Text>
            </View>
            <View style={{ flexDirection: 'row', borderColor: '#D5D5D5', borderBottomWidth: 0.5 }}>
              <Text style={styles.totalText}>Delivery:</Text>
              <Text style={styles.totalAmountText}>${carts.deliveryCharge}</Text>
            </View>
            <View style={{ flexDirection: 'row', borderColor: '#D5D5D5', borderBottomWidth: 0.5 }}>
              <Text style={styles.totalText}>Installation:</Text>
              <Text style={styles.totalAmountText}>${carts.installationCharge}</Text>
            </View>
            <View style={{ flexDirection: 'row', borderColor: '#D5D5D5', borderBottomWidth: 0.5 }}>
              <Text style={styles.totalText}>Grand Total:</Text>
              <Text style={[styles.totalAmountText, { fontWeight: ('bold', '600') }]}>${carts.grandTotal}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.gainText}>Cash Vouchers for members:</Text>
              <Text style={styles.gainAmountText}>${carts.evoucherGain}</Text>
            </View>
          </View>
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
  titleContainer: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#D5D5D5'
  },
  title: {
    color: 'black',
    width:100,
    fontSize: 30,
    paddingTop: 20,
    fontWeight: ('regular', '600'),
    fontFamily: 'pledg',
    textAlign: 'center',
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
    height: 10,
    marginTop: 2,
    fontSize: 10
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
    height: 100,
    width: width,
    flexDirection: 'row',
  },
  totalText: {
    marginTop: 1,
    fontSize: 15,
    fontWeight: ('bold', '600'),
    borderBottomWidth: 0.5,
    borderColor: 'gray'
  },
  totalAmountText: {
    position: 'absolute',
    right: 0,
    marginTop: 1,
    fontSize: 15,
    fontWeight: ('normal', '200'),
    borderBottomWidth: 0.5,
    borderColor: 'gray'
  },
  gainText: {
    marginTop: 1,
    fontSize: 15,
    fontWeight: ('bold', '600'),
    color: 'red'
  },
  gainAmountText: {
    position: 'absolute',
    right: 0,
    marginTop: 1,
    fontSize: 15,
    fontWeight: ('bold', '600'),
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    color: 'red'
  },
  checkoutBtnContainer: {
    height: 100,
    width: width * 2 / 6,
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
