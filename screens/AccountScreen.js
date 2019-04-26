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

export default class AccountScreen extends React.Component {

    static navigationOptions = {
    };

    constructor(props) {
        super(props);
        this.state = {
            serviceEntry: '',
            home: '',
            customer: '',
            oldPassword: '',
            newPassword: '',
            log: ''
        };
        navigation = this.props.navigation;
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
                        customer: response[0]
                    })
                })
        })
    }

    componentDidMount() {
        this.getStorage();
    }

    handleUpdateButton() {
        const { newPassword, oldPassword, serviceEntry, customer, log } = this.state
        let url = serviceEntry + 'api/customer/' + customer.recKey + '/change-password';
        const body = {
            custId: customer.custId,
            orgId: "A01",
            oldPassword: oldPassword,
            newPassword: newPassword,
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

    render() {

        const { newPassword, oldPassword, log } = this.state

        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior='padding'>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Account</Text>
                </View>
                <ScrollView style={styles.container}>
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>Change Password</Text>
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/password.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Old Password'
                            onChangeText={(oldPassword) => { this.setState({ oldPassword }) }}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={styles.combineView}>
                        <Image style={styles.icon} source={require('../image/password.png')}></Image>
                        <TextInput
                            style={styles.textInput}
                            placeholder='New Password'
                            onChangeText={(newPassword) => { this.setState({ newPassword }) }}
                            secureTextEntry={true}
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
        width: 200
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
    }

})