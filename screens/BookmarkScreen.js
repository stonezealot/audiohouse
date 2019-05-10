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
import { gray } from 'ansi-colors';

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
        this.toProduct = this.toProduct.bind(this);
        this.bookmarkDelete = this.bookmarkDelete.bind(this);
        this.addToCart = this.addToCart.bind(this)
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
            cashcarry: "N",
            installationFlg: "N"
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

    bookmarkDelete(stkId) {
        const serviceEntry = this.state.serviceEntry;
        const home = this.state.home;
        let url = serviceEntry + 'api/delete-bookmark';
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


    _extraUniqueKey(item, index) {
        return "index" + index + item;
    }

    handleBookmarkMenu(item) {

        const Rightbuttons = [
            {
                backgroundColor: 'red',
                color: 'white',
                text: 'Delete',
                onPress: () => this.bookmarkDelete(item.stkId)
            }]

        return (
            <SwipeView
                right={Rightbuttons}
                autoClose={true}>
                <View style={styles.bookmarkItemContainer}>
                    <TouchableOpacity
                        key={item.stkId}
                        activeOpacity={0.3}
                        onPress={() => this.toProduct(item.stkRecKey)}
                    >
                        <Image style={styles.bookmarkImage} source={require('../image/product.png')} />
                    </TouchableOpacity>

                    <View>
                        <Text style={styles.bookmarkName}>{item.name}</Text>
                        <View style={styles.netPriceContainer}>
                            <Text style={styles.netPrice}>${item.netPrice}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Text style={{ color: '#8a8a8a' }}>Bookmarked Date</Text>
                                <Text style={{ color: '#8a8a8a' }}>{moment(item.createDate).format("YYYY-MM-DD")}</Text>
                            </View>
                            <View style={{ marginLeft: 85, marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => this.addToCart(item.stkId)}>
                                    <View style={styles.iconContainer}>
                                        <Image style={styles.icon} source={require('../image/cart.png')} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>

                </View>
            </SwipeView>
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
        backgroundColor: '#EE113D',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#D5D5D5'
    },
    title: {
        color: 'white',
        fontSize: 30,
        paddingTop: 20,
        fontWeight: ('regular', '600'),
        fontFamily: 'ronaldo',
        textAlign: 'center',
    },
    bookmarkItemContainer: {
        height: 150,
        width: width,
        margin: 0.5,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderBottomWidth: 0.2,
        borderColor: '#EEEEEE',
        borderRadius: 5,
    },
    bookmarkImage: {
        height: 140,
        width: 140,
        margin: 5,
        backgroundColor: 'powderblue'
    },
    bookmarkName: {
        position: 'relative',
        left: 1,
        width: width - 160,
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
    },
    iconContainer: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
    },
    icon: {
        height: 30,
        width: 30,
    }
})