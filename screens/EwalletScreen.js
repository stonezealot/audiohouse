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

export default class EwalletScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceEntry: '',
            home: '',
            ewallets: '',
            ewalletDtls: ''
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
            console.log('get ewallets')
            let url = serviceEntry + 'api/ewallets/'
            let params = new URLSearchParams();
            console.log('serviceEntry:  ' + serviceEntry);
            console.log('custId:  ' + home.custId)
            params.append('orgId', 'A01');
            params.append('custId', home.custId);
            url += ('?' + params);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ ewallets: response[0] })
                })

            url = serviceEntry + 'api/ewallet-details/'
            params = new URLSearchParams();
            console.log('serviceEntry:  ' + serviceEntry);
            console.log('custId:  ' + home.custId)
            params.append('orgId', 'A01');
            params.append('custId', home.custId);
            url += ('?' + params);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ ewalletDtls: response })
                })
        })
    }

    componentDidMount() {
        this.getStorage();
    }

    _extraUniqueKey(item, index) {
        return "index" + index + item;
    }

    handleEwalletDtlMenu(item) {
        return (
            <View>
                <View style={styles.ewalletItemContainer}>
                    <Text style={styles.dateText}>{moment(item.srcDocDate).format("YYYY-MM-DD")}</Text>
                    <Text style={styles.depositText}>
                        {item.type == 'A'
                            ?
                            (item.ewalletAmt < 0
                                ?
                                null
                                :
                                '$' + item.ewalletAmt)
                            :
                            (item.ewalletAmt < 0
                                ?
                                '$' + item.ewalletAmt
                                :
                                null)}
                    </Text>
                    <Text style={styles.withdrawalText}>
                        {item.type == 'A'
                            ?
                            (item.ewalletAmt < 0
                                ?
                                '$' + (-item.ewalletAmt)
                                :
                                null)
                            :
                            (item.ewalletAmt < 0
                                ?
                                null
                                :
                                '$' + (-item.ewalletAmt))}
                    </Text>
                </View>
                <View style={{ height: 30, backgroundColor: 'white', flexDirection: 'row' }}>
                    <Text>Order Ref.   </Text>
                    <Text>{item.srcDocId}</Text>
                </View>

            </View>
        )
    }



    render() {
        const { ewallets } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Ewallet</Text>
                </View>
                <View style={styles.header}>
                    {/* <Text style={styles.headerTitle}>{ewallets.ewalletAmt}</Text> */}
                    <Text style={styles.headerText}>${ewallets.ewalletAmt}</Text>
                </View>
                <View style={styles.headerContainer}>
                    <Text style={styles.dateHeader}>Date</Text>
                    <Text style={styles.depositHeader}>Deposit</Text>
                    <Text style={styles.withdrawalHeader}>Withdrawal</Text>
                </View>
                <FlatList style={{ flex: 1 }}
                    extraData={this.state}
                    keyExtractor={this._extraUniqueKey}
                    data={this.state.ewalletDtls}
                    renderItem={({ item }) => this.handleEwalletDtlMenu(item)} />
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
    header: {
        height: 150,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainer: {
        flexDirection: 'row',
        height: 30,
        borderBottomWidth: 1,
        borderColor: 'gray'
    },
    headerText: {
        fontSize: 40,
        fontWeight: ('bold', '700')
    },
    ewalletItemContainer: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        flexDirection: 'row'
    },
    dateHeader: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: 'white',
        fontSize: 20,
        fontWeight: ('bold', '300')
    },
    depositHeader: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: 'white',
        fontSize: 20,
        fontWeight: ('bold', '300')
    },
    withdrawalHeader: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: 'white',
        fontSize: 20,
        fontWeight: ('bold', '300')
    },
    dateText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: ('normal', '100')
    },
    depositText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: ('normal', '100')
    },
    withdrawalText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: ('normal', '100')
    }
})