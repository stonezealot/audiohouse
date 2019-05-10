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
export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceEntry: 'http://172.20.10.9:8080/',
            name: '',
            pwd: '',
            toHome: false,
            toRigistration: false,
            loading: false,
            home: '',
            log: '',
            selectedShopMenus: ''
        }
        navigation = this.props.navigation;
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.handleRegisterButton = this.handleRegisterButton.bind(this);
    }

    componentDidMount() {
    }

    getStorage = async () => {

    }

    handleLoginButton() {
        this.setState({
            loading: true,
        });
        console.log('login button pressed');
        const name = this.state.name;
        const pwd = this.state.pwd;
        const serviceEntry = this.state.serviceEntry;

        let url = serviceEntry + 'api/login';
        const body = {
            orgId: "A01",
            name: name,
            pwd: pwd,
            ecshopId: "AUDIOHOUSE",
            guestRecKey: ""
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
                    throw response;
                } else {
                    return response.json();
                }
            })
            .then(response => {
                this.setState({ home: response });
                return Promise.all([
                    SecureStore.setItemAsync('home', JSON.stringify(response)),
                    SecureStore.setItemAsync('serviceEntry', this.state.serviceEntry),
                    response,
                ])
            })
            .then(([response, home]) => {
                let promiseArray = [];
                let url = serviceEntry + 'api/stocks';
                let params = new URLSearchParams();
                params.append('orgId', 'A01');
                url += ('?' + params);
                let promiseObject = { url: url, nameString: 'stocks' };
                promiseArray.push(promiseObject);
                return Promise.all([
                    ...promiseArray.map(el =>
                        fetch(el.url)
                            .then(response => {
                                console.log(el.nameString);
                                return response.json();
                            })
                            .then(response => {
                                console.log('fetching', el.nameString);
                                return SecureStore.setItemAsync(el.nameString, JSON.stringify(response))
                            })
                    )
                ]);




                // fetch(url, {
                //     method: 'GET'
                // })
                //     .then(response => response.json())
                //     .then(response => {
                //         console.log('setStocks')
                //         return SecureStore.setItemAsync('stocks', JSON.stringify(response))
                //     })



                // .then(() => {
                //     console.log('home:  ' + JSON.stringify(this.state.home));
                //     console.log('serviceEntry:  ' + this.state.serviceEntry);
                //     console.log('stocks:  ' + JSON.stringify(SecureStore.getItemAsync('stocks')));
                //     console.log('go to Home')
                //     navigation.navigate('Home', { serviceEntry: this.state.serviceEntry, home: this.state.home })
                // })
            })
            .then(() => {
                this.setState({ loading: false });
                console.log('home:  ' + JSON.stringify(this.state.home));
                console.log('serviceEntry:  ' + this.state.serviceEntry);
                console.log('stocks:  ' + JSON.stringify(SecureStore.getItemAsync('stocks')));
                navigation.navigate('Home', { serviceEntry: this.state.serviceEntry, home: this.state.home })
            })
            .catch(error => {
                // console.log(error);
                if (error) {
                    // prompt
                    console.log('no success', error);
                }
                // reset state
                this.setState({
                    userId: '',
                    password: '',
                    log: 'invalid user id and password combination',
                    loading: false,
                });
            });
    }

    handleRegisterButton() {
        navigation.navigate('Register', { serviceEntry: this.state.serviceEntry })
    }


    render() {

        const { name, pwd, log, toHome, toRegistration, loading } = this.state;

        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior='padding'
            >
                <View style={styles.container}>
                    {/* <Text style={styles.title}>Audio House</Text> */}
                    <Image style={styles.image} source={require('../image/audio_house.jpg')}></Image>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={styles.icon} source={require('../image/name.png')}></Image>
                        <TextInput
                            style={styles.name}
                            placeholder='Enter email or phone number'
                            onChangeText={(name) => { this.setState({ name }) }}
                            value={name}
                            onSubmitEditing={() => { this.secondTextInput.focus(); }}

                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={styles.icon} source={require('../image/password.png')}></Image>
                        <TextInput
                            style={styles.pwd}
                            ref={(input) => { this.secondTextInput = input; }}
                            placeholder='Password'
                            secureTextEntry={true}
                            onChangeText={(pwd) => { this.setState({ pwd }) }}
                            value={pwd}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.loginButton}
                            onPress={this.handleLoginButton.bind(this)}>
                            <Text style={styles.loginText}>Login In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.RegisterButton}
                            onPress={this.handleRegisterButton.bind(this)}>
                            <Text style={styles.loginText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.logText}>{log || null}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <TouchableOpacity>
                            <Image style={styles.facebook} source={require('../image/loginfacebook.png')} />
                        </TouchableOpacity>
                    </View>
                    <Modal
                        animationType='fade'
                        visible={this.state.loading}
                        transparent={true}>
                        <View style={styles.loadingScreen}>
                            <Image style={styles.loadingIcon} source={require('../image/loading.gif')} />
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        width: width,
        textAlign: 'center',
        fontSize: 70,
        fontFamily: 'pledg',
        // fontFamily:'univiapro',
        marginBottom: 80
    },
    image: {
        height: cal(180),
        resizeMode: 'contain',
        marginBottom: 100
    },
    icon: {
        top: 3,
        height: 33,
        width: 33,
        marginRight: 5
    },
    name: {
        width: width * 3 / 5,
        height: 40,
        backgroundColor: 'white',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderColor: "#D5D5D5",
        borderRadius: 10,
        textAlign: 'center',
    },
    pwd: {
        width: width * 3 / 5,
        height: 40,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: "#D5D5D5",
        borderRadius: 10,
        marginBottom: 30,
        textAlign: 'center',
    },
    loginButton: {
        height: 40,
        width: width * 1.9 / 5,
        borderRadius: 10,
        backgroundColor: '#EE113D',
        justifyContent: 'center',
        overflow: 'hidden',
        marginRight: 10,
        alignItems: 'center',
    },
    RegisterButton: {
        height: 40,
        width: width * 1.9 / 5,
        borderRadius: 10,
        backgroundColor: '#28108A',
        justifyContent: 'center',
        overflow: 'hidden',
        marginLeft: 10
    },
    loginText: {
        fontSize: 18,
        color: 'white',
        fontWeight: ('bold', '600'),
        textAlign: 'center',
        fontFamily: 'varela',
    },
    forgotText: {
        color: 'gray',
        textDecorationLine: 'underline'
    },
    logText: {
        fontSize: 15,
        color: 'red'
    },
    facebook: {
        height: 30,
        width: 30
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