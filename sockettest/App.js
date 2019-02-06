/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

window.navigator.userAgent = 'ReactNative';

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';


export default class App extends React.Component {
state = {
  name: 'Nick'
}
constructor(props){
  super(props);
  
  this.socket = io('http://172.18.24.117:8000'); // connects to the local server
  this.socket.on('receiveMsg', () => this.setState({name: 'Jake'})); // Listen for server event and invoke function to change name
}

pressButton()
{
    console.log('Hello server I am client nice meet u');
    this.socket.emit('pressButton');

}



  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Socket.io with React Native!</Text>
        <Text style={styles.welcome}> {this.state.name}</Text>
        <Button onPress = {this.pressButton.bind(this)}
          title = "send"
          color = "blue"
        />
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
});
