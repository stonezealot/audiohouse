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
    setTimeout(() => {
      this.setState({
        swiperShow: true
      });
    }, 0)
  }

  static navigationOptions = {
    header: null,
  };

  renderScrollItem() {
    var itemArr = [];
    var colorArr = ['red', 'green'];
    for (var i = 0; i < colorArr.length; i++) {
      itemArr.push(
        <View key={i} style={{ backgroundColor: colorArr[i], width: width / 2, height: 200 }}>
          <Text>{i}</Text>
        </View>
      )
    }

    return itemArr;
  }


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
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Item')}><Image style={styles.swiperPic} source={require('../image/swiper1.png')} /></TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Item')}><Image style={styles.swiperPic} source={require('../image/swiper2.png')} /></TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Item')}><Image style={styles.swiperPic} source={require('../image/swiper3.png')} /></TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Item')}><Image style={styles.swiperPic} source={require('../image/swiper4.png')} /></TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Item')}><Image style={styles.swiperPic} source={require('../image/swiper5.png')} /></TouchableOpacity>
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
        </ScrollView>
      </View>
    );
  }

  // renderScrollItem(){
  //       var itemArr=[];
  //       var colorArr=['red','green'];
  //       for(var i=0;i<colorArr.length;i++){
  //         itemArr.push(
  //           <View key={i} style={{backgroundColor:colorArr[i], width:{width}/2 ,height:200  }  }>
  //           <Text>{i}</Text>
  //           </View>
  //         )
  //       }
  // }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  subtitle: {
    fontSize: 20,
    marginTop: 5,
    textAlign: 'center'
  },
  scrollItemContainer: {
    backgroundColor: 'white',
    height: 200,
    width: width,
  },
  categoryButton: {
    resizeMode :'contain',
    marginTop:20,
    height: 50,
    width: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
});
