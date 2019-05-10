import React from 'react';
import {
    Image, Platform, ScrollView,
    StyleSheet, Text, TouchableOpacity, TouchableHighlight,
    View, Dimensions, Modal,
    FlatList, TextInput
} from 'react-native';
import { SecureStore } from "../storage";
import StringDistinction from 'react-native-string-distinction';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from "react-native-scrollable-tab-view"
import URLSearchParams from 'url-search-params';

var { height, width } = Dimensions.get('window');

var cols = 2;
var vMargin = 20;
var cellWH = (width - 2 * vMargin - 15) / cols;
var hMargin = 25;

export default class SearchScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.onChangeText = this.onChangeText.bind(this);
        this.toProduct = this.toProduct.bind(this);
        this.handlePriceRange = this.handlePriceRange.bind(this)
        this.handleCategorys = this.handleCategorys.bind(this)
        this.handleEccatId = this.handleEccatId.bind(this)
        this.handlePriceAsc = this.handlePriceAsc.bind(this)
        this.handlePriceDesc = this.handlePriceDesc.bind(this)
        this.resetState = this.resetState.bind(this)
        this.state = {
            searchText: this.props.navigation.getParam("searchText"),
            selectedShopMenus: this.props.navigation.getParam("selectedShopMenus"),
            selectedShopMenusNetPriceAsc: '',
            selectedShopMenusNetPriceDesc: '',
            serviceEntry: this.props.navigation.getParam("serviceEntry"),
            selectedShopMenusUpdate: '',
            selectedProduct: '',
            isOpen: false,
            minPrice: 0,
            maxPrice: 999999999,
            categorys: '',
            eccatId: this.props.navigation.getParam("eccatId"),
        }
        navigation = this.props.navigation;
    }

    componentDidMount() {

        if (this.state.searchText != '' && this.state.searchText.toString().trim().length != 0) {
            this.setState({
                selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                    return menu.stkId.toUpperCase().includes(this.state.searchText) || menu.name.toUpperCase().includes(this.state.searchText);
                })
            })
        } else {
            this.setState({
                selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                    return menu.eccatId == this.state.eccatId
                })
            })
        }

        this.getStorage()
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

            //get banners
            console.log('get banners')
            let url = serviceEntry + 'api/banners/'
            let params = new URLSearchParams();
            console.log('serviceEntry:  ' + serviceEntry);
            params.append('orgId', 'A01');
            url += ('?' + params);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ categorys: response })
                }, () => {
                    console.log(response.json())
                })

            //get stocks by netPrice asc
            console.log('get stocks by netPrice asc')
            url = serviceEntry + 'api/stocks-net-price-asc/'
            params = new URLSearchParams();
            console.log('serviceEntry:  ' + serviceEntry);
            console.log('orgId:  ' + home.custId)
            params.append('orgId', 'A01');
            url += ('?' + params);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ selectedShopMenusNetPriceAsc: response })
                })

            //get stocks by netPrice desc
            console.log('get stocks by netPrice desc')
            url = serviceEntry + 'api/stocks-net-price-desc/'
            params = new URLSearchParams();
            console.log('serviceEntry:  ' + serviceEntry);
            console.log('orgId:  ' + home.custId)
            params.append('orgId', 'A01');
            url += ('?' + params);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ selectedShopMenusNetPriceDesc: response })
                })
        })
    }

    onChangeText(inputData) {

        if (inputData != '' && inputData.toString().trim().length != 0) {
            this.setState({ searchText: inputData }, () => {
                const { searchText } = this.state;
                console.log(this.state.serviceEntry)
                this.setState({
                    selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                        return menu.stkId.toUpperCase().includes(searchText) || menu.name.toUpperCase().includes(searchText);
                    })
                })
            });
        }
    }

    handlePriceRange() {

        const { minPrice, maxPrice, searchText, eccatId } = this.state

        let min = minPrice
        let max = maxPrice

        if (minPrice == '' || minPrice.toString().trim().length == 0) {
            min = 0
        }

        if (maxPrice == '' || maxPrice.toString().trim().length == 0) {
            max = 999999999
        }

        if (eccatId == '' || eccatId.toString().trim().length == 0) {

            console.log('searchText:  ' + searchText)
            console.log('minPrice:  ' + min)
            console.log('maxPrice:  ' + max)
            console.log('eccatId:  ' + eccatId)

            this.setState({
                selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                    return (menu.stkId.toUpperCase().includes(searchText)
                        || menu.name.toUpperCase().includes(searchText))
                        && menu.netPrice >= min
                        && menu.netPrice <= max
                })
            })
        } else {

            console.log('searchText:  ' + searchText)
            console.log('minPrice:  ' + min)
            console.log('maxPrice:  ' + max)
            console.log('eccatId:  ' + eccatId)

            this.setState({
                selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                    return (menu.stkId.toUpperCase().includes(searchText)
                        || menu.name.toUpperCase().includes(searchText))
                        && menu.netPrice >= min
                        && menu.netPrice <= max
                        && menu.eccatId == eccatId
                })
            })
        }
    }

    handleEccatId() {

        const { minPrice, maxPrice, searchText, eccatId } = this.state

        let min = minPrice
        let max = maxPrice

        if (minPrice == '' || minPrice.toString().trim().length == 0) {
            min = 0
        }

        if (maxPrice == '' || maxPrice.toString().trim().length == 0) {
            max = 999999999
        }

        console.log('searchText:  ' + searchText)
        console.log('minPrice:  ' + min)
        console.log('maxPrice:  ' + max)
        console.log('eccatId:  ' + eccatId)

        this.setState({
            isOpen: false,
            selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                return (menu.stkId.toUpperCase().includes(searchText)
                    || menu.name.toUpperCase().includes(searchText))
                    && menu.netPrice >= min
                    && menu.netPrice <= max
                    && menu.eccatId == eccatId
            })
        })
    }

    handlePriceAsc() {
        const { minPrice, maxPrice, searchText, eccatId } = this.state
        let min = minPrice
        let max = maxPrice

        if (minPrice == '' || minPrice.toString().trim().length == 0) {
            min = 0
        }

        if (maxPrice == '' || maxPrice.toString().trim().length == 0) {
            max = 999999999
        }

        console.log('searchText:  ' + searchText)
        console.log('minPrice:  ' + min)
        console.log('maxPrice:  ' + max)
        console.log('eccatId:  ' + eccatId)

        if (eccatId == '' || eccatId.toString().trim().length == 0) {
            this.setState({
                isOpen: false,
                selectedShopMenusUpdate: this.state.selectedShopMenusNetPriceAsc.filter(menu => {
                    return (menu.stkId.toUpperCase().includes(searchText)
                        || menu.name.toUpperCase().includes(searchText))
                        && menu.netPrice >= min
                        && menu.netPrice <= max
                })
            })
        } else {
            this.setState({
                isOpen: false,
                selectedShopMenusUpdate: this.state.selectedShopMenusNetPriceAsc.filter(menu => {
                    return (menu.stkId.toUpperCase().includes(searchText)
                        || menu.name.toUpperCase().includes(searchText))
                        && menu.netPrice >= min
                        && menu.netPrice <= max
                        && menu.eccatId == eccatId
                })
            })
        }
    }

    handlePriceDesc() {
        const { minPrice, maxPrice, searchText, eccatId } = this.state
        let min = minPrice
        let max = maxPrice

        if (minPrice == '' || minPrice.toString().trim().length == 0) {
            min = 0
        }

        if (maxPrice == '' || maxPrice.toString().trim().length == 0) {
            max = 999999999
        }

        console.log('searchText:  ' + searchText)
        console.log('minPrice:  ' + min)
        console.log('maxPrice:  ' + max)
        console.log('eccatId:  ' + eccatId)

        if (eccatId == '' || eccatId.toString().trim().length == 0) {
            this.setState({
                isOpen: false,
                selectedShopMenusUpdate: this.state.selectedShopMenusNetPriceDesc.filter(menu => {
                    return (menu.stkId.toUpperCase().includes(searchText)
                        || menu.name.toUpperCase().includes(searchText))
                        && menu.netPrice >= min
                        && menu.netPrice <= max
                })
            })
        } else {
            this.setState({
                isOpen: false,
                selectedShopMenusUpdate: this.state.selectedShopMenusNetPriceDesc.filter(menu => {
                    return (menu.stkId.toUpperCase().includes(searchText)
                        || menu.name.toUpperCase().includes(searchText))
                        && menu.netPrice >= min
                        && menu.netPrice <= max
                        && menu.eccatId == eccatId
                })
            })
        }
    }



    resetState() {
        const { minPrice, maxPrice, searchText, eccatId } = this.state

        console.log('reset')

        this.setState({
            minPrice: 0,
            maxPrice: 999999999,
            eccatId: '',
            selectedShopMenusUpdate: this.state.selectedShopMenus.filter(menu => {
                return menu.stkId.toUpperCase().includes(searchText) || menu.name.toUpperCase().includes(searchText);
            })
        },
            () => {
                console.log('searchText:  ' + searchText)
                console.log('minPrice:  ' + minPrice)
                console.log('maxPrice:  ' + maxPrice)
                console.log('eccatId:  ' + eccatId)
            })
    }

    toProduct(recKey) {
        let url = this.state.serviceEntry + 'api/stocks/' + recKey;
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    selectedProduct: response.ecStk
                }, () => {
                    navigation.navigate('Product', { selectedProduct: this.state.selectedProduct })
                })
            })
    }

    _extraUniqueKey(item, index) {
        return "index" + index + item;
    }

    handleProductMenu(item) {

        //handle netPrice
        let netPriceString = item.netPrice.toString();
        let decimalIndex1 = netPriceString.indexOf('.');
        let length = netPriceString.length;
        let cent = length - decimalIndex1;
        if (length - decimalIndex1 == 2) {
            cent = netPriceString.substring(decimalIndex1 + 1, length).concat('0');
        } else {
            cent = netPriceString.substring(decimalIndex1 + 1, length)
        }

        //handle discPrice
        let discPriceString = ('$').concat((item.netPrice - item.refPrice1).toString());
        let decimalIndex2 = discPriceString.indexOf('.');
        if (decimalIndex2 == -1 && (item.netPrice - item.refPrice1 == 0)) {
            discPriceString = null
        } else if (decimalIndex2 != -1 && discPriceString.charAt(decimalIndex2 + 2) != '0') {
            discPriceString = discPriceString.substring(0, decimalIndex2 + 3)
        } else if (decimalIndex2 != -1 && discPriceString.charAt(decimalIndex2 + 2) == '0') {
            discPriceString = discPriceString.substring(0, decimalIndex2 + 2)
        }

        return (
            <TouchableOpacity
                key={item.stkId}
                activeOpacity={0.3}
                onPress={() => this.toProduct(item.recKey)}
            >
                <View style={styles.productItemContainer}>
                    <Image style={styles.productImage} source={require('../image/product.png')} />
                    <View>
                        <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productListPrice}>U.P.$ {item.listPrice}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.productNetPriceDollar}>${decimalIndex1 == -1 ? netPriceString : netPriceString.substring(0, decimalIndex1)}</Text>
                            <Text style={styles.productNetPriceCent}>{decimalIndex1 == -1 ? '00' : cent}</Text>
                            <Text style={styles.productPriceLabel}>{item.priceLabel}</Text>
                        </View>

                        {/* <Text style={styles.membersSpecialText}>Members' Special:</Text> */}
                        <Text style={styles.membersSpecialText}>{discPriceString == null && item.ewallet == 0 ? null : "Members' Special:"}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.voucherMention}>{discPriceString == null ? null : 'Free'}</Text>
                            <Text style={styles.voucherMentionFocus}>{discPriceString}</Text>
                            <Text style={styles.voucherMention}>{item.ewallet == 0 ? null : '+Extra'}</Text>
                            <Text style={styles.voucherMentionFocus}>{item.ewallet == 0 ? null : '$' + item.ewallet}</Text>
                            <Text style={styles.voucherMention}>{item.ewallet == 0 ? null : 'Cashback'}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    handleCategorys(item) {
        return (
            <View>
                {item.paraType1 === 'CAT' ?
                    <TouchableOpacity
                        activeOpacity={0.4}
                        onPress={() => {
                            this.setState({ eccatId: item.paraValue1 }, () => {
                                this.handleEccatId()
                            })
                        }}>
                        <View style={styles.categoryItemContainer}>
                            <Text style={styles.categoryItemName}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    null
                }
            </View>

        )
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        defaultValue={this.state.searchText}
                        onSubmitEditing={(inputData) => this.onChangeText(inputData.nativeEvent.text.toUpperCase())}
                    ></TextInput>
                    <View style={{ width: 60 }} />
                    <TouchableOpacity onPress={() => this.setState({ isOpen: true })}>
                        <Image style={styles.filterIcon} source={require('../image/filter.png')} />
                    </TouchableOpacity>
                    <Image style={styles.searchIcon} source={require('../image/search.png')}></Image>
                </View>
                <FlatList style={{ flex: 1 }}
                    keyExtractor={this._extraUniqueKey}
                    data={this.state.selectedShopMenusUpdate}
                    renderItem={({ item }) => this.handleProductMenu(item)} />
                <Modal
                    animationType='fade'
                    visible={this.state.isOpen}
                    transparent={true}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.setState({ isOpen: false })} activeOpacity={1}>
                            <Image style={{ backgroundColor: 'black', height: height, width: width / 3, opacity: 0.3 }} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
                            <View style={{ height: 40 }}></View>
                            <Text style={styles.priceRangeTitle}>Price Range</Text>
                            <View style={styles.sideMenuItemContainer}>
                                <TextInput
                                    style={styles.priceRangeInput}
                                    onChangeText={(minPrice) => { this.setState({ minPrice }) }}
                                    onSubmitEditing={this.handlePriceRange}
                                    defaultValue={this.state.minPrice.toString()}
                                />
                                <Text style={styles.priceRangeLine}>   —   </Text>
                                <TextInput
                                    style={styles.priceRangeInput}
                                    onChangeText={(maxPrice) => { this.setState({ maxPrice }) }}
                                    onSubmitEditing={this.handlePriceRange}
                                    defaultValue={this.state.maxPrice.toString()}
                                />
                            </View>
                            <Text style={styles.priceRangeTitle}>Category</Text>
                            <View style={[styles.sideMenuItemContainer, { height: 215 }]}>
                                <FlatList
                                    data={this.state.categorys}
                                    numColumns={1}
                                    renderItem={({ item }) => this.handleCategorys(item)}
                                    keyExtractor={this._extraUniqueKey}
                                />
                            </View>
                            <Text style={styles.priceRangeTitle}>Sort by</Text>
                            <View style={styles.sideMenuItemContainerSort}>
                                <TouchableOpacity onPress={this.handlePriceAsc}>
                                    <View style={styles.categoryItemContainer}>
                                        <Text style={styles.categoryItemName}>Lowest Price</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.handlePriceDesc}>
                                    <View style={styles.categoryItemContainer}>
                                        <Text style={styles.categoryItemName}>Highest Price</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={this.resetState} activeOpacity={0.4}>
                            <View style={styles.resetBtnContainer} >
                                <Text style={{ color: '#F7F7F7' }}>Reset</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
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
    filterIcon: {
        width: 33,
        height: 33,
        marginTop: 20,
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
        // backgroundColor: 'powderblue'
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
        fontSize: 12,
        fontWeight: ('bold', '600'),
        backgroundColor: 'white',
        marginTop: 12,
        textDecorationLine: 'underline'
    },
    membersSpecialText: {
        backgroundColor: 'white',
        color: '#8a8a8a',
    },
    voucherMention: {
        color: 'red',
        fontSize: 15,
        fontWeight: ('bold', '500'),
    },
    voucherMentionFocus: {
        color: '#180077',
        fontSize: 15,
        fontWeight: ('bold', '500'),
        marginLeft: 5,
        marginRight: 5
    },
    sideMenuItemContainer: {
        flexDirection: 'row',
        marginLeft: 8,
        marginTop: 18,
        alignItems: 'center',
        borderColor: '#E6E6E6',
        borderBottomWidth: 0.4
    },
    sideMenuItemContainerSort: {
        marginLeft: 8,
        marginTop: 18,
        alignItems: 'center',
        borderColor: '#E6E6E6',
        borderBottomWidth: 0.4
    },
    priceRangeTitle: {
        marginLeft: 10,
        marginTop: 18,
        fontSize: 13,
        fontWeight: ('normal', '100'),
        color: '#808080'
    },
    priceRangeInput: {
        textAlign: 'center',
        height: 30,
        width: 110,
        backgroundColor: '#E6E6E6',
        borderRadius: 30,
        marginBottom: 24
    },
    priceRangeLine: {
        color: '#CCCCCC',
        marginBottom: 24
    },
    categoryItemContainer: {
        height: 30,
        width: width * 2 / 3 - 20,
        backgroundColor: '#E6E6E6',
        borderRadius: 5,
        marginRight: 8,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryItemName: {
        color: 'gray',
        fontSize: 13
    },
    resetBtnContainer: {
        position: 'absolute',
        bottom: 50,
        right: 30,
        height: 40,
        width: 100,
        backgroundColor: '#EE113D',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    }
})