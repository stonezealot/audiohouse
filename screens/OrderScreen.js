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

export default class OrderScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        navigation = this.props.navigation;
    }
    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            <ScrollView
                contentContainerStyle={styles.container}
                contentInset={styles.contentInset}
                ref={(view) => { this.myScrollView = view }}
            >
                <View style={styles.header} />
                <TouchableOpacity
                    style={styles.login}
                    onPress={() => { this.myScrollView.scrollTo({ y: 1000 }) }}>
                    <Text>让我滚回去</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#EEEEEE',
    },
    contentInset: {
        top: -1000, left: 0, bottom: 0, right: 0
      },
    header:{
        height: 1000,
        backgroundColor: '#3399ff',
    }
  })