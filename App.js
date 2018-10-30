/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, TextInput, Platform, StyleSheet, Text, View} from 'react-native';



const instructions = Platform.select({
  /*ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',*/
});

type Props = {};
export default class App extends Component<Props> {
    
    constructor(props) {
        super(props);
        this.state = { licNum: "",
        dob: ""
        };
    }
    
    render() {
        return (
                <View style={{flex: 1}}>
                <View style={{flex: 1, backgroundColor: 'powderblue'}} />
                <View style={{flex: 2, backgroundColor: 'skyblue'}} />
                
                <TextInput
                style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, width: 375, borderColor: 'gray', borderWidth: 2}}
                onChangeText={(licNum) => this.setState({licNum})}
                value={this.state.licNum}
                placeholder = "Enter License Number"
                />
                
                <TextInput
                style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, width: 375, borderColor: 'gray', borderWidth: 2}}
                onChangeText={(dob) => this.setState({dob})}
                value={this.state.dob}
                placeholder = "Enter DOB"
                />
            
                
                <Text style={styles.welcome}>EManage</Text>
                <Text style={styles.instructions}>I cant get anything else to work</Text>
                
                <View style={{flex: 3, backgroundColor: 'steelblue'}} />
                </View>
                );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  license: {
    height: 40,
    width: 100,
    borderColor: 'gray',
    borderWidth: 2
 },

});

//needed since we are not using create-react-native-app
AppRegistry.registerComponent('Test', () => UselessTextInput);
