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
  RefreshControl,
} from 'react-native';
import URLSearchParams from 'url-search-params';
import {secureStore} from "../storage";


export default class LoginScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            serviceEntry:'http://192.168.1.77:8080/',
            userId: '',
            password:'',
            toHome:false,
            toRigistration:false,
            loading: false,
        }
    }

    componentDidMount() {
    }

    getStorage = async() => {

    }
}