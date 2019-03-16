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
  Dimensions
} from 'react-native';
import { WebBrowser } from 'expo';
import { cal } from '../components/common'
import Swiper from 'react-native-swiper'

var { height, width } = Dimensions.get('window');

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      content: '空白',
      url: ''
    };
  }

  componentDidMount() {
    setTimeout(()=>{
      this.setState({
          swiperShow:true
      });
  },0)
  }

  static navigationOptions = {
    header: null,
  };



  render() {
    
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput placeholder="Search"
            style={styles.searchInput}
            onSubmitEditing={() => { alert('去搜索') }}
          ></TextInput>
          <Image style={styles.searchIcon} source={require('../image/search.png')}></Image>
        </View>
        <ScrollView>
            <Swiper containerStyle={styles.swiperContainer}
              removeClippedSubviews={false}
              showsButtons={true}
              loop={true}
              autoplay={true}
              autoplayTimeout={2}>
              <TouchableOpacity onPress={() => { alert('点击了第一张图') }}><Image style={styles.swiperPic} source={require('../image/swiper1.png')} /></TouchableOpacity>
              <TouchableOpacity onPress={() => { alert('点击了第二张图') }}><Image style={styles.swiperPic} source={require('../image/swiper2.png')} /></TouchableOpacity>
              <TouchableOpacity onPress={() => { alert('点击了第三张图') }}><Image style={styles.swiperPic} source={require('../image/swiper3.png')} /></TouchableOpacity>
              <TouchableOpacity onPress={() => { alert('点击了第三张图') }}><Image style={styles.swiperPic} source={require('../image/swiper4.png')} /></TouchableOpacity>
              <TouchableOpacity onPress={() => { alert('点击了第三张图') }}><Image style={styles.swiperPic} source={require('../image/swiper5.png')} /></TouchableOpacity>
            </Swiper>
          <View>
            <Text style={styles.subtitle}>Time Sales</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,  
    backgroundColor: 'white',
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
  subtitle:{
    fontSize:20,
    marginTop:5,
    textAlign:'center'

  }
});
