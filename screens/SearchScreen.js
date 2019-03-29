import React from 'react';
import {
    Image, Platform, ScrollView,
    StyleSheet, Text, TouchableOpacity,
    View, Dimensions, Modal,
    FlatList, TextInput
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from "react-native-scrollable-tab-view"
import URLSearchParams from 'url-search-params';

var { height, width } = Dimensions.get('window');


export default class SearchScreen extends React.Component {

    _extraUniqueKey(item, index) {
        return "index" + index + item;
    }

    constructor(props) {
        super(props);
        this._onChangeText = this._onChangeText.bind(this);
        this.state = {
            searchText: this.props.navigation.getParam("searchText"),
            selectedShopMenus: '',
            selectedShopMenusUpdate: ''
        }
    }

    componentDidMount() {
        const { selectedShopMenus, searchText } = this.state;
        let url = 'http://192.168.1.74:8080/' + 'api/stocks';
        const params = new URLSearchParams();
        params.append('orgId', 'A01');
        url += ('?' + params);
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    selectedShopMenus: response,
                }, () => {
                    this.setState({
                        selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                            return menu.stkId.toUpperCase().includes(searchText) || menu.name.toUpperCase().includes(searchText);
                        })
                    })
                }
                );
            });
    }

    handleProductMenu(item) {
        return (
            <TouchableOpacity
                key={item.stkId}
                style={{ height: 100, width: width }}
            >
                <View style={{ height: 100, width: width, backgroundColor: 'powderblue' }}>
                    <Text>{item.stkId}</Text>
                    <Text>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _onChangeText(inputData) {
        this.setState({ searchText: inputData }, () => {
            const { selectedShopMenus, searchText } = this.state;
            this.setState({
                selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                    return menu.stkId.toUpperCase().includes(searchText) || menu.name.toUpperCase().includes(searchText);
                })
            })
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput placeholder="Search"
                        style={styles.searchInput}
                        onSubmitEditing={(inputData) => this._onChangeText(inputData.nativeEvent.text)}
                    ></TextInput>
                    <Image style={styles.searchIcon} source={require('../image/search.png')}></Image>
                </View>
                <FlatList style={{ flex: 1 }}
                    keyExtractor={this._extraUniqueKey}
                    data={this.state.selectedShopMenusUpdate}
                    renderItem={({ item }) => this.handleProductMenu(item)} />
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        flexDirection: 'column'
    },
    searchContainer: {
        flexDirection: 'row',
        height: 64,
        backgroundColor: '#EE113D',
        alignItems: 'center'
    },
    searchInput: {
        height: 35,
        width: width * 0.75,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#EEEEEE',
        borderRadius: 30,
        marginTop: 20,
        left: width * 0.25 / 2,
        paddingLeft: 30
    },
    searchIcon: {
        position: 'absolute',
        width: 25,
        height: 25,
        top: 29,
        left: 55
    },
})