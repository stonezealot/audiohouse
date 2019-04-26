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
import moment from 'moment';

var { height, width } = Dimensions.get('window');

export default class BookmarkScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceEntry: '',
            home: '',
            bookmarks: '',
        };
        navigation = this.props.navigation;
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
            //get bookmarks
            console.log('get bookmarks')
            let url = serviceEntry + 'api/bookmarks/'
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
                    this.setState({ bookmarks: response })
                })
        })
    }

    componentDidMount() {
        this.getStorage();
    }

    _extraUniqueKey(item, index) {
        return "index" + index + item;
    }

    handleBookmarkMenu(item) {

        return (
            <View style={styles.cartlineItemContainer}>
                <Image style={styles.cartlineImage} />
                <View>
                    <Text style={styles.cartlineName}>{item.name}</Text>
                    <View style={styles.netPriceContainer}>
                        <Text style={styles.netPrice}>${item.netPrice}</Text>
                    </View>
                    <Text style={{ color: '#8a8a8a' }}>Bookmarked Date</Text>
                    <Text style={{ color: '#8a8a8a' }}>{moment(item.createDate).format("YYYY-MM-DD")}</Text>
                </View>

            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Bookmark</Text>
                </View>
                <FlatList style={{ flex: 1 }}
                    extraData={this.state}
                    keyExtractor={this._extraUniqueKey}
                    data={this.state.bookmarks}
                    renderItem={({ item }) => this.handleBookmarkMenu(item)} />
            </View>
        )
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
        width: 200,
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
    netPriceContainer: {
        width: width / 5,
        height: 40,
        justifyContent: 'center',
        marginRight: 60,
        marginBottom: 30
    },
    netPrice: {
        backgroundColor: 'white',
        fontSize: 20,
        color: 'red',
    }
})