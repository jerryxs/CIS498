import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';

export default class App extends React.Component {
	var fs = require('fs')
	constructor(){
		super();
		this.state = {
			licNum: 'License Number',
			fName: 'First Name:',
			lName: 'Last Name:',
			street: 'Address:',
			sttwn: 'Town/State:',
			gndr: 'Sex:'
		};
	}
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

	onChangeStreet(value){
			this.setState({
				street:value
			});
	}
	onChangeStTwn(value){
			this.setState({
				sttwn:value
			});
	}
	onChangeGndr(value){
			this.setState({
				gndr:value
			});
	}
	onPressEnterData(){
		var data = JSON.stringify(state, null, 2)
		fs.writeFile('Data.json', data)
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
		// Address: House Number, Street
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.street }
			 onChangeText={(value) => this.onChangeStreet(value)}

		/>
		// Town, State
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.sttwn }
			 onChangeText={(value) => this.onChangeStTwn(value)}

		/>
		// Gender
		<TextInput
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.gndr }
			 onChangeText={(value) => this.onChangeGndr(value)}

		/>
		<Button
			onPress={onPressEnterData}
			title="Submit"
			color='gray'
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
