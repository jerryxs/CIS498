/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, Button, TextInput, Platform, StyleSheet, Text, View} from 'react-native';



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
	
	exportData(){
		
	}

    onPressEnterData(){
	  // Idea: when the submit button is pressed... then make the array
	  // for the csv + continue tutorial functions...
	  var csvData = [
	  {
		// May not need to add the strings each time.
		// Probably makes more sense to append to the first row of the csv file the lables
		'LicenseNum' : this.state.licNum,
		'DateOfBirth' : this.state.dob,
		'FirstName' : this.state.fName,
		'LastName' : this.state.lName,
		'Address' : this.state.address,
		'Town' : this.state.town,
		'State' : this.state.st8,
		'Gender' : this.state.gndr
	  }
	  
	  ];
	  // just makes a warning pop up with the data entered in the text boxes
	  console.warn(csvData);
	  
	  var csvRow = [];
	  var A = [['LicenseNum' , 'DateOfBirth', 'FirstName', 'LastName', 'Address', 'Town', 'State', 'Gender']];
	  
	  for(var item = 0; item < csvData.length; item++)
	  {
		A.push([item, csvData[item].LicenseNum, csvData[item].DateOfBirth,csvData[item].FirstName, csvData[item].LastName, csvData[item].Address, csvData[item].Town, csvData[item].State, csvData[item].Gender]);
	  }
	  
	  for(var i = 0; i < A.length; ++i)
	  {
		  csvRow.push(A[i].join(","))
	  }
	  // first row of the CSV
	  var csvString = csvRow.join("%0A");
	  // create anchor
	  var a = document.createElement("a");
	  a.href = 'data:attachment/csv,' + csvString;
	  a.target = "_Blank";
	  a.download = "data.csv";
	  document.body.appendChild(a);
	  a.click();
	  
	  
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
