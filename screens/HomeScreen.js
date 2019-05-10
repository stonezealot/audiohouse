import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  RefreshControl,
  FlatList
} from 'react-native';
import { WebBrowser } from 'expo';
import { cal } from '../components/common'
import Swiper from 'react-native-swiper'
import URLSearchParams from 'url-search-params';
import { SecureStore } from "../storage";

var { height, width } = Dimensions.get('window');

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.toProduct = this.toProduct.bind(this)
    this.handleCategorys = this.handleCategorys.bind(this)
    navigation = this.props.navigation;
    this.state = {
      refreshing: false,
      serviceEntry: this.props.navigation.getParam('serviceEntry'),
      home: this.props.navigation.getParam('home'),
      searchText: '',
      selectedShopMenus: '',
      bests: '',
      bestSkuViews: '',
      selectedProduct: '',
      categorys: '',
      eccatId: ''
    };
  }

  getStorage = async () => {
    console.log('getStorage mobile');
    let home = await SecureStore.getItemAsync('home');
    let serviceEntry = await SecureStore.getItemAsync('serviceEntry');
    let selectedShopMenus = await SecureStore.getItemAsync('stocks');

    return this.setState({
      home: JSON.parse(home),
      serviceEntry: serviceEntry,
      selectedShopMenus: JSON.parse(selectedShopMenus),
    }, () => {
      const { home, serviceEntry } = this.state
      //get bests
      console.log('get bests')
      let url = serviceEntry + 'api/bests/'
      let params = new URLSearchParams();
      params.append('statusFlg', 'A');
      params.append('orgId', 'A01');
      url += ('?' + params);
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            bests: response
          })
        })

      //get bestSkuViews
      console.log('get bestSkuViews')
      url = serviceEntry + 'api/best-sku-views/'
      params = new URLSearchParams();
      params.append('orgId', 'A01');
      url += ('?' + params);
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            bestSkuViews: response
          })
        })

      //get banners
      console.log('get banners')
      url = serviceEntry + 'api/banners/'
      params = new URLSearchParams();
      console.log('serviceEntry:  ' + serviceEntry);
      params.append('orgId', 'A01');
      url += ('?' + params);
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({ categorys: response })
        }, () => {
          console.log(response.json())
        })
    })
  }


  _onRefresh = () => {
    this.setState({ refreshing: true });
    // fetchData().then(() => {
    //   this.setState({refreshing: false});
    // });
    setTimeout(() => {
      this.setState({
        refreshing: false
      });
    }, 1000)
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        swiperShow: true
      });
    }, 0);

    this.getStorage();

  }

  search(inputData) {
    if (inputData != '' && inputData.toString().trim().length != 0) {
      this.setState({ searchText: inputData.toString().trim() }, () => {
        navigation.navigate('Search', { searchText: this.state.searchText })
        navigation.navigate('Search', { selectedShopMenus: this.state.selectedShopMenus })
        navigation.navigate('Search', { serviceEntry: this.state.serviceEntry })
      });
    }
  }

  _extraUniqueKey(item, index) {
    return "index" + index + item;
  }

  toProduct(recKey) {
    let url = this.state.serviceEntry + 'api/stocks/' + recKey;
    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          selectedProduct: response.ecStk
        }, () => {
          navigation.navigate('Product', { selectedProduct: this.state.selectedProduct })
        })
      })
  }

  handleBestViews(item, ecbestId) {

    //handle netPrice
    let netPriceString = item.netPrice.toString()
    let decimalIndex1 = netPriceString.indexOf('.');
    let length = netPriceString.length;
    let cent = length - decimalIndex1;
    if (length - decimalIndex1 == 2) {
      cent = netPriceString.substring(decimalIndex1 + 1, length).concat('0');
    } else {
      cent = netPriceString.substring(decimalIndex1 + 1, length)
    }

    //handle discPrice
    let discPriceString = ('$').concat((item.netPrice - item.refPrice1).toString());
    let decimalIndex2 = discPriceString.indexOf('.');
    if (decimalIndex2 == -1 && (item.netPrice - item.refPrice1 == 0)) {
      discPriceString = null
    } else if (decimalIndex2 != -1 && discPriceString.charAt(decimalIndex2 + 2) != '0') {
      discPriceString = discPriceString.substring(0, decimalIndex2 + 3)
    } else if (decimalIndex2 != -1 && discPriceString.charAt(decimalIndex2 + 2) == '0') {
      discPriceString = discPriceString.substring(0, decimalIndex2 + 2)
    }


    return (
      <View>
        {item.ecbestId == ecbestId ?
          <View style={styles.swiperContainer2}>
            <TouchableOpacity
              onPress={() => {
                console.log(item.stkRecKey)
                this.toProduct(item.stkRecKey)
              }}>
              <View style={styles.subScrollView} >
                <Image style={styles.bestViewImage} source={require('../image/product.png')} />
                <Text style={styles.bestViewName}>{item.name}</Text>
                <Text style={styles.productSummaryPriceUsual}>U.P. {item.listPrice}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.productSummaryPriceDollar}>${decimalIndex1 == -1 ? netPriceString : netPriceString.substring(0, decimalIndex1)}</Text>
                  <Text style={styles.productSummaryPriceCent}>{decimalIndex1 == -1 ? '00' : cent}</Text>
                </View>
                <Text style={styles.membersSpecialText}>Members' Special</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.cartEmphasiseCash}>{discPriceString == null ? null : 'Free'}</Text>
                  <Text style={styles.voucherMentionFocus}>{discPriceString}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.cartEmphasiseCash}>{'1' === '1' ? '+' : null}</Text>
                  <Text style={styles.cartEmphasiseCash}>Extra</Text>
                  <Text style={styles.voucherMentionFocus}>$50</Text>
                  <Text style={styles.cartEmphasiseCash}>Cashback</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          :
          null}
      </View>

    )
  }

  handleCategorys(item) {

    return (
      <View>
        {item.paraType1 === 'CAT' ?
          <TouchableOpacity
            onPress={() => this.setState({
              eccatId: item.paraValue1
            }, () => {
              navigation.navigate('Search', { selectedShopMenus: this.state.selectedShopMenus })
              navigation.navigate('Search', { eccatId: this.state.eccatId })
              navigation.navigate('Search', { searchText: this.state.searchText })
            })
            }>
            <View style={styles.categoryBtnContainer}>
              {item.bannerId == 'B01' ?
                <Image style={styles.categoryButton} source={require('../image/caticon1.png')} />
                : (item.bannerId == 'B02' ?
                  <Image style={styles.categoryButton} source={require('../image/caticon2.png')} />
                  : (item.bannerId == 'B03' ?
                    <Image style={styles.categoryButton} source={require('../image/caticon3.png')} />
                    : (item.bannerId == 'B04' ?
                      <Image style={styles.categoryButton} source={require('../image/caticon4.png')} />
                      : (item.bannerId == 'B05' ?
                        <Image style={styles.categoryButton} source={require('../image/caticon5.png')} />
                        : (item.bannerId == 'B06' ?
                          <Image style={styles.categoryButton} source={require('../image/caticon6.png')} />
                          : (item.bannerId == 'B07' ?
                            <Image style={styles.categoryButton} source={require('../image/caticon7.png')} />
                            : (item.bannerId == 'B08' ?
                              <Image style={styles.categoryButton} source={require('../image/caticon8.png')} />
                              : (item.bannerId == 'B09' ?
                                <Image style={styles.categoryButton} source={require('../image/caticon9.png')} />
                                : (item.bannerId == 'B10' ?
                                  <Image style={styles.categoryButton} source={require('../image/caticon10.png')} />
                                  : (item.bannerId == 'B11' ?
                                    <Image style={styles.categoryButton} source={require('../image/caticon11.png')} />
                                    : <Image style={styles.categoryButton} source={require('../image/caticon12.png')} />))))))))))
              }

              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          </TouchableOpacity>

          :
          null
        }

      </View>
    )
  }



  handleBests(item) {

    let ecbestId = item.ecbestId

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
        <View style={styles.subView}>
          <Text style={styles.subtitle}>
            {item.name}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.subScrollView} >
            <Image style={styles.swiperPic2} source={require('../image/sellingFridge.jpg')} />
          </View>
          <FlatList
            horizontal={true}
            data={this.state.bestSkuViews}
            keyExtractor={this._extraUniqueKey}
            renderItem={({ item }) => this.handleBestViews(item, ecbestId)}
          />
        </View>
      </View>
    )
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput placeholder="Search"
            style={styles.searchInput}
            onSubmitEditing={(inputData) => this.search(inputData.nativeEvent.text.toUpperCase())}
          ></TextInput>
          <Image style={styles.searchIcon} source={require('../image/search.png')}></Image>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={{ alignItems: 'center' }}>
            <Swiper containerStyle={styles.swiperContainer}
              removeClippedSubviews={false}
              showsButtons={true}
              loop={true}
              autoplay={true}
              autoplayTimeout={2}>
              <TouchableOpacity onPress={() => { }}><Image style={styles.swiperPic} source={require('../image/swiper1.png')} /></TouchableOpacity>
              <TouchableOpacity onPress={() => { }}><Image style={styles.swiperPic} source={require('../image/swiper2.png')} /></TouchableOpacity>
              <TouchableOpacity onPress={() => { }}><Image style={styles.swiperPic} source={require('../image/swiper3.png')} /></TouchableOpacity>
              <TouchableOpacity onPress={() => { }}><Image style={styles.swiperPic} source={require('../image/swiper4.png')} /></TouchableOpacity>
              <TouchableOpacity onPress={() => { }}><Image style={styles.swiperPic} source={require('../image/swiper5.png')} /></TouchableOpacity>
            </Swiper>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.CategorySubView}>
              <View >
                <FlatList
                  data={this.state.categorys}
                  numColumns={3}
                  renderItem={({ item }) => this.handleCategorys(item)}
                  keyExtractor={this._extraUniqueKey}
                />
              </View>
            </View>
          </View>





          <View>
            <FlatList
              data={this.state.bests}
              numColumns={1}
              renderItem={({ item }) => this.handleBests(item)}
              keyExtractor={this._extraUniqueKey} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    flexDirection: 'column'
  },
  searchContainer: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#EE113D',
    alignItems: 'center'
  },
  searchInput: {
    height: 35,
    width: width * 0.75,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#EEEEEE',
    borderRadius: 30,
    marginTop: 20,
    left: width * 0.25 / 2,
    paddingLeft: 30
  },
  searchIcon: {
    position: 'absolute',
    width: 25,
    height: 25,
    top: 29,
    left: 55
  },
  textInputStyle: {
    width: 300,
    height: 40,
    textAlign: 'center',
    color: 'red'
  },
  swiperContainer: {

    height: 200,
    width: width - 16,
    borderRadius: 10
  },
  swiperPic: {
    height: 200,
    width: width - 16,
    borderRadius: 10

  },
  scrollItemContainer: {
    backgroundColor: 'white',
    height: 180,
    width: width,
  },
  categoryBtnContainer: {
    margin: 5,
    width: (width - 46) / 3,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#E6E6E6',
    borderRadius: 10
  },
  categoryButton: {
    resizeMode: 'contain',
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  categoryText: {
    marginTop: 6,
    fontFamily: 'varela',
  },
  subtitle: {
    // backgroundColor: 'white',
    color: 'white',
    fontSize: 30,
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center',
    fontFamily: 'ronaldo',
  },
  subView: {
    backgroundColor: '#EE113D',
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 10
  },
  CategorySubView: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 10,
    height: 450,
    marginTop: 10,
    justifyContent: 'center'
  },
  swiperContainer2: {
    height: 350,
    width: width / 2,
  },
  subScrollView: {
    backgroundColor: 'white',
    height: 350,
    width: width / 2 - 16,
    alignItems: 'center',
    borderRadius: 10,
    margin: 8
  },
  bestViewImage: {
    width: width / 2 - 16,
    height: width / 2 - 16,
    resizeMode: 'contain',
    borderRadius: 10
  },
  bestViewName: {
    width: width / 2 - 16,
    height: 40,
    fontWeight: ('bold', '500'),
    paddingLeft: 2,
    paddingRight: 2,
    textAlign: 'center'
  },
  productSummaryPriceUsual: {
    color: 'gray',
    textDecorationLine: 'line-through',
    backgroundColor: 'white'
  },
  productSummaryPriceDollar: {
    backgroundColor: 'white',
    color: '#EE113D',
    fontSize: 26,
    paddingTop: 2,
    fontWeight: ('bold', '700')
  },
  productSummaryPriceCent: {
    backgroundColor: 'white',
    color: '#EE113D',
    fontSize: 13,
    paddingTop: 4,
    fontWeight: ('bold', '700'),
    textDecorationLine: 'underline'
  },
  membersSpecialText: {
    color: '#EE113D',
    backgroundColor: 'white',
    fontSize: 15,
    fontWeight: ('bold', '400'),
  },
  cartEmphasiseCash: {
    color: '#EE113D',
    fontSize: 13,
    fontWeight: ('bold', '300'),
    marginLeft: 5,
  },
  voucherMentionFocus: {
    color: '#180077',
    fontSize: 13,
    fontWeight: ('bold', '500'),
  },
  swiperPic2: {
    height: 330,
    resizeMode: 'contain',
    borderRadius: 20,
  },

});
