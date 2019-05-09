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
            log: ''
        }
        navigation = this.props.navigation
    }

    static navigationOptions = {
        header: null,
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Payment</Text>
                </View>
                <ScrollView>
                    <View style={styles.titleStepContainer}>
                        <Text style={styles.titleStep}>Step 3: Payment</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.progressBarBelow}>
                            <View style={styles.progressBarAbove} />
                        </View>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.percentage}>75% Complete</Text>
                    </View>
                    <View style={styles.subTitleContainer}>
                        <Text style={styles.subTitle}>Payment</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.paymentText}>Visa/Mastercard</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity>
                            <Image style={styles.image} source={require('../image/visa.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image style={styles.image} source={require('../image/mastercard.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.paymentText}>eNETS</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity>
                            <Image style={styles.image} source={require('../image/enets.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.paymentText}>American Express</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity>
                            <Image style={styles.image} source={require('../image/americanexpress.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.paymentText}>HSBC IPP</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity>
                            <Image style={styles.image} source={require('../image/hsbc.png')} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
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
        width: (width - 80) * 3 / 4,
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
    image: {
        height: 50,
        width: 100,
        resizeMode: 'contain',
        marginLeft: 10,
        marginRight: 10
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15
    },
    paymentText: {
        color: 'gray'
    }
})