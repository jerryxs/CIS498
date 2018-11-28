import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Button
} from 'react-native';
import {
  initialize,
  isSuccessfulInitialize,
  startDiscoveringPeers,
  stopDiscoveringPeers,
  unsubscribeFromPeersUpdates,
  unsubscribeFromConnectionInfoUpdates,
  subscribeOnConnectionInfoUpdates,
  subscribeOnPeersUpdates,
  connect,
  disconnect,
  createGroup,
  removeGroup,
  getAvailablePeers,
  sendFile,
  receiveFile,
  getConnectionInfo,
  receiveMessage,
  sendMessage
} from 'react-native-wifi-p2p';
import { PermissionsAndroid } from 'react-native';

type Props = {};
export default class App extends Component<Props> {
	constructor(props){
	super(props);
  this.state = {
    devices: []
  };
}

  componentDidMount() {
    initialize();
    isSuccessfulInitialize()
        .then(status => console.warn(status));
    startDiscoveringPeers()
        .then(() => console.warn('Sucessfull'))
        .catch(err => console.warn(err));

    subscribeOnPeersUpdates(({ devices }) => this.handleNewPeers(devices));
    subscribeOnConnectionInfoUpdates(this.handleNewInfo);
  }

  componentWillUnmount() {
    unsubscribeFromConnectionInfoUpdates((event) => console.log('unsubscribeFromConnectionInfoUpdates', event));
    unsubscribeFromPeersUpdates((event) => console.log('unsubscribeFromPeersUpdates', event));
  }

  handleNewInfo = (info, sceondParam) => {
    console.warn(64646776467, info);
  };

  handleNewPeers = (peers) => {
    console.log(754862162442324, peers);
    this.setState({ devices: peers });
  };

  connectToFirstDevice = () => {
      console.warn(this.state.devices[0]);
      connect(this.state.devices[0].deviceAddress)
          .then(() => console.warn('Successfully connected'))
          .catch(err => console.error('Something gone wrong. Details: ', err));
  };

  disconnectFromDevice = () => {
      disconnect()
          .then(() => console.log(2423435423, 'Successfully disconnected'))
          .catch(err => console.error(2423435423, 'Something gone wrong. Details: ', err));
  };

  onCreateGroup = () => {
      createGroup()
          .then(() => console.warn('Group created successfully!'))
          .catch(err => console.error('Something gone wrong. Details: ', err));
  };

  onRemoveGroup = () => {
      removeGroup()
          .then(() => console.warn('Currently you don\'t belong to group!'))
          .catch(err => console.error('Something gone wrong. Details: ', err));
  };

  onStopInvestigation = () => {
      stopDiscoveringPeers()
          .then(() => console.warn('Stopping of discovering was successful'))
          .catch(err => console.error(`Something is gone wrong. Maybe your WiFi is disabled? Error details`, err));
  };

  onStartInvestigate = () => {
      startDiscoveringPeers()
          .then(status => console.warn(33333333, `Status of discovering peers: ${status}`))
          .catch(err => console.error(`Something is gone wrong. Maybe your WiFi is disabled? Error details: ${err}`));
  };

  onGetAvailableDevices = () => {
      getAvailablePeers()
          .then(peers => console.warn(peers));
  };

  onSendMessage = () => {
      sendMessage("Hello world!")
        .then(() => console.warn('Message sent successfully'))
        .catch(err => console.log('Error while message sending', err));
  };

  onReceiveMessage = () => {
      receiveMessage()
          .then((msg) => alert('Message received successfully ' +  msg))
          .catch(err => console.warn('Error while message receiving', err))
  };

  onGetConnectionInfo = () => {
    getConnectionInfo()
        .then(info => console.warn(info));
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Connect"
          onPress={this.connectToFirstDevice}
        />
        <Button
          title="Disconnect"
          onPress={this.disconnectFromDevice}
        />
        <Button
          title="Create group"
          onPress={this.onCreateGroup}
        />
        <Button
          title="Remove group"
          onPress={this.onRemoveGroup}
        />
        <Button
          title="Investigate"
          onPress={this.onStartInvestigate}
        />
        <Button
          title="Prevent Investigation"
          onPress={this.onStopInvestigation}
        />
        <Button
          title="Get Available Devices"
          onPress={this.onGetAvailableDevices}
        />
        <Button
          title="Get connection Info"
          onPress={this.onGetConnectionInfo}
        />
        <Button
          title="Send message"
          onPress={this.onSendMessage}
        />
        <Button
          title="Receive message"
          onPress={this.onReceiveMessage}
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
//needed since we are not using create-react-native-app
AppRegistry.registerComponent('Test', () => UselessTextInput);
