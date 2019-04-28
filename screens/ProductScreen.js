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
  Picker,
  FlatList
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from "react-native-scrollable-tab-view"
import SelectDialog from 'react-native-select-dialog';
import { SecureStore } from "../storage";


var { height, width } = Dimensions.get('window');

export default class ProductScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: this.props.navigation.getParam("selectedProduct"),
      serviceEntry: '',
      home: '',
      cartlines: '',
      installationFlg: 'Y',
      ref8: '',
      cashcarry: 'N',
      showDeliveryModal: false,
      showInstallationModal: false,
      bookmarks: ''
    }
    this.addToCart = this.addToCart.bind(this);
    this.addBookmark = this.addBookmark.bind(this);
    this.installationFlgY = this.installationFlgY.bind(this);
    this.installationFlgN = this.installationFlgN.bind(this);
    this.cashcarryY = this.cashcarryY.bind(this);
    this.cashcarryN = this.cashcarryN.bind(this);

  }

  static navigationOptions = {
    title: '详情',
  };

  getStorage = async () => {
    console.log('getStorage mobile');
    let home = await SecureStore.getItemAsync('home');
    let serviceEntry = await SecureStore.getItemAsync('serviceEntry');

    return this.setState({
      home: JSON.parse(home),
      serviceEntry: serviceEntry
    })
  }

  componentWillMount() {
    this.setState({
      ref8: this.state.selectedProduct.ref8
    })
  }

  componentDidMount() {
    this.getStorage();
  }

  addToCart(stkId) {
    const serviceEntry = this.state.serviceEntry;
    const home = this.state.home;
    let url = serviceEntry + 'api/add-to-cart';
    console.log(url);
    console.log(home.custId);
    const body = {
      orgId: "A01",
      custId: home.custId,
      guestFlg: "Y",
      ecshopId: "AUDIOHOUSE",
      stkId: stkId,
      qty: "1",
      cashcarry: this.state.cashcarry,
      installationFlg: this.state.installationFlg
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

  addBookmark(stkId) {
    const serviceEntry = this.state.serviceEntry;
    const home = this.state.home;
    let url = serviceEntry + 'api/add-bookmark';
    console.log(url);
    console.log(home.custId);
    const body = {
      orgId: "A01",
      custId: home.custId,
      ecshopId: "AUDIOHOUSE",
      stkId: stkId
    }
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
          bookmarks: response
        })
      })
  }

  installationFlgY() {
    this.setState({
      installationFlg: 'Y',
      showInstallationModal: false
    })
  }

  installationFlgN() {
    this.setState({
      installationFlg: 'N',
      showInstallationModal: false
    })
  }

  cashcarryN() {
    this.setState({
      cashcarry: 'N',
      showDeliveryModal: false
    })
  }

  cashcarryY() {
    this.setState({
      cashcarry: 'Y',
      showDeliveryModal: false
    })
  }

  render() {

    const { selectedProduct } = this.state;

    //handle netPrice
    let netPriceString = selectedProduct.netPrice.toString();
    let decimalIndex1 = netPriceString.indexOf('.');
    let length = netPriceString.length;
    let cent = length - decimalIndex1;
    if (length - decimalIndex1 == 2) {
      cent = netPriceString.substring(decimalIndex1 + 1, length).concat('0');
    } else {
      cent = netPriceString.substring(decimalIndex1 + 1, length)
    }

    //handle discPrice
    let discPriceString = ('$').concat((selectedProduct.netPrice - selectedProduct.refPrice1).toString());
    let decimalIndex2 = discPriceString.indexOf('.');
    if (decimalIndex2 == -1 && (selectedProduct.netPrice - selectedProduct.refPrice1 == 0)) {
      discPriceString = null
    } else if (decimalIndex2 != -1 && discPriceString.charAt(decimalIndex2 + 2) != '0') {
      discPriceString = discPriceString.substring(0, decimalIndex2 + 3)
    } else if (decimalIndex2 != -1 && discPriceString.charAt(decimalIndex2 + 2) == '0') {
      discPriceString = discPriceString.substring(0, decimalIndex2 + 2)
    }

    return (
      <View style={styles.container}>
        <ScrollView style={{ height: height - 50 }} >
          <View>
            <Image style={styles.picture} source={require('../image/SAM-UA-88KS9800KXXS.jpg')}></Image>
            <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.pop()}>
              <Image style={styles.backButton} source={require('../image/left-circle.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.productSummaryPriceDollar}>${decimalIndex1 == -1 ? netPriceString : netPriceString.substring(0, decimalIndex1)}</Text>
            <Text style={styles.productSummaryPriceCent}>{decimalIndex1 == -1 ? '00' : cent}</Text>
          </View>
          <View style={{ flexDirection: 'row', width: width, backgroundColor: 'white' }}>
            <Text style={styles.productSummaryPriceUsual}>U.P. {this.state.selectedProduct.listPrice}</Text>
          </View>
          <View>
            <Text style={styles.productSummaryName}>
              {this.state.selectedProduct.name}
            </Text>
          </View>
          {this.state.selectedProduct.cat6_id != null && this.state.selectedProduct.cat6_id != ''
            ?
            <View style={styles.middleChoice}>
              <Image style={styles.largeShippingIcon} source={require('../image/installation.png')} />
              <Text style={styles.membersSpecialText}>Installation</Text>
              <TouchableOpacity onPress={() => this.setState({ showInstallationModal: true })}>
                <Text style={styles.dropdownSelection}>{this.state.installationFlg == 'Y' ? selectedProduct.cat6_name : 'No Installation'}</Text>
              </TouchableOpacity>
            </View>
            :
            null
          }
          <View style={styles.middleChoice}>
            <Image style={styles.largeShippingIcon} source={require('../image/local_shipping.png')} />
            <Text style={styles.deliveryText}>Delivery</Text>
            {this.state.selectedProduct.ref8 == -1
              ?
              <TouchableOpacity onPress={() => this.setState({ showDeliveryModal: true })}>
                <Text style={styles.dropdownSelection}>Self-collect after 3 working days</Text>
              </TouchableOpacity>
              :
              (this.state.selectedProduct.ref8 == 0
                ?
                (this.state.cashcarry == 'N'
                  ?
                  <TouchableOpacity onPress={() => this.setState({ showDeliveryModal: true })}>
                    <Text style={styles.dropdownSelection}>Free Of Charge</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => this.setState({ showDeliveryModal: true })}>
                    <Text style={styles.dropdownSelection}>Self-collect after 3 working days</Text>
                  </TouchableOpacity>
                )
                :
                (this.state.cashcarry == 'N'
                  ?
                  <TouchableOpacity onPress={() => this.setState({ showDeliveryModal: true })}>
                    <Text style={styles.dropdownSelection}>Standard Delivery(${this.state.selectedProduct.ref8})</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => this.setState({ showDeliveryModal: true })}>
                    <Text style={styles.dropdownSelection}>Self-collect after 3 working days</Text>
                  </TouchableOpacity>
                )
              )
            }
          </View>
          <View style={styles.middleChoice}>
            <Image style={styles.largeShippingIcon} source={require('../image/users.png')} />
            <Text style={styles.membersSpecialText}>Members' Special</Text>
            <Text style={styles.cartEmphasiseCash}>{discPriceString == null ? null : 'Free'}</Text>
            <Text style={styles.voucherMentionFocus}>{discPriceString}</Text>
            <Text style={styles.cartEmphasiseCash}>{'1' === '1' ? '+' : null}</Text>
            <Text style={styles.cartEmphasiseCash}>Extra</Text>
            <Text style={styles.voucherMentionFocus}>$50</Text>
            <Text style={styles.cartEmphasiseCash}>Cashback</Text>
          </View>
          <View style={styles.detailsView}>
            <ScrollableTabView
              renderTabBar={() => <DefaultTabBar />}
              tabBarUnderlineStyle={styles.tabBarUnderline}
              tabBarTextStyle={styles.tabBarText}
              tabBarBackgroundColor='white'
              tabBarActiveTextColor='#EE113D'
              tabBarInactiveTextColor='#333'
              initialPage={1}
              locked={true}
            >
              <View tabLabel='Specifications'>
                <Image style={styles.overview} source={require('../image/specifications.jpg')} />
              </View>
              <View tabLabel='Overview'>
                <Image style={styles.overview} source={require('../image/overview.jpg')} />
              </View>
              <Text tabLabel='Terms&Conditions'>Terms&Conditions</Text >
            </ScrollableTabView>
          </View>
        </ScrollView>
        <View style={styles.bottomBtnContainer}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.addBookmark(selectedProduct.stkId)}>
              {'1' === '1' ? <Image style={styles.bottomLeftBtn} source={require('../image/bookmark.png')} /> :
                <Image style={styles.bottomLeftBtn} source={require('../image/bookmarked.png')} />}
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={styles.bottomLeftBtn} source={require('../image/facebook.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('ProductCart', { cartlines: this.state.cartlines })
            }}>
              <Image style={styles.bottomLeftBtn} source={require('../image/cart.png')} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.addToCart(selectedProduct.stkId)}>
              <View style={styles.addToCartBtn}>
                <Text style={styles.addToCartBtnText}>Add to Cart</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType='slide'
          visible={this.state.showInstallationModal}
          transparent={true}
        >
          <View style={styles.deliveryChoiceModal}>
            <TouchableOpacity onPress={this.installationFlgY}>
              <Text style={styles.modalItem}>{this.state.selectedProduct.cat6_name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.installationFlgN}>
              <Text style={styles.modalItem}>No Installation</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          animationType='fade'
          visible={this.state.showDeliveryModal}
          transparent={true}>
          <View style={{ backgroundColor: 'black', flex: 1, opacity: 0.2 }}></View>
          <View style={styles.deliveryChoiceModal}>
            {this.state.selectedProduct.ref8 == 0
              ?
              <TouchableOpacity onPress={this.cashcarryN}>
                <Text style={styles.modalItem}>Free Of Charge</Text>
              </TouchableOpacity>
              :
              (this.state.selectedProduct.ref8 == -1
                ?
                null
                :
                <TouchableOpacity onPress={this.cashcarryN}>
                  <Text style={styles.modalItem}>Standard Delivery(${this.state.selectedProduct.ref8})</Text>
                </TouchableOpacity>
              )
            }
            <TouchableOpacity onPress={this.cashcarryY}>
              <Text style={styles.modalItem}>Self-collect after 3 working days</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#EEEEEE',
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 8,
    height: 30,
    width: 30,
    opacity: 0.5
  },
  picture: {
    width: width,
    height: 300
  },
  priceContainer: {
    height: 55,
    width: width,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  productSummaryPriceDollar: {
    backgroundColor: 'white',
    color: '#EE113D',
    fontSize: 35,
    marginLeft: 10,
    paddingTop: 15,
    fontWeight: ('bold', '700')
  },
  productSummaryPriceCent: {
    backgroundColor: 'white',
    width: 150,
    color: '#EE113D',
    fontSize: 17,
    paddingTop: 20,
    fontWeight: ('bold', '700'),
    textDecorationLine: 'underline'
  },
  productSummaryPriceUsual: {
    color: 'gray',
    paddingLeft: 10,
    textDecorationLine: 'line-through',
    backgroundColor: 'white'
  },
  productSummaryName: {
    fontSize: 20,
    paddingLeft: 10,
    fontWeight: ('bold', '500'),
    backgroundColor: 'white',
    paddingBottom: 15
  },
  middleChoice: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 1,
    height: 40,
    alignItems: 'center'
  },
  largeShippingIcon: {
    height: 20,
    width: 20,
    backgroundColor: 'white',
    paddingLeft: 10,
    marginLeft: 10
  },
  deliveryText: {
    color: '#8a8a8a',
    backgroundColor: 'white',
    fontSize: 15,
    fontWeight: ('bold', '400'),
    paddingLeft: 5,
    marginRight: 10
  },
  membersSpecialText: {
    color: '#8a8a8a',
    backgroundColor: 'white',
    fontSize: 15,
    fontWeight: ('bold', '400'),
    paddingLeft: 5,
    marginRight: 10
  },
  dropdownSelection: {
    backgroundColor: 'white',
    fontSize: 15,
    fontWeight: ('bold', '300'),
    marginLeft: 10,
  },
  cartEmphasiseCash: {
    color: 'red',
    fontSize: 15,
    fontWeight: ('bold', '300'),
    marginLeft: 5,
  },
  voucherMentionFocus: {
    color: '#180077',
    fontSize: 15,
    fontWeight: ('bold', '500'),
  },
  detailsView: {
    backgroundColor: 'white',
    marginTop: 10,
    // height: 1000
  },
  tabBarUnderline: {
    backgroundColor: '#EE113D',
    height: 2,
  },
  tabBarText: {
    fontSize: 15,
    fontWeight: ('bold', '300'),
  },
  overview: {
    width: width,
    // height:400,
    resizeMode: 'stretch',
  },
  bottomBtnContainer: {
    backgroundColor: 'white',
    height: 50,
    width: width,
    flexDirection: 'row'
  },
  addToCartBtn: {
    backgroundColor: '#EE113D',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  addToCartBtnText: {
    backgroundColor: '#EE113D',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    color: 'white',
    fontWeight: ('bold', '600'),
  },
  bottomLeftBtn: {
    height: 30,
    width: 30,
    marginTop: 10,
    marginLeft: 17,
    marginRight: 17
  },
  deliveryChoiceModal: {
    width: width,
    backgroundColor: 'white',
    height: 300,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#D5D5D5',
  },
  modalItem: {
    margin: 30,
    height: 30,
    width: width * 3 / 5,
    fontSize: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    color: 'gray'
  }
})