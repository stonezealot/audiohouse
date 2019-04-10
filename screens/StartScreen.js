import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {cal} from '../components/common'

var {height, width} = Dimensions.get('window');

export default class StartScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const { navigate } = this.props.navigation;
        setTimeout(function () {
            // navigate('Main');
            navigate('Login');
        }, 1000)
    }

    render() {

        return (
            <View style={styles.titleContainer}>
                <Image style={styles.image} source={require('../image/audio_house.jpg')}></Image>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: cal(200),
        resizeMode :'contain' ,
        position: 'relative',
        top: (height-cal(300))/2      
    }
});
