import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Button,
    RefreshControl,
    Modal
} from 'react-native';
import URLSearchParams from 'url-search-params';
import { SecureStore } from "../storage";
import { cal } from '../components/common';

var { height, width } = Dimensions.get('window');

export default class UserScreen extends React.Component {

    static navigationOptions = {
    };

    constructor(props) {
        super(props);
        this.state = {
            serviceEntry: '',
            home: '',
            customer: '',
            name: '',
            email: '',
            phone: '',
            postalcode: '',
            unitNo: '',
            address: '',
            log: '',
            showRemind: false
        };
        navigation = this.props.navigation;
        this.getStorage = this.getStorage.bind(this);
        this.handleUpdateButton = this.handleUpdateButton.bind(this);
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
            //get customer
            console.log('get customer')
            let url = serviceEntry + 'api/customer/'
            let params = new URLSearchParams();
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
                        name: response[0].name,
                        email: response[0].emailAddr,
                        phone: response[0].phone,
                        postalcode: response[0].postalcode,
                        unitNo: response[0].address2,
                        address: response[0].address1
                    })
                })
        })

    }

    componentDidMount() {
        this.getStorage();
    }

    handleUpdateButton() {
        const { name, email, phone, postalcode, unitNo, address, serviceEntry, customer, log } = this.state
        console.log(name + '  ' + email + '  ' + phone + '  ' + postalcode + '  ' + unitNo + '  ' + address)

        if (name == '' || name.toString().trim().length == 0) {
            console.log('Please input your name');
            this.setState({ log: 'Please input your name' })
        } else if (email == '' || email.toString().trim().length == 0) {
            console.log('Please input your email');
            this.setState({ log: 'Please input your email' })
        } else if (phone == '' || phone.toString().trim().length == 0) {
            console.log('Please input your phone');
            this.setState({ log: 'Please input your phone' })
        } else {
            let url = serviceEntry + 'api/customer/' + customer.recKey + '/update';
            const body = {
                custId: customer.custId,
                orgId: "A01",
                custName: name,
                email: email,
                phone: phone,
                addr1: address,
                addr2: unitNo,
                postalcode: postalcode
            }
            fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(body),
            })
                .then(response => {
                    console.log('response', response);
                    if (!response.ok) {
                        console.log('response not ok');
                        // throw response;
                    } else {
                        console.log('response ok');
                        this.setState({
                            showRemind: true
                        });
                        setTimeout(() => {
                            this.setState({
                                showRemind: false
                            })
                        }, 1000);
                        return response.json();
                    }
                })
                .catch(error => {
                    if (error) {
                        // prompt
                        console.log('no success', error);
                    }
                    this.setState({
                        log: 'Update failed',
                    });
                })
        }
    }

    render() {
        const { name, email, phone, postalcode, unitNo, address, customer, log } = this.state

        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior='padding'>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>User</Text>
                </View>
                <ScrollView style={styles.container}>
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>Basic Information</Text>
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/name.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Name'
                            defaultValue={customer.name}
                            onChangeText={(name) => { this.setState({ name }) }}
                        />
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/email.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Email'
                            defaultValue={customer.emailAddr}
                            onChangeText={(email) => { this.setState({ email }) }}
                        />
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/phone.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Phone'
                            defaultValue={customer.phone}
                            onChangeText={(phone) => { this.setState({ phone }) }}
                        />
                    </View>
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>Shipping Address (Optional)</Text>
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
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.updateButton}
                            onPress={this.handleUpdateButton}>
                            <Text style={styles.updateText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        marginTop: 10,
                        alignItems: 'center'
                    }}>
                        <Text style={styles.logText}>{log || null}</Text>
                    </View>
                </ScrollView>
                <Modal
                    animationType='fade'
                    visible={this.state.showRemind}
                    transparent={true}>
                    <View style={styles.loadingScreen}>
                        <Image style={styles.loadingIcon} source={require('../image/loading.gif')} />
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
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
        width: 100,
        fontSize: 30,
        paddingTop: 20,
        fontWeight: ('regular', '600'),
        fontFamily: 'ronaldo',
        textAlign: 'center',
    },
    subtitleContainer: {
        marginTop: 20,
        marginBottom: 10,
        height: 50,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    subtitle: {
        color: 'black',
        fontSize: 20,
        fontWeight: ('regular', '600'),
        textAlign: 'center',
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
    textShowContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        height: 40,
        borderColor: '#D5D5D5'
    },
    textShow: {
        fontSize: 20,
        fontWeight: ('regular', '600'),
        borderColor: "#D5D5D5",
    },
    textInput: {
        height: 30,
        width: width * 3 / 5,
        borderBottomWidth: 1,
        borderColor: "#D5D5D5",
        paddingLeft: 5
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    updateButton: {
        height: 40,
        width: width * 1.9 / 5,
        borderRadius: 10,
        backgroundColor: '#EE113D',
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
    },
    updateText: {
        fontSize: 18,
        color: 'white',
        fontWeight: ('bold', '600'),
        textAlign: 'center',
        // fontFamily:'univiapro',
    },
    logText: {
        fontSize: 15,
        color: 'red'
    },
    loadingScreen: {
        backgroundColor: 'black',
        flex: 1,
        opacity: 0.3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingIcon: {
        height: 40,
        width: 40,
        backgroundColor: 'black',
        opacity: 1
    }

})