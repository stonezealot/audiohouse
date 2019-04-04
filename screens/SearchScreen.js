import React from 'react';
import {
    Image, Platform, ScrollView,
    StyleSheet, Text, TouchableOpacity,
    View, Dimensions, Modal,
    FlatList, TextInput
} from 'react-native';
import StringDistinction from 'react-native-string-distinction';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from "react-native-scrollable-tab-view"
import URLSearchParams from 'url-search-params';

var { height, width } = Dimensions.get('window');


export default class SearchScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.onChangeText = this.onChangeText.bind(this);
        this.toProduct = this.toProduct.bind(this);
        this.state = {
            searchText: this.props.navigation.getParam("searchText"),
            selectedShopMenus: this.props.navigation.getParam("selectedShopMenus"),
            selectedShopMenusUpdate: ''
        }
        navigation = this.props.navigation;
    }

    componentDidMount() {
        this.setState({
            selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                return menu.stkId.toUpperCase().includes(this.state.searchText) || menu.name.toUpperCase().includes(this.state.searchText);
            })
        })

    }

    onChangeText(inputData) {
        this.setState({ searchText: inputData }, () => {
            const { searchText } = this.state;
            this.setState({
                selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                    return menu.stkId.toUpperCase().includes(searchText) || menu.name.toUpperCase().includes(searchText);
                })
            })
        });
    }

    toProduct() {
        navigation.navigate('Product');
    }

    _extraUniqueKey(item, index) {
        return "index" + index + item;
    }

    handleProductMenu(item) {
        let netPriceString = item.netPrice.toString();
        let decimalIndex1 = netPriceString.indexOf('.');
        let length = netPriceString.length;
        let cent = length - decimalIndex1;
        if (length - decimalIndex1 == 2) {
            cent = netPriceString.substring(decimalIndex1 + 1, length).concat('0');
        } else {
            cent = netPriceString.substring(decimalIndex1 + 1, length)
        }
        let discPriceString = (item.netPrice - item.refPrice1).toString();
        let decimalIndex2 = discPriceString.indexOf('.');
        // if (item.netPrice - item.refPrice1 == 0) {
        //     discPriceString = ''
        // }

        if(decimalIndex2 == -1 && (item.netPrice - item.refPrice1 == 0)){
            discPriceString = ''
        }else if(decimalIndex2 != -1 && discPriceString.charAt(decimalIndex2+2) != '0'){
            discPriceString = discPriceString.substring(0, decimalIndex2 + 3)
        }else if(decimalIndex2 != -1 && discPriceString.charAt(decimalIndex2+2) == '0'){
            discPriceString = discPriceString.substring(0, decimalIndex2 + 2)
        }



        return (
            <TouchableOpacity
                key={item.stkId}
                activeOpacity={0.3}
                onPress={() => this.toProduct()}
            >
                <View style={styles.productItemContainer}>
                    <Image style={styles.productImage} />
                    <View>
                        <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productListPrice}>U.P.$ {item.listPrice}</Text>
                        <Text style={styles.productPriceLabel}>{item.priceLabel}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.productNetPriceDollar}>${decimalIndex1 == -1 ? netPriceString : netPriceString.substring(0, decimalIndex1)}</Text>
                            <Text style={styles.productNetPriceCent}>{decimalIndex1 == -1 ? '00' : cent}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.deliveryText}>{discPriceString}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput placeholder="Search"
                        style={styles.searchInput}
                        onSubmitEditing={(inputData) => this.onChangeText(inputData.nativeEvent.text.toUpperCase())}
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
    productItemContainer: {
        height: 150,
        width: width,
        margin: 0.5,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    productImage: {
        height: 150,
        width: 150,
        backgroundColor: 'powderblue'
    },
    productName: {
        width: width - 150,
        height: 40,
        fontSize: 15,
        fontWeight: ('bold', '500'),
        backgroundColor: 'white',
    },
    productPriceLabel: {
        backgroundColor: 'pink',
        color: 'red',
        backgroundColor: 'white',
        fontSize: 10,
        fontWeight: ('bold', '800'),
        left: 3,
        marginTop: 5,
        alignItems: 'center'
    },
    productListPrice: {
        color: 'gray',
        textDecorationLine: 'line-through',
        backgroundColor: 'white',
        fontSize: 14,
        fontWeight: ('bold', '200'),
        marginTop: 5
    },
    productNetPriceDollar: {
        color: 'red',
        fontSize: 25,
        fontWeight: ('bold', '600'),
        backgroundColor: 'white',
        marginTop: 2
    },
    productNetPriceCent: {
        color: 'red',
        fontSize: 9,
        fontWeight: ('bold', '600'),
        backgroundColor: 'white',
        marginTop: 12,
        textDecorationLine: 'underline'
    },
    deliveryText: {
        color: '#8a8a8a',
        backgroundColor: 'white',
        fontSize: 15,
        fontWeight: ('bold', '400'),
        paddingLeft: 5,
        marginRight: 10
    }
})