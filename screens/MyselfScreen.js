import React from 'react';
import { ExpoConfigView } from '@expo/samples';

export default class MyselfScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
  }
  static navigationOptions = {
    header: null,
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <ExpoConfigView />;
  }
}
