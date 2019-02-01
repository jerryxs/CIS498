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
	View,
	ScrollView
	} from 'react-native';
import {
	createStackNavigator,
	stackActions,
	NavigationActions,
	DrawerNavigator
} from 'react-navigation';
import nodejs from 'nodejs-mobile-react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {sha256} from 'react-native-sha256';
import { KeyboardAvoidingView } from 'react-native';
import SettingScreen from './screens/SettingScreen'
import HomeScreen from './screens/HomeScreen'


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
	  sha256(csvData[0]).then( hash => {
		  csvData[0] = hash
		  console.warn(csvData[0]);
		})
		sha256(csvData[4]).then( hash => {
		  csvData[4] = hash
		  console.warn(csvData[4]);
		})
	  //console.warn("Directory: ", path);
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

					if(data.includes(csvData[0]))
					{
						alert('Duplicate Warning!' + '\n' + 'Guest Already Entered The Event',)

						//console.warn(csvData[0], " Is already in the file");
					}
					else
					{

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



    }
    render() {
        return (


					<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>

							  <View style={{flex: 1}}>
                <View style={{flex: 2, backgroundColor: 'black',fontFamily:'Optima' }} />
                <Text style={styles.welcome}>EManage</Text>
                <Text style={styles.instructions}>Please Enter the Following Data</Text>





                <TextInput
                style={{height: 40, width: 100, borderColor: 'black', borderWidth: 2}}
                style={{height: 60, borderColor: 'black', borderWidth: 2 , textAlign: 'center',fontSize: 20,fontWeight: 'bold'}}
                onChangeText={(licNum) => this.setState({licNum})}
                value={this.state.licNum}
                placeholder = "License Number"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'black', borderWidth: 2}}
                style={{height: 60, borderColor: 'black', borderWidth: 2, textAlign: 'center',fontSize: 20,fontWeight: 'bold'}}
                onChangeText={(dob) => this.setState({dob})}
                value={this.state.dob}
                placeholder = "Date of Birth"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'black', borderWidth: 2}}
                style={{height: 60, width:1000, borderColor: 'black', borderWidth: 2, textAlign: 'center',fontSize: 20,fontWeight: 'bold'}}
                onChangeText={(fName) => this.setState({fName})}
                value={this.state.fName}
                placeholder = "First Name"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'black', borderWidth: 2}}
                style={{height: 60, borderColor: 'black', borderWidth: 2, textAlign: 'center',fontSize: 20,fontWeight: 'bold'}}
                onChangeText={(lName) => this.setState({lName})}
                value={this.state.lName}
                placeholder = "Last Name"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'black', borderWidth: 2}}
                style={{height: 60, borderColor: 'black', borderWidth: 2, textAlign: 'center',fontSize: 20,fontWeight: 'bold'}}
                onChangeText={(address) => this.setState({address})}
                value={this.state.address}
                placeholder = "Address"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'black', borderWidth: 2}}
                style={{height: 60, borderColor: 'black', borderWidth: 2, textAlign: 'center',fontSize: 20,fontWeight: 'bold'}}
                onChangeText={(town) => this.setState({town})}
                value={this.state.town}
                placeholder = "Town"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'black', borderWidth: 2}}
                style={{height: 60, borderColor: 'black', borderWidth: 2, textAlign: 'center',fontSize: 20,fontWeight: 'bold'}}
                onChangeText={(st8) => this.setState({st8})}
                value={this.state.st8}
                placeholder = "State"
                />

                <TextInput
                style={{height: 40, width: 100, borderColor: 'black', borderWidth: 2}}
                style={{height: 60, borderColor: 'black', borderWidth: 2, textAlign: 'center',fontSize: 20,fontWeight: 'bold'}}
                onChangeText={(gndr) => this.setState({gndr})}
                value={this.state.gndr}
                placeholder = "Gender"
                />

								<View style={{ backgroundColor: '#1D7AE7',borderRadius: 3,padding: 10}} >
										<Button onPress ={this.onPressEnterData.bind(this)}
            				title="Submit"
            				color='#1D7AE7'
										>
            				</Button>
									</View>
			  	<View style={{ backgroundColor: '#D0071F',borderRadius: 3,padding: 10}} >
						<Button onPress={() => nodejs.channel.send('A message!')}
             title="Message Node"
						 color="#D0071F"
						>
						</Button>
						</View>
                <View style={{flex: 2, backgroundColor: 'black'}} />



                </View>
							  </KeyboardAvoidingView>

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
		    fontSize: 30,
		    textAlign: 'center',
		    margin: 10,
		  },
		  instructions: {
		    textAlign: 'center',
		    color: '#333333',
		    marginBottom: 5,
				fontSize: 17
		  },
		  license: {
		    height: 40,
		    width: 100,
		    borderColor: 'black',
		    borderWidth: 2
		 },

		});


		//needed since we are not using create-react-native-app
		AppRegistry.registerComponent('Test', () => UselessTextInput);
