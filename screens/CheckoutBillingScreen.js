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
    DeviceEventEmitter,
} from 'react-native';
import { SecureStore } from "../storage";
import URLSearchParams from 'url-search-params';
import SwipeView from 'react-native-swipeout';
import moment from 'moment';
import { CheckBox, Input } from 'react-native-elements'

var { height, width } = Dimensions.get('window');

export default class CheckoutBillingScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            serviceEntry: '',
            home: '',
            carts: '',
            ewallets: '',
            evoucherRedeem: '0',
            postalcode: '',
            inputPostalcode: '',
            unitNo: '',
            address: '',
            inputAddress: '',
            addressFlg: 'Y',
            checkboxdelivery: true,
            checkboxewallet: true,
            log: ''
        }
        this.handleCheckoutBilling = this.handleCheckoutBilling.bind(this)
        navigation = this.props.navigation
    }

    static navigationOptions = {
        header: null,
    }

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
            console.log('get carts')
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
                    this.setState({
                        carts: response[0],
                        postalcode: response[0].dpostalcode,
                        unitNo: response[0].daddress2,
                        address: response[0].daddress1
                    })
                })

            //get ewallets
            console.log('get ewallets')
            url = serviceEntry + 'api/ewallets/'
            params = new URLSearchParams();
            console.log('serviceEntry:  ' + serviceEntry);
            console.log('custId:  ' + home.custId)
            params.append('custId', home.custId);
            params.append('orgId', 'A01');
            url += ('?' + params);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ ewallets: response[0] })
                })
        })
    }

    componentDidMount() {
        this.getStorage();
    }

    handleCheckoutBilling() {
        console.log('Handle Checkout Billing')
        const { serviceEntry, postalcode, unitNo, address, checkboxdelivery, checkboxewallet, carts, addressFlg, evoucherRedeem, home
            , inputPostalcode, inputAddress } = this.state

        if (evoucherRedeem > carts.maxUseVoucher) {
            this.setState({ log: 'Please enter a value not exceeding $' + carts.maxUseVoucher },
                () => {
                    console.log(this.state.log)
                })
        } else if (evoucherRedeem % 20 != 0) {
            this.setState({ log: 'Please enter a value that is a multiple of 20. E.g. 0, 20, 40.' },
                () => {
                    console.log(this.state.log)
                })
        } else if (addressFlg == 'N' && (inputPostalcode == '' || inputPostalcode.toString().trim().length == 0)) {
            this.setState({ log: 'Please enter your postal code.' },
                () => {
                    console.log(this.state.log)
                })
        } else if (addressFlg == 'N' && (inputAddress == '' || inputAddress.toString().trim().length == 0)) {
            this.setState({ log: 'Please enter your address.' },
                () => {
                    console.log(this.state.log)
                })
        } else {
            let url = serviceEntry + 'api/checkout-billing'
            const body = {
                orgId: "A01",
                custId: home.custId,
                ecshopId: "AUDIOHOUSE",
                addressFlg: addressFlg,
                addr1: address,
                addr2: unitNo,
                postalcode: postalcode,
                ewalletRedeem: evoucherRedeem
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
                    console.log('checkout Billing')
                    // navigation.navigate('CheckoutBilling')
                })
        }

    }


    render() {

        const { carts, ewallets, log } = this.state

        return (
            <View>
                <Text>Step 2: Billing Information</Text>
                <Text>Billing Address</Text>
                <CheckBox
                    title='Use delivery address'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.state.checkboxdelivery}
                    checkedColor='#EE113D'
                    onPress={() => this.setState({ checkboxdelivery: true, addressFlg: 'Y' })}
                />
                <CheckBox

                    title='Use a different address'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={!this.state.checkboxdelivery}
                    checkedColor='#EE113D'
                    onPress={() => this.setState({ checkboxdelivery: false, addressFlg: 'N' })}
                />
                {this.state.checkboxdelivery ?
                    null
                    :
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Postal Code</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Postal Code'
                                onChangeText={(postalcode) => { this.setState({ postalcode, inputPostalcode: postalcode }) }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Unit No. (If Applicable)</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Unit No.'
                                onChangeText={(unitNo) => { this.setState({ unitNo }) }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Address</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Address'
                                onChangeText={(address) => { this.setState({ address, inputAddress: address }) }}
                            />
                        </View>
                    </View>
                }
                <Text>eWallet</Text>
                <CheckBox
                    title='I would like to use my Cashback! (only entitled to 3% rebate in Cashback)'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.state.checkboxewallet}
                    checkedColor='#EE113D'
                    onPress={() => this.setState({ checkboxewallet: true })}
                />
                <CheckBox

                    title='I would like to keep my Cashback!'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={!this.state.checkboxewallet}
                    checkedColor='#EE113D'
                    onPress={() => this.setState({ checkboxewallet: false })}
                />
                {this.state.checkboxewallet ?
                    <View>
                        <Text>Your eWallet balance : ${ewallets.ewalletAmt}</Text>
                        <Text>You may spend up to ${carts.maxUseVoucher} from your eWallet.</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>$ </Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='e.g. 100'
                                defaultValue={this.state.evoucherRedeem}
                                onChangeText={(evoucherRedeem) => { this.setState({ evoucherRedeem }) }} />
                        </View>
                        <View style={{
                            marginTop: 10,
                            alignItems: 'center'
                        }}>
                            <Text style={styles.logText}>{log || null}</Text>
                        </View>
                    </View>
                    :
                    <Text>${carts.evoucherGain} will be credited to your eWallet.</Text>
                }


                <TouchableOpacity onPress={this.handleCheckoutBilling}>
                    <Text>Next Step</Text>
                </TouchableOpacity>

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