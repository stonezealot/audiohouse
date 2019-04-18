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

export default class ForgotScreen extends React.Component{
    static navigationOptions = {
    };

    
}