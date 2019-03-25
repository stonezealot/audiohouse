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
  Button,
  PanResponder,
} from 'react-native';


var { height, width } = Dimensions.get('window');

export default class ItemScreen extends React.Component {
  static navigationOptions = {
    title: '详情',
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Image style={styles.picture} source={require('../image/SAM-UA-88KS9800KXXS.jpg')}></Image>
          <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.navigate('Main')}>
            <Image style={styles.backButton} source={require('../image/left-circle.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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
  }
})