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
            dlyDesc: 'Select a time slot based on your postal code',
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
                    <View style={styles.modalItemContainer}>
                        <Text style={styles.modalItem}>{item.dlyDesc}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        const { customer, log } = this.state

        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior='padding'
            >
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Delivery</Text>
                    </View>
                    <ScrollView>
                        <View style={styles.titleStepContainer}>
                            <Text style={styles.titleStep}>Step 1: Delivery Information</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.progressBarBelow}>
                                <View style={styles.progressBarAbove} />
                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.percentage}>25% Complete</Text>
                        </View>
                        <View style={styles.subTitleContainer}>
                            <Text style={styles.subTitle}>Delivery Address</Text>
                        </View>
                        <View style={styles.combineView}>
                            <Image style={styles.icon} source={require('../image/postal.png')}></Image>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Postal Code'
                                defaultValue={customer.postalcode}
                                onChangeText={(postalcode) => { this.setState({ postalcode }) }}
                            />
                        </View>
                        <View style={styles.combineView}>
                            <Image style={styles.icon} source={require('../image/unit.png')}></Image>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Unit No.'
                                defaultValue={customer.address2}
                                onChangeText={(unitNo) => { this.setState({ unitNo }) }}
                            />
                        </View>
                        <View style={styles.combineView}>
                            <Image style={styles.icon} source={require('../image/address.png')}></Image>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Address'
                                defaultValue={customer.address1}
                                onChangeText={(address) => { this.setState({ address }) }}
                            />
                        </View>
                        <View style={styles.subTitleContainer}>
                            <Text style={styles.subTitle}>Delivery Time Slot</Text>
                        </View>
                        <View style={styles.combineView}>
                            <Image style={styles.icon} source={require('../image/clock.png')}></Image>
                            <TouchableOpacity onPress={() => this.setState({ showDeliveryTime: true })}>
                                <View style={styles.deliveryTimeContainer}>
                                    <Text style={styles.deliveryTime}>{this.state.dlyDesc}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.combineView}>
                            <Image style={styles.icon} source={require('../image/remark.png')}></Image>
                            <TextInput
                                style={styles.remark}
                                onChangeText={(remark) => { this.setState({ remark }) }}
                                multiline={true} />
                        </View>
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <TouchableOpacity onPress={this.handleCheckoutDelivery}>
                                <View style={styles.nextStepBtn}>
                                    <Text style={styles.nextStep}>Next Step</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <Modal
                        animationType='fade'
                        visible={this.state.showDeliveryTime}
                        transparent={true}
                        ref={"modal"}>
                        <TouchableOpacity onPress={() => this.setState({ showDeliveryTime: false })} activeOpacity={1}>
                            <Image style={{ backgroundColor: 'black', height: height - 200, width: width, opacity: 0.3 }} />
                        </TouchableOpacity>
                        <View style={styles.deliveryChoiceModal}>
                            <View style={styles.modalHeaderContainer}>
                                <Text style={styles.modalHeader}>Delivery Time</Text>
                            </View>
                            <FlatList style={{ flex: 1 }}
                                extraData={this.state}
                                keyExtractor={this._extraUniqueKey}
                                data={this.state.timeslots}
                                renderItem={({ item }) => this.handleTimeslotsMenu(item)}
                                showsVerticalScrollIndicator={false} />
                        </View>
                    </Modal>
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
        width: (width - 80) / 4,
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
    textInput: {
        height: 30,
        width: width * 3 / 5,
        borderBottomWidth: 1,
        borderColor: "#D5D5D5",
        paddingLeft: 5
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
    remark: {
        height: 100,
        width: width / 2,
        borderWidth: 1,
        borderColor: "#D5D5D5",
        paddingLeft: 5
    },
    modalHeaderContainer: {
        width: width,
        backgroundColor: '#E6E6E6',
        alignItems: 'center'
    },
    modalHeader: {
        marginTop: 5,
        fontSize: 18,
        fontWeight: ('bold', '600'),
        color: 'gray',
        paddingBottom: 5,
    },
    modalItemContainer: {
        marginTop: 30,
        height: 30,
        width: width * 2 / 3,
        backgroundColor: '#E6E6E6',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalItem: {
        height: 30,
        fontSize: 18,
        fontWeight: ('normal', '200'),
        textAlign: 'center',
        color: 'gray',
        paddingTop: 3
    },
    deliveryChoiceModal: {
        width: width,
        backgroundColor: '#F7F7f7',
        height: 200,
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
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
    }
})



