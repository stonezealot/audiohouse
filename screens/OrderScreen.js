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

export default class OrderScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceEntry: '',
            home: '',
            orders: ''
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
            console.log('get orders')
            let url = serviceEntry + 'api/orders/'
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
                    this.setState({ orders: response })
                })
        })
    }

    componentDidMount() {
        this.getStorage();
    }

    _extraUniqueKey(item, index) {
        return "index" + index + item;
    }

    handleOrderMenu(item) {
        return (
            <View style={styles.orderItemContainer}>
                <View style={{ width: 2 / 3 * width }}>
                    <View style={styles.orderTextContainer}>
                        <Text style={styles.orderHeader}>Order Ref.  </Text>
                        <Text style={styles.orderData}>{item.docId}</Text>
                    </View>
                    <View style={styles.orderTextContainer}>
                        <Text style={styles.orderHeader}>Date  </Text>
                        <Text style={styles.orderData}>{moment(item.docDate).format("YYYY-MM-DD")}</Text>
                    </View>
                    <View style={styles.orderTextContainer}>
                        <Text style={styles.orderHeader}>Grand Total  </Text>
                        <Text style={styles.orderData}>$ {item.grantTotal}</Text>
                    </View>
                    <View style={styles.orderTextContainer}>
                        <Text style={styles.orderHeader}>Status  </Text>
                        <Text style={styles.orderData}>
                            {item.statusFlg == 'A'
                                ?
                                'Active' :
                                (item.statusFlg == 'B'
                                    ?
                                    'Cancelled'
                                    : (item.statusFlg == 'D'
                                        ?
                                        'Posting'
                                        : (item.statusFlg == 'L' || item.statusFlg == 'E'
                                            ?
                                            'Paid'
                                            : (item.statusFlg == 'F'
                                                ?
                                                'Inactive'
                                                : (item.statusFlg == 'X'
                                                    ?
                                                    'Processing'
                                                    : null)))))}
                        </Text>
                    </View>
                </View>
                <View style={{ width: 1 / 3 * width }}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity>
                            <View style={styles.detailBtn}>

                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity>
                            <View style={styles.actionBtn}>

                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Order History</Text>
                </View>
                <FlatList style={{ flex: 1 }}
                    extraData={this.state}
                    keyExtractor={this._extraUniqueKey}
                    data={this.state.orders}
                    renderItem={({ item }) => this.handleOrderMenu(item)} />
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
    orderItemContainer: {
        height: 150,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        flexDirection: 'row'
    },
    orderTextContainer: {
        height: 150 / 4,
        alignItems: 'center',
        flexDirection: 'row'
    },
    orderHeader: {
        fontSize: 17,
        fontWeight: ('bold', '500')
    },
    orderData: {
        fontSize: 17,
        fontWeight: ('normal', '100')
    },
    buttonContainer: {
        height: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    detailBtn: {
        height: 35,
        width: 100,
        backgroundColor: '#2A7CF8',
        borderRadius: 10
    },
    actionBtn: {
        height: 35,
        width: 100,
        backgroundColor: '#4ED369',
        borderRadius: 10
    }
})