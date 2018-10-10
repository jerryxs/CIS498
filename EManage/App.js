import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default class App extends React.Component {
	constructor(){
		super();
		this.state = { 
			fName: 'First Name:',
			lName: 'Last Name:',
			street: 'Address:',
			sttwn: 'Town/State:',
			gndr: 'Sex:'
		};
	}
  render() {
    return (
      <View style={styles.container}>
	  // First Name
	  <Text style = {{textAlign: 'center'}}>
		TEST
	  </Text>
		<TextInput 
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.fName }
		
		/>
		// LastName
		<TextInput 
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.lName }
		
		/>
		// Address: House Number, Street
		<TextInput 
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.street }
		
		/>
		// Town, State
		<TextInput 
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.sttwn }
		
		/>
		// Gender
		<TextInput 
			 style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 2}}
			 placeHolder = "Enter Text"
			 value = { this.state.gndr }
		
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

