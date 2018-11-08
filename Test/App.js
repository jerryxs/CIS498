/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {
    Component,
    Document,
} from 'react';

import {
    AppRegistry,
    Button,
    TextInput,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

import { RNCamera } from 'react-native-camera';

import {
    createStackNavigator,
    StackActions,
    NavigationActions
} from 'react-navigation';

type Props = {};
class App extends Component<Props> {
    
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

    onPressEnterData(){
        // Idea: when the submit button is pressed... then make the array
        // for the csv + continue tutorial functions...
        var csvData = [{
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
                       }];
        
        // just makes a warning pop up with the data entered in the text boxes
        console.warn(csvData);
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
                
                <Button
                title="Open Camera"
                onPress = {() => {
                this.props.navigation.dispatch(StackActions.reset({
                      index: 0,
                      actions: [
                                NavigationActions.navigate({ routeName: 'Camera'})
                                ],
                            }))
                }}
                color='steelblue'
                />
                
                <View style={{flex: 2, backgroundColor: 'skyblue'}} />
                <View style={{flex: 3, backgroundColor: 'steelblue'}} />

                </View>
                
                );
    }
    
}

class cameraScreen extends React.Component {
    render() {
        return(
               
               < View style={{flex: 2, backgroundColor: 'skyblue'}} >
               
               <RNCamera
               ref={ref => {
               this.camera = ref;
               }}
               style = {styles.preview}
               type={RNCamera.Constants.Type.back}
               flashMode={RNCamera.Constants.FlashMode.on}
               permissionDialogTitle={'Permission to use camera'}
               permissionDialogMessage={'We need your permission to use your camera phone'}
               onGoogleVisionBarcodesDetected={({ barcodes }) => {
               console.log(barcodes)
               }}
               />
               
               <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
               <TouchableOpacity
               onPress={this.takePicture.bind(this)}
               style = {styles.capture}
               >
               <Text style={{fontSize: 14}}> SNAP </Text>
               </TouchableOpacity>
               </View>
               
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
    takePicture = async function(camera) {
        try{
        const options = { quality: 0.5, base64: true };
        const data = await camera.takePictureAsync(options);
        //  eslint-disable-next-line
        console.log(data.uri);
        } catch(e) {
            console.log(e)
        }
    }
}

export default createStackNavigator({
            Camera: {
            screen: cameraScreen,
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
        license: {
         height: 40,
         width: 100,
         borderColor: 'gray',
         borderWidth: 2
        },
        preview: {
         flex: 1,
         justifyContent: 'flex-end',
         alignItems: 'center',
        },
        capture: {
         flex: 0,
         backgroundColor: '#fff',
         borderRadius: 5,
         padding: 15,
         paddingHorizontal: 20,
         alignSelf: 'center',
         margin: 20,
        }
    });

//needed since we are not using create-react-native-app
AppRegistry.registerComponent('Test', () => UselessTextInput);
