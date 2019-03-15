import {Dimensions} from 'react-native';

const BASE_WIDTH = 750;

export function cal(size) {
    let {width} = Dimensions.get('window');

    return size*width/BASE_WIDTH;
}