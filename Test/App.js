/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

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
import {
	createStackNavigator,
	stackActions,
	NavigationActions,
} from 'react-navigation';
import nodejs from 'nodejs-mobile-react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { sha256 } from 'react-native-sha256';
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
  getConnectionInfo
} from 'react-native-wifi-p2p';




const instructions = Platform.select({

  /*ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
	android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',*/

});

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
export default class App extends Component<Props> {
	
	//Android p2p
	
	androidPeers()
	{
		initialize();
		isSuccessfulInitialize()
			.then(status => console.warn(status));
		startDiscoveringPeers()
			.then(() => console.warn('Starting of discovering was successful'))
			.catch(err => console.warn(err));
			
		getAvailablePeers()
		.then(({ devices }) => console.warn(devices))
	}

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
						alert('Duplicate Warning!')
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
			this.setState({licNum: "",
										dob: "",
										fName: "",
										lName: "",
										address: "",
										town: "",
										st8: "",
										gndr: ""
							        })

	  // just makes a warning pop up with the data entered in the text boxes
	  //console.warn(csvData);

    }
	
	
	
	//Backend
	/*componentWillMount()
  {
    nodejs.start('main.js');
    nodejs.channel.addListener(
      'message',
      (msg) => {
        alert('From node: ' + msg);
      },
      this
    );
  }*/



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
                placeholder = "Date of Birth"
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
				 <Button  onPress ={this.androidPeers.bind(this)}
            			title="Node"
            			color='purple'
            		/>
				</View>







				</View>
                </ScrollView>
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
		color:'black',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: 'black',
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
