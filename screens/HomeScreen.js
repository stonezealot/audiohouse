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
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput placeholder="Search" style={styles.searchInput}></TextInput>
          <Image style={styles.searchIcon} source={require('../image/search.png')}></Image>
        </View>
        <ScrollView style={styles.container} >
          <Swiper style={styles.swiperContainer}
            removeClippedSubviews = {false}
            showsButtons={true}
            loop={true}
            autoplay={true}
            autoplayTimeout={3}>
            <View><Image style={styles.swiperPic} source={require('../image/swiper1.png')} /></View>
            <View><Image style={styles.swiperPic} source={require('../image/swiper2.png')} /></View>
            <View><Image style={styles.swiperPic} source={require('../image/swiper3.png')} /></View>
          </Swiper>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    height: 64,
    // backgroundColor:'#ff9933',
    backgroundColor: 'white',
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
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    flexDirection: 'column'
  },
  swiperContainer: {
    height: 200,
    width: width
  },
  swiperPic:{
     height:200,
     width:width
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
