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

export default class CheckoutDeliveryScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceEntry: '',
            home: '',
            carts: '',
            postalcode: '',
            unitNo: '',
            address: '',
            customer: '',
            deliveryTime: '',
            remark: '',
            log: '',
            showDeliveryTime: false,
            timeslots: '',
            timeslotId: '',
            dlyDesc: '',
            dlyZoneId: '',
            dlyDate: '',
        };
        navigation = this.props.navigation;
        this.handleCheckoutDelivery = this.handleCheckoutDelivery.bind(this)
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

            //get carts
            console.log('get orders')
            let url = serviceEntry + 'api/carts/'
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
                    this.setState({ carts: response[0] })
                })

            //get customer
            console.log('get customer')
            url = serviceEntry + 'api/customer/'
            params = new URLSearchParams();
            params.append('custId', home.custId);
            params.append('orgId', 'A01');
            url += ('?' + params);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        customer: response[0],
                        postalcode: response[0].postalcode,
                        unitNo: response[0].address2,
                        address: response[0].address1
                    })
                })

            //get deliveryTimeslots
            console.log('get deliveryTimeslots')
            url = serviceEntry + 'api/timeslots/'
            params = new URLSearchParams();
            params.append('orgId', 'A01');
            params.append('dlyZoneId', 'A1');
            url += ('?' + params);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        timeslots: response
                    })
                })

            //recalculate    
            url = serviceEntry + 'api/recalculate'
            console.log(url)
            const body = {
                orgId: "A01",
                custId: home.custId,
                ecshopId: "AUDIOHOUSE"
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
                .then(() => {
                    console.log('recalculate')
                })
        })
    }

    componentDidMount() {
        this.getStorage();
    }

    handleCheckoutDelivery() {
        console.log('Handle Checkout Delivery')
        const { postalcode, unitNo, address, dlyZoneId, dlyDate, timeslotId, remark, serviceEntry, home, log } = this.state
        let url = serviceEntry + 'api/checkout-delivery'
        const body = {
            orgId: "A01",
            custId: home.custId,
            ecshopId: "AUDIOHOUSE",
            dlyZoneId: dlyZoneId,
            dlyDate: dlyDate,
            timeslotId: timeslotId,
            addr1: address,
            addr2: unitNo,
            postalcode: postalcode,
            remark: remark
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
            .then(() => {
                console.log('checkout delivery')
                navigation.navigate('CheckoutBilling')
            })
    }


    _extraUniqueKey(item, index) {
        return "index" + index + item;
    }

    handleTimeslotsMenu(item) {
        return (
            <View>
                <TouchableOpacity
                    key={item.recKey}
                    activeOpacity={0.3}
                    onPress={() => {
                        this.setState({
                            showDeliveryTime: false,
                            timeslotId: item.timeslotId,
                            dlyDesc: item.dlyDesc,
                            dlyZoneId: item.dlyZoneId,
                        }
                            , () => {
                                console.log('timeslotId:  ' + this.state.timeslotId)
                                console.log('dlyDesc:  ' + this.state.dlyDesc)
                            })
                    }}>
                    <Text>{item.dlyDesc}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        const { customer, log } = this.state

        return (
            <View>
                <Text>Step 1: Delivery Information</Text>
                <Text>Delivery Address</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Postal Code</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Postal Code'
                        defaultValue={customer.postalcode}
                        onChangeText={(postalcode) => { this.setState({ postalcode }) }}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Unit No. (If Applicable)</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Unit No.'
                        defaultValue={customer.address2}
                        onChangeText={(unitNo) => { this.setState({ unitNo }) }}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Address</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Address'
                        defaultValue={customer.address1}
                        onChangeText={(address) => { this.setState({ address }) }}
                    />
                </View>
                <Text>Delivery Time Slot</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Delivery Time</Text>
                    <TouchableOpacity onPress={() => this.setState({ showDeliveryTime: true })}>
                        {this.state.timeslotId == ''
                            ?
                            <Text>Select a time slot based on your postal code</Text>
                            :
                            <Text>{this.state.dlyDesc}</Text>
                        }
                    </TouchableOpacity>
                </View>
                <Text>remark</Text>
                <TextInput style={{ height: 150, width: width * 4 / 5, borderWidth: 1 }}
                    onChangeText={(remark) => { this.setState({ remark }) }} />
                <TouchableOpacity onPress={this.handleCheckoutDelivery}>
                    <Text>Next Step</Text>
                </TouchableOpacity>
                <Modal
                    animationType='slide'
                    visible={this.state.showDeliveryTime}
                    transparent={true}
                    ref={"modal"}>
                    <View style={styles.deliveryChoiceModal}>
                        <FlatList style={{ flex: 1 }}
                            extraData={this.state}
                            keyExtractor={this._extraUniqueKey}
                            data={this.state.timeslots}
                            renderItem={({ item }) => this.handleTimeslotsMenu(item)} />
                    </View>
                </Modal>
            </View>
        )
    }



}

const styles = StyleSheet.create({
    textInput: {
        height: 30,
        width: width * 3 / 5,
        borderBottomWidth: 1,
        borderColor: "#D5D5D5",
        paddingLeft: 5
    },
    deliveryChoiceModal: {
        width: width,
        backgroundColor: 'white',
        height: 300,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#D5D5D5',
    }
})



