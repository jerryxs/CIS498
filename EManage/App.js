import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default class App extends React.Component {
	constructor(props){
		super(props);
		this.state = { text: 'Placeholder' };
	}
  render() {
    return (
      <View style={styles.container}>
		<TextInput
			 style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => this.setState({text})}
        value={this.state.text}
		
		/>
			
		
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
