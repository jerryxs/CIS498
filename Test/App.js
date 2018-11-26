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
	View
	} from 'react-native';
import {
	createStackNavigator,
	stackActions,
	NavigationActions,
} from 'react-navigation';
import nodejs from 'nodejs-mobile-react-native';
import RNFetchBlob from 'rn-fetch-blob';



//import { Zyre } from "zyre";

//const Zyre = require('zyre.js');

//New zyre object
/*const zyre = new Zyre({
  name: 'foo',      // Name of the zyre node
  iface: 'eth0',    // Network interface
  headers: {        // Headers will be sent on every new connection
    foo: 'bar',
  },
  evasive: 5000,    // Timeout after which the local node will try to ping a not responding peer
  expired: 30000,   // Timeout after which a not responding peer gets disconnected
  port: 49152,      // Port for incoming messages, will be incremented if already in use
  bport: 5670,      // Discovery beacon broadcast port
  binterval: 1000,  // Discovery beacon broadcast interval
});*/

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
	  
	  console.warn("Directory: ", path);
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
					console.warn(data)
				})
			})
		  
		  //Append the input data to the file
		  RNFetchBlob.fs.writeStream(path, 'base64', true)
		.then((stream) => {
			stream.write(RNFetchBlob.base64.encode(csvData + '\n'))
			return stream.close()
		})
	  
	  // just makes a warning pop up with the data entered in the text boxes
	  console.warn(csvData);

    }
	//Backend for zyre
	componentWillMount()
  {
    nodejs.start('main.js');
    nodejs.channel.addListener(
      'message',
      (msg) => {
        alert('From node: ' + msg);
      },
      this
    );
  }



    render() {
        return (
                <View style={{flex: 1}}>
                <View style={{flex: 1, backgroundColor: 'powderblue'}} />
                <Text style={styles.welcome}>EManage</Text>
                <Text style={styles.instructions}>Please Enter the Following Data</Text>




				
                <TextInput
                style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, borderColor: 'gray', borderWidth: 2 , textAlign: 'center' }}
                onChangeText={(licNum) => this.setState({licNum})}
                value={this.state.licNum}
                placeholder = "License Number"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(dob) => this.setState({dob})}
                value={this.state.dob}
                placeholder = "Date of Birth"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(fName) => this.setState({fName})}
                value={this.state.fName}
                placeholder = "First Name"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(lName) => this.setState({lName})}
                value={this.state.lName}
                placeholder = "Last Name"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(address) => this.setState({address})}
                value={this.state.address}
                placeholder = "Address"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(town) => this.setState({town})}
                value={this.state.town}
                placeholder = "Town"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(st8) => this.setState({st8})}
                value={this.state.st8}
                placeholder = "State"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
                style={{height: 40, borderColor: 'gray', borderWidth: 2, textAlign: 'center'}}
                onChangeText={(gndr) => this.setState({gndr})}
                value={this.state.gndr}
                placeholder = "Gender"
                />

                <Button onPress ={this.onPressEnterData.bind(this)}
            			title="Submit"
            			color='purple'
            		/>
				<Button title="Message Node"
					onPress={() => nodejs.channel.send('A message!')}
				/>

                <View style={{flex: 2, backgroundColor: 'skyblue'}} />

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
