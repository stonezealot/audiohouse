import React from 'react';
import { Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  FlatList} from 'react-native';

var { height, width } = Dimensions.get('window');

export default class CartScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    navigation = this.props.navigation;
  }
  static navigationOptions = {
    title: 'Cart',
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
        </ScrollView>
        <View style={styles.bottomBtnContainer}>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#EEEEEE',
  },
  bottomBtnContainer: {
    backgroundColor: 'white',
    height: 50,
    width: width,
    flexDirection: 'row'
  },
});
