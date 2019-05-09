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
    KeyboardAvoidingView,
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
                    navigation.navigate('CheckoutPayment')
                })
        }

    }


    render() {

        const { carts, ewallets, log } = this.state

        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior='padding'
            >
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Billing</Text>
                    </View>
                    <ScrollView>
                        <View style={styles.titleStepContainer}>
                            <Text style={styles.titleStep}>Step 2: Billing Information</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.progressBarBelow}>
                                <View style={styles.progressBarAbove} />
                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.percentage}>50% Complete</Text>
                        </View>
                        <View style={styles.subTitleContainer}>
                            <Text style={styles.subTitle}>Billing Address</Text>
                        </View>
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
                                <View style={styles.combineView}>
                                    <Image style={styles.icon} source={require('../image/postal.png')}></Image>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder='Postal Code'
                                        onChangeText={(postalcode) => { this.setState({ postalcode, inputPostalcode: postalcode }) }}
                                    />
                                </View>
                                <View style={styles.combineView}>
                                    <Image style={styles.icon} source={require('../image/unit.png')}></Image>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder='Unit No.'
                                        onChangeText={(unitNo) => { this.setState({ unitNo }) }}
                                    />
                                </View>
                                <View style={styles.combineView}>
                                    <Image style={styles.icon} source={require('../image/address.png')}></Image>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder='Address'
                                        onChangeText={(address) => { this.setState({ address, inputAddress: address }) }}
                                    />
                                </View>
                            </View>
                        }
                        <View style={styles.subTitleContainer}>
                            <Text style={styles.subTitle}>eWallet</Text>
                        </View>
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
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Text style={{ color: 'gray' }}>Your eWallet balance : ${ewallets.ewalletAmt}</Text>
                                <Text style={{ margin: 10, color: 'gray' }}>You may spend up to ${carts.maxUseVoucher} from your eWallet.</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.dollarContainer}>
                                        <Text style={styles.dollar}>$</Text>
                                    </View>
                                    <TextInput
                                        style={styles.ewalletInput}
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
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Text style={{ color: 'gray', marginBottom: 10 }}>${carts.evoucherGain} will be credited to your eWallet.</Text>
                            </View>
                        }


                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <TouchableOpacity onPress={this.handleCheckoutBilling}>
                                <View style={styles.nextStepBtn}>
                                    <Text style={styles.nextStep}>Next Step</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>



                </View>
            </KeyboardAvoidingView>


        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: 400,
        fontSize: 30,
        paddingTop: 20,
        fontWeight: ('regular', '600'),
        fontFamily: 'ronaldo',
        textAlign: 'center',
    },
    titleStepContainer: {
        margin: 10,
        alignItems: 'center'
    },
    titleStep: {
        fontSize: 25,
        fontWeight: ('bold', '400')
    },
    progressBarBelow: {
        height: 20,
        width: width - 80,
        backgroundColor: '#E6E6E6',
        borderRadius: 10
    },
    progressBarAbove: {
        height: 20,
        width: (width - 80) / 2,
        backgroundColor: '#EE113D',
        borderRadius: 10
    },
    percentage: {
        fontSize: 13,
        color: 'gray'
    },
    subTitleContainer: {
        marginTop: 15,
        marginBottom: 15,
        alignItems: 'center'

    },
    subTitle: {
        fontWeight: ('bold', '400'),
        fontSize: 20
    },
    combineView: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    icon: {
        top: 3,
        height: 23,
        width: 23,
        marginRight: 5
    },
    deliveryTimeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: "#D5D5D5",
    },
    deliveryTime: {
        height: 30,
        borderBottomWidth: 1,
        borderColor: "#D5D5D5",
        paddingLeft: 5,
        paddingTop: 6
    },
    dollarContainer: {
        height: 35,
        width: 32,
        backgroundColor: '#EE113D',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dollar: {
        color: 'white',
        fontSize: 20,
        fontWeight: ('bold', '600')
    },
    textInput: {
        height: 30,
        width: width * 3 / 5,
        borderBottomWidth: 1,
        borderColor: "#D5D5D5",
        paddingLeft: 5
    },
    ewalletInput: {
        height: 35,
        width: 100,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#D5D5D5",
        paddingLeft: 5
    },
    nextStepBtn: {
        height: 40,
        width: width * 1.9 / 5,
        borderRadius: 10,
        backgroundColor: '#EE113D',
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
    },
    nextStep: {
        fontSize: 18,
        color: 'white',
        fontWeight: ('bold', '600'),
        textAlign: 'center',
    },
    logText: {
        fontSize: 15,
        color: 'red'
    },
})