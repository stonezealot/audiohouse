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
} from 'react-native';
import URLSearchParams from 'url-search-params';
import { SecureStore } from "../storage";
import { cal } from '../components/common';

var { height, width } = Dimensions.get('window');
export default class LoginScreen extends React.Component {

    static navigationOptions = {

    };

    constructor(props) {
        super(props);
        this.state = {
            serviceEntry: this.props.navigation.getParam('serviceEntry'),
            name: '',
            pwd: '',
            comfirmPwd: '',
            email: '',
            phone: '',
            postalCode: '',
            unitNo: '',
            address: '',
            log: ''
        }
        this.handleRegisterButton = this.handleRegisterButton.bind(this);
    }


    handleRegisterButton() {
        console.log('Register button pressed');
        const { name, pwd, comfirmPwd, email, phone, postalCode, unitNo, address, serviceEntry, log } = this.state;
        console.log("name=" + name + " pwd=" + pwd + " email=" + email + " phone=" + phone + " postalCode=" + postalCode);

        if (name == '' || name.toString().trim().length == 0) {
            console.log('Please input your name');
            this.setState({ log: 'Please input your name' })
        } else if (pwd == '') {
            console.log('Please input your password');
            this.setState({ log: 'Please input your password' })
        } else if (pwd !== comfirmPwd) {
            console.log('Please check your password');
            this.setState({ log: 'Please check your password' })
        } else if (email == '' || email.toString().trim().length == 0) {
            console.log('Please input your email');
            this.setState({ log: 'Please input your email' })
        } else if (phone == '' || phone.toString().trim().length == 0) {
            console.log('Please input your phone');
            this.setState({ log: 'Please input your phone' })
        } else {
            let url = serviceEntry + 'api/register';
            const body = {
                orgId: "A01",
                firstName: name,
                lastName: "",
                email: email,
                phone: phone,
                pwd: pwd,
                addr1: address,
                addr2: unitNo,
                addr3: "",
                city: "",
                country: "",
                postalcode: postalCode,
                ecshopId: "AUDIOHOUSE",
                guestRecKey: ""
            };
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
                        return response.json();
                    }
                })
                .then(() =>{
                    console.log('Register successfully');
                    navigation.navigate('Login');
                })
                .catch(error => {
                    if (error) {
                        // prompt
                        console.log('no success', error);
                    }
                    this.setState({
                        log: 'Register failed',
                    });
                })

        }
    }


    render() {

        const { name, pwd, comfirmPwd, email, phone, postalCode, unitNo, address, log } = this.state

        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior='padding'
            >
                <ScrollView style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Register</Text>
                    </View>
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>Basic Information</Text>
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/name.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Name'
                            onSubmitEditing={() => { this.passwordTextInput.focus(); }}
                            onChangeText={(name) => { this.setState({ name }) }}
                            value={name}
                        />

                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/password.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Password'
                            ref={(input) => { this.passwordTextInput = input; }}
                            onSubmitEditing={() => { this.comfirmTextInput.focus(); }}
                            onChangeText={(pwd) => { this.setState({ pwd }) }}
                            value={pwd}
                        />
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/password.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Confirm Password'
                            ref={(input) => { this.comfirmTextInput = input; }}
                            onSubmitEditing={() => { this.emailTextInput.focus(); }}
                            onChangeText={(comfirmPwd) => { this.setState({ comfirmPwd }) }}
                            value={comfirmPwd}
                        />
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/email.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Email'
                            ref={(input) => { this.emailTextInput = input; }}
                            onSubmitEditing={() => { this.phoneTextInput.focus(); }}
                            onChangeText={(email) => { this.setState({ email }) }}
                            value={email}
                        />
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/phone.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Phone'
                            ref={(input) => { this.phoneTextInput = input; }}
                            onSubmitEditing={() => { this.postalCodeTextInput.focus(); }}
                            onChangeText={(phone) => { this.setState({ phone }) }}
                            value={phone}
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
                            ref={(input) => { this.postalCodeTextInput = input; }}
                            onSubmitEditing={() => { this.unitTextInput.focus(); }}
                            onChangeText={(postalCode) => { this.setState({ postalCode }) }}
                            value={postalCode}
                        />
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/unit.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Unit No.'
                            ref={(input) => { this.unitTextInput = input; }}
                            onSubmitEditing={() => { this.addressTextInput.focus(); }}
                            onChangeText={(unitNo) => { this.setState({ unitNo }) }}
                            value={unitNo}
                        />
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/address.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Address'
                            ref={(input) => { this.addressTextInput = input; }}
                            onChangeText={(address) => { this.setState({ address }) }}
                            value={address}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.registerButton}
                            onPress={this.handleRegisterButton}>
                            <Text style={styles.registerText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        marginTop: 10,
                        alignItems: 'center'
                    }}>
                        <Text style={styles.logText}>{log || null}</Text>
                    </View>
                </ScrollView>
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
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#D5D5D5'
    },
    title: {
        color: 'black',
        fontSize: 30,
        paddingTop: 20,
        fontWeight: ('regular', '600'),
        fontFamily: 'pledg',
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
    registerButton: {
        height: 40,
        width: width * 1.9 / 5,
        borderRadius: 10,
        backgroundColor: '#EE113D',
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
    },
    registerText: {
        fontSize: 18,
        color: 'white',
        fontWeight: ('bold', '600'),
        textAlign: 'center',
        // fontFamily:'univiapro',
    },
    logText: {
        fontSize: 15,
        color: 'red'
    }
})