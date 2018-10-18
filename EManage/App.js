/*
Should we be doing all this in our main file or should we be sending this out
to different files and functions so that it looks a lot cleaner and a lot more
professional?
*/


import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, wait } from 'react-native';

export default class App extends React.Component {



	//state of assets
	constructor(){
		super();
		this.state = {
			licNum: 'License Number',
			fName: 'First Name:',
			lName: 'Last Name:',
			dob:	'Date of Birth',
			street: 'Address:',
			town: 'Town',
			st8: 'State:',
			gndr: 'Sex:'
		};
	}
	//putting input values into the state
	onChangeLicNum(value){
			this.setState({
				licNum:value
			});
	}

	onChangeFName(value){
			this.setState({
				fName:value
			});
	}
	onChangeLName(value){
			this.setState({
				lName:value
			});
	}

	onChangeDOB(value){
			this.setState({
				dob:value
			});
	}

	onChangeStreet(value){
			this.setState({
				street:value
			});
	}
	onChangeTown(value){
			this.setState({
				town:value
			});
	}
	onChangeSt8(value){
			this.setState({
				st8:value
			});
	}
	onChangeGndr(value){
			this.setState({
				gndr:value
			});
	}
	//sending it to the JSON file
	//this should check to make sure that all fields are filled
	//we also need to check for duplicates before Sending the info to the JSON file
	onPressEnterData(){
//alerts to see if info being saved to state
		alert(this.state.gndr)
		alert(this.state.st8)
		alert(this.state.town)
		alert(this.state.street)
		alert(this.state.dob)
		alert(this.state.lName)
		alert(this.state.fName)
		alert(this.state.licNum)


		/*fetch('http://127.0.0.1:82/EManage/assets/Data.json',{
			method: 'POST',
			header: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				firstParam: this.state.fName
			}),
		});*/

	}

  render() {
    return (
      <View style={styles.container}>

	  <Text style = {{textAlign: 'center'}}>
		TEST
	  </Text>
		//license number
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.licNum }
			 onChangeText={(value) => this.onChangeLicNum(value)}

		/>
		// First Name
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.fName }
			 onChangeText={(value) => this.onChangeFName(value)}

		/>
		// LastName
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.lName }
			 onChangeText={(value) => this.onChangeLName(value)}

		/>
		// Date of Birth
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.dob }
			 onChangeText={(value) => this.onChangeDOB(value)}

		/>
		// Address: House Number, Street
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.street }
			 onChangeText={(value) => this.onChangeStreet(value)}

		/>
		// Town
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.town }
			 onChangeText={(value) => this.onChangeTown(value)}

		/>
		// State
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.st8 }
			 onChangeText={(value) => this.onChangeSt8(value)}

		/>
		// Gender
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.gndr }
			 onChangeText={(value) => this.onChangeGndr(value)}

		/>
		//Button to submit data to JSON file
		<Button onPress ={this.onPressEnterData.bind(this)}
			title="Submit"
			color='purple'
		/>

      </View>
    );
  }
}
// We used create-react-native app so we dont need this but Im going to leave it for now just in case XD
//AppRegistry.registerComponent( 'App', () => App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
