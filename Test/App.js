import React, {Component} from 'react';
import {
	AppRegistry,
	Button,
	TextInput,
	Platform,
	StyleSheet,
	Text,
	ScrollView,
	View
	} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { sha256 } from 'react-native-sha256';
import {createStackNavigator, StackActions, NavigationActions} from 'react-navigation';
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

const dirs = RNFetchBlob.fs.dirs
var path = dirs.DocumentDir + '/my.csv';
	/*
	 * Check to see if the CSV file exists
	 * If it does then skip this portion as to not add the headers again
	 * If not then create this file at the file path for android and add headers
	 */
	 RNFetchBlob.fs.exists(path)
.then((exist) => {
    if(exist === false){
			RNFetchBlob.fs.writeStream(path, 'base64', true)
		     .then((stream) => {
		         stream.write(RNFetchBlob.base64.encode('licNum, DOB, fName, lName, address, town, state, gender ' + '\n'))
		         return stream.close()
		     })
		}
})

type Props = {};
class App extends Component<Props> {

	//Add states for input boxes
    constructor(props) {
        super(props);
        this.state = {
			licNum: "",
			dob: "",
			fName: "",
			lName: "",
			address: "",
			town: "",
			st8: "",
			gndr: ""
        };
    }

		onPressTest(){
			var num = 1;
			var temp = 10000000;
			var csvData = [];
			for(num; num < 5000; num++){

				csvData = [
				10000000,
				"12/4/95",
				"Nick",
				"Corcoran",
				"123 test st",
				"testville",
				"Testachusetts",
				"t"

			 ];
			 csvData[0] = 10000000;
			 csvData[0] = csvData[0] + num;
			 csvData[0] = "S" + csvData[0];

			 sha256(csvData[0]).then( hash => {
			 csvData[0] = hash
			 RNFetchBlob.fs.appendFile(path, RNFetchBlob.base64.encode(csvData + '\n'), 'base64')
						 .then(()=>{ return;})
			 })

				csvData[0] = 10000000;
			}
			console.warn("done");
		}
		getDate()
		{
			var today = new Date();
    	var birthDate = new Date(this.state.dob);
	    var age = today.getFullYear() - birthDate.getFullYear();
	    var m = today.getMonth() - birthDate.getMonth();
	    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
			{
	        age--;
	    }
			if(age >= 21)
      {
        alert("Guest Is 21+")
      }
		}



	//Function for submit button
    onPressEnterData(){
	  //When submit is pressed, an array is populated with the new state of each input box
	  var csvData = [

		 this.state.licNum,
		 this.state.dob,
		 this.state.fName,
		 this.state.lName,
		 this.state.address,
		 this.state.town,
		 this.state.st8,
		 this.state.gndr

	  ];

		sha256(csvData[0]).then( hash => {
			csvData[0] = hash
    //console.warn(csvData[0]);
		})
		sha256(csvData[4]).then( hash => {
			csvData[4] = hash
    //console.warn(csvData[4]);
		})

	  //console.warn("Directory: ", dirs.DocumentDir);
	  //Array is indexed properly can store csvData[0] into string to dup check
	  //console.warn("Array[0]: ", csvData[0]);
		  //Read file before adding new info to it
		  //Currently just reads the file and spits out the info in a warn
		  RNFetchBlob.fs.readStream(path, 'utf8')
			.then((stream) => {
				let data = ''
				stream.open()
				stream.onData((chunk) => {
					data += chunk

				})

				stream.onEnd(() => {
					if(data.includes(csvData[0])){
						alert('Duplicate Warning!' + '\n' + 'Guest Has Already Entered The Event')
						//console.warn(csvData[0], " Is already in the file");
					}
					else{

						//Append the input data to the file
						RNFetchBlob.fs.writeStream(path, 'base64', true)
						.then((stream) => {
							stream.write(RNFetchBlob.base64.encode(csvData + '\n'))
							return stream.close()
						})
						alert('Guest Added To The Event List!')
					}

				})
			})
      // Resets the input boxes to empty after the submission
      // Taken out right now for test demonstration
		/*	this.setState({licNum: "",
										dob: "",
										fName: "",
										lName: "",
										address: "",
										town: "",
										st8: "",
										gndr: ""
							        })*/

    }

    render() {
        return (
								<ScrollView style={{flex:1}}>
                <View style={{flex: 1, justifyContent: 'center', margin: 10, alignItems: 'center'}}>
                <View style={{flex: 1, backgroundColor: 'powderblue', margin: 10, justifyContent: 'center', alignItems: 'center'}} />
								<View style={{flex: 1, backgroundColor: 'skyblue'}} />

                <View style={{flex: 1, backgroundColor: 'steelblue'}} />
                <Text style={styles.welcome}>EManage</Text>
                <Text style={styles.instructions}>Please Enter the Following Data</Text>




                <TextInput
                style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, width: "59%", borderColor: 'gray', borderWidth: 2 , textAlign: 'center' }}
                onChangeText={(licNum) => this.setState({licNum})}
                value={this.state.licNum}
                placeholder = "License Number"
								placeholderTextColor = "black"
                />

                <TextInput
                style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, width: "59%", borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(dob) => this.setState({dob})}
                value={this.state.dob}
                placeholder = "MM/DD/YYYY"
								placeholderTextColor = "black"
                />

                <TextInput
                style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, width: "59%", borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(fName) => this.setState({fName})}
                value={this.state.fName}
                placeholder = "First Name"
								placeholderTextColor = "black"
                />

                <TextInput
                style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, width: "59%", borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(lName) => this.setState({lName})}
                value={this.state.lName}
                placeholder = "Last Name"
								placeholderTextColor = "black"
                />

                <TextInput
                style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, width: "59%", borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(address) => this.setState({address})}
                value={this.state.address}
                placeholder = "Address"
								placeholderTextColor = "black"
                />

                <TextInput
                style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, width: "59%", borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(town) => this.setState({town})}
                value={this.state.town}
                placeholder = "Town"
								placeholderTextColor = "black"
                />

                <TextInput
                style={{height: 40, width: 50, margin: 10, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, width: "59%", borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(st8) => this.setState({st8})}
                value={this.state.st8}
                placeholder = "State"
								placeholderTextColor = "black"
                />

                <TextInput
                style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, width: "59%", borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(gndr) => this.setState({gndr})}
                value={this.state.gndr}
                placeholder = "Gender"
								placeholderTextColor = "black"
                />
								<View style={[{ width: "59%", margin: 10, backgroundColor: "purple" }]}>
                <Button  onPress ={this.onPressEnterData.bind(this)}
            			title="Submit"
            			color='purple'
            		/>
								<Button  onPress ={this.onPressTest.bind(this)}
            			title="Test"
            			color='purple'
            		/>
								<Button  onPress ={this.getDate.bind(this)}
            			title="Get Date"
            			color='purple'
            		/>
                <Button
                       title="Nodes"
                       onPress = {() => {
                       this.props.navigation.dispatch(StackActions.reset({
                             index: 0,
                             actions: [
                                       NavigationActions.navigate({ routeName: 'DistributedList'})
                                       ],
                             }))
                       }}
                       color='purple'
                       />
								</View>


								</View>
                </ScrollView>
                );
    }
}

// --------------------------------------------------------------------------------------------------------------------------
// DistributedList Proof of Concept

type Props = {};
class Dlist extends Component<Props> {
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
      connect('ce:c0:79:87:1b:86')
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

        <Button
               title="Return"
               onPress = {() => {
               this.props.navigation.dispatch(StackActions.reset({
                     index: 0,
                     actions: [
                               NavigationActions.navigate({ routeName: 'UserInput'})
                               ],
                     }))
               }}
               color='steelblue'
               />
      </View>
    );
  }
}

export default createStackNavigator({
            DistributedList: {
            screen: Dlist,
            },
            UserInput: {
            screen: App,
            },
        }, { initialRouteName: 'UserInput',
    });

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
