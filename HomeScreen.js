
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

import {
    RNCamera
} from 'react-native-camera';

import {
    createStackNavigator
} from 'react-navigation';

const Cam = createStackNavigator({
    //Home: { screen: HomeScreen},
    Profile: { screen: HomeScreen}
});

type Props = {};
export default class HomeScreen extends React.Component<Props> {
    
    static navigationOptions = {
     title: 'Welcome'
     };
    render() {
        const { navigate } = this.props.navigation;
        return (
                <Button
                title = "Go to Camera"
                onPress = {() =>
                navigate('Profile', { name: 'Jane' })
                }
                />
                );
        <View>
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
        </View>
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
