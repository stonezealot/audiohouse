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
} from 'react-native';
import { WebBrowser } from 'expo';
import { cal } from '../components/common'
import Swiper from 'react-native-swiper'
import URLSearchParams from 'url-search-params';

var { height, width } = Dimensions.get('window');

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    navigation = this.props.navigation;
    this.state = {
      refreshing: false,
      serviceEntry: 'http://172.20.10.9:8080/',
      searchText: '',
      selectedShopMenus: ''
    };
  }

  getStorage = async () => {
    console.log('getStorage mobile');
    let home = await SecureStore.getItemAsync('home');
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

    let url = 'http://172.20.10.9:8080/' + 'api/stocks';
    const params = new URLSearchParams();
    params.append('orgId', 'A01');
    url += ('?' + params);
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          selectedShopMenus: response,
        }
        );
      });

  }

  search(inputData) {
    this.setState({ searchText: inputData }, () => {
      navigation.navigate('Search', { searchText: this.state.searchText })
      navigation.navigate('Search', { selectedShopMenus: this.state.selectedShopMenus })
    });
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
          <View>
            <ScrollView style={styles.scrollItemContainer} horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
              <View>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon1.png')} />
                  <Text>TV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon2.png')} />
                  <Text>Fridge</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon3.png')} />
                  <Text>Wine chiller</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon4.png')} />
                  <Text>Washer</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon5.png')} />
                  <Text>Dryer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon6.png')} />
                  <Text>Chest Freezer</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon7.png')} />
                  <Text>Hob and hood</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon8.png')} />
                  <Text>Kitchen appliances</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon9.png')} />
                  <Text>Hifi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon12.png')} />
                  <Text>Aircon</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon11.png')} />
                  <Text>Headphones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton}>
                  <Image style={styles.categoryButton} source={require('../image/caticon10.png')} />
                  <Text>Multi media speakers</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          <View style={styles.subView}>
            <Text style={styles.subtitle}>
              BEST SELLING TV
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.subScrollView} >
                <Image style={styles.swiperPic2} source={require('../image/sellingTV.jpg')} />
              </View>
              <ScrollView containerStyle={styles.swiperContainer2}
                loop={false}
                horizontal='row'
                showsHorizontalScrollIndicator='false'>
                <View style={styles.subScrollView} >
                  <Image style={styles.swiperPic2} source={require('../image/sellingTV.jpg')} />
                </View>
                <View style={styles.subScrollView}>
                  <Image style={styles.swiperPic2} source={require('../image/sellingTV.jpg')} />
                </View>
                <View style={styles.subScrollView}>
                  <Image style={styles.swiperPic2} source={require('../image/sellingTV.jpg')} />
                </View>
                <View style={styles.subScrollView}>
                  <Image style={styles.swiperPic2} source={require('../image/sellingTV.jpg')} />
                </View>
                <View style={styles.subScrollView}>
                  <Image style={styles.swiperPic2} source={require('../image/sellingTV.jpg')} />
                </View>
              </ScrollView>
            </View>
            <Text style={styles.subtitle}>
              BEST SELLING FRIDGE
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.subScrollView} >
                <Image style={styles.swiperPic2} source={require('../image/sellingFridge.jpg')} />
              </View>
              <ScrollView containerStyle={styles.swiperContainer2}
                loop={false}
                horizontal='row'
                showsHorizontalScrollIndicator='false'>
                <View style={styles.subScrollView} >
                  <Image style={styles.swiperPic2} source={require('../image/sellingFridge.jpg')} />
                </View>
                <View style={styles.subScrollView}>
                  <Image style={styles.swiperPic2} source={require('../image/sellingFridge.jpg')} />
                </View>
                <View style={styles.subScrollView}>
                  <Image style={styles.swiperPic2} source={require('../image/sellingFridge.jpg')} />
                </View>
                <View style={styles.subScrollView}>
                  <Image style={styles.swiperPic2} source={require('../image/sellingFridge.jpg')} />
                </View>
                <View style={styles.subScrollView}>
                  <Image style={styles.swiperPic2} source={require('../image/sellingFridge.jpg')} />
                </View>
              </ScrollView>
            </View>
            <ScrollView>
              <Image></Image>
            </ScrollView>
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
    width: width,
  },
  swiperPic: {
    height: 200,
    width: width,
  },
  scrollItemContainer: {
    backgroundColor: 'white',
    height: 180,
    width: width,
  },
  categoryButton: {
    resizeMode: 'contain',
    marginTop: 10,
    height: 50,
    width: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    flex: 1
  },
  subtitle: {
    backgroundColor: 'white',
    fontSize: 30,
    width: width,
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center',
    fontFamily: 'Bitsumishi',
  },
  subView: {
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'center',
    borderRadius: 10,
    margin: 8
  },
  swiperPic2: {
    height: 330,
    resizeMode: 'contain',
    borderRadius: 20,
  },

});
