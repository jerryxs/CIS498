import React, { Component } from "react";
import {
  AppRegistry,
  Button,
  TextInput,
  Platform,
  StyleSheet,
  AsyncStorage,
  Text,
  ScrollView,
  InteractionManager,
  View,
  PermissionsAndroid
} from "react-native";
import { sha256 } from "react-native-sha256";
import io from "socket.io-client/dist/socket.io";
import FlashMessage, {
  showMessage,
  hideMessage
} from "react-native-flash-message";
import Storage from "react-native-storage";
//import DeviceInfo from 'react-native-device-info';

//console.disableYellowBox = true;

const storage = new Storage({
  // maximum capacity, default 1000
  size: 500000,

  // Use AsyncStorage for RN apps, or window.localStorage for web apps.
  // If storageBackend is not set, data will be lost after reload.
  storageBackend: AsyncStorage, // for web: window.localStorage

  // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire.
  defaultExpires: 1000 * 3600 * 24,

  // cache data in the memory. default is true.
  enableCache: true,

  // if data was not found in storage or expired data was found,
  // the corresponding sync method will be invoked returning
  // the latest data.
  sync: {}
});

type Props = {};
export default class App extends Component<Props> {
  //Add states for input boxes
  constructor(props) {
    super(props);

    this.socket = io("http://172.18.1.199:8000"); // connects to the local server
    // Use this area to listen to signals from server and do something...
    this.socket.on("receiveUserData", data => {
      storage.save({
        // dynamic key
        key: data.data.dataStored.licNum, // Note: Do not use underscore("_") in key!
        data: data.data.dataStored,

        // if expires not specified, the defaultExpires will be applied instead.
        // if set to null, then it will never expire.
        expires: 1000 * 3600
      });

      alert("Guest Added To The Event List!");
    });

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

  onPressTest() {
    var ran;
    var arrayObj = [];
    const testData = {
      licNum: 'S1000000',
      dob: '12/04/1995',
      fName: 'Bhars',
      lName: 'Corcoran',
      address: '123 Test st',
      town: 'Testville',
      st8: 'Testachussets',
      gndr: 'T'
    };

    for(var x = 0; x <50; x++){
      testData.licNum = 'S1000000';
      //ran = (Math.floor(Math.random() * 5000)+1);
        testData.licNum = testData.licNum + x;

        sha256(testData.licNum)
          .then(hash => {
            testData.licNum = hash;
          }
        arrayObj[] = testData;
        console.warn(arrayObj);
    }
    //Need to set up new test... will only be size of max set above


  }
  //Function for submit button
  onPressEnterData() {
    //When submit is pressed, an array is populated with the new state of each input box

    const dataStored = {
      licNum: this.state.licNum,
      dob: this.state.dob,
      fName: this.state.fName,
      lName: this.state.lName,
      address: this.state.address,
      town: this.state.town,
      st8: this.state.st8,
      gndr: this.state.gndr
    };

    sha256(dataStored.licNum)
      .then(hash => {
        dataStored.licNum = hash;

        return dataStored;
      })
      .then(dataStored => {
        sha256(dataStored.address).then(hash => {
          dataStored.address = hash;
        });
        return dataStored;
      })
      .then(dataStored => {
        return storage.load({
          // same dynamic key
          key: dataStored.licNum,

          // autoSync (default: true) means if data is not found or has expired,
          // then invoke the corresponding sync method
          autoSync: true,

          // syncInBackground (default: true) means if data expired,
          // return the outdated data first while invoking the sync method.
          // If syncInBackground is set to false, and there is expired data,
          // it will wait for the new data and return only after the sync completed.
          // (This, of course, is slower)
          syncInBackground: true,

          // you can pass extra params to the sync method
          syncParams: {
            extraFetchOptions: {
              // none
            },
            someFlag: true
          }
        });
      })
      .then(ret => {
        // found data go to then()
        showMessage({
          message: "Duplicate Warning!",
          description: "Guest Has Already Entered The Event",
          duration: 3000,
          type: "info",
          backgroundColor: "red"
        });
      })
      .catch(err => {
        // any exception including data not found
        // goes to catch()
        //console.warn(err.message);
        switch (err.name) {
          case "NotFoundError":
            this.socket.emit("onPressEnterData", { dataStored });

            storage.save({
              // dynamic key
              key: dataStored.licNum, // Note: Do not use underscore("_") in key!
              data: dataStored,

              // if expires not specified, the defaultExpires will be applied instead.
              // if set to null, then it will never expire.
              expires: 1000 * 3600
            });

            var today = new Date();
            var birthDate = new Date(this.state.dob);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            if (age >= 21) {
              showMessage({
                message: "21+ Guest Added to Event!",
                type: "info",
                duration: 3000,
                backgroundColor: "green"
              });
            } else {
              showMessage({
                message: "Under 21 Guest Added to the Event!",
                type: "info",
                duration: 3000,
                backgroundColor: "blue"
              });
            }

            break;
          case "ExpiredError":
            // TODO
            break;
        }
      });

    // Resets the input boxes to empty after the submission
    // Taken out right now for test demonstration
    /*	this.setState({licNum: "",
										dob: "",
										fName: "",
										lName: "",
										address: "",
										town: "",
										st8: "",
										gndr: ""
											})*/
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            margin: 10,
            alignItems: "center"
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "powderblue",
              margin: 10,
              justifyContent: "center",
              alignItems: "center"
            }}
          />
          <View style={{ flex: 1, backgroundColor: "skyblue" }} />

          <View style={{ flex: 1, backgroundColor: "steelblue" }} />
          <Text style={styles.welcome}>EManage</Text>
          <Text style={styles.instructions}>
            Please Enter the Following Data
          </Text>

          <TextInput
            style={{
              height: 40,
              width: 100,
              margin: 10,
              borderColor: "gray",
              borderWidth: 2
            }}
            style={{
              height: 40,
              width: "59%",
              borderColor: "gray",
              borderWidth: 2,
              textAlign: "center"
            }}
            onChangeText={licNum => this.setState({ licNum })}
            value={this.state.licNum}
            placeholder="License Number"
            returnKeyType="next"
            onSubmitEditing={() => {
              this.dateInput.focus();
            }}
            placeholderTextColor="black"
          />

          <TextInput
            style={{
              height: 40,
              width: 100,
              margin: 10,
              borderColor: "gray",
              borderWidth: 2
            }}
            style={{
              height: 40,
              width: "59%",
              borderColor: "gray",
              borderWidth: 2,
              textAlign: "center"
            }}
            onChangeText={dob => this.setState({ dob })}
            value={this.state.dob}
            returnKeyType="next"
            ref={input => (this.dateInput = input)}
            onSubmitEditing={() => {
              this.firstNameInput.focus();
            }}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="black"
          />

          <TextInput
            style={{
              height: 40,
              width: 100,
              margin: 10,
              borderColor: "gray",
              borderWidth: 2
            }}
            style={{
              height: 40,
              width: "59%",
              borderColor: "gray",
              borderWidth: 2,
              textAlign: "center"
            }}
            onChangeText={fName => this.setState({ fName })}
            value={this.state.fName}
            returnKeyType="next"
            ref={input => (this.firstNameInput = input)}
            onSubmitEditing={() => {
              this.lastNameInput.focus();
            }}
            placeholder="First Name"
            placeholderTextColor="black"
          />

          <TextInput
            style={{
              height: 40,
              width: 100,
              margin: 10,
              borderColor: "gray",
              borderWidth: 2
            }}
            style={{
              height: 40,
              width: "59%",
              borderColor: "gray",
              borderWidth: 2,
              textAlign: "center"
            }}
            onChangeText={lName => this.setState({ lName })}
            value={this.state.lName}
            returnKeyType="next"
            ref={input => (this.lastNameInput = input)}
            onSubmitEditing={() => {
              this.addressInput.focus();
            }}
            placeholder="Last Name"
            placeholderTextColor="black"
          />

          <TextInput
            style={{
              height: 40,
              width: 100,
              margin: 10,
              borderColor: "gray",
              borderWidth: 2
            }}
            style={{
              height: 40,
              width: "59%",
              borderColor: "gray",
              borderWidth: 2,
              textAlign: "center"
            }}
            onChangeText={address => this.setState({ address })}
            value={this.state.address}
            returnKeyType="next"
            ref={input => (this.addressInput = input)}
            onSubmitEditing={() => {
              this.townInput.focus();
            }}
            placeholder="Address"
            placeholderTextColor="black"
          />

          <TextInput
            style={{
              height: 40,
              width: 100,
              margin: 10,
              borderColor: "gray",
              borderWidth: 2
            }}
            style={{
              height: 40,
              width: "59%",
              borderColor: "gray",
              borderWidth: 2,
              textAlign: "center"
            }}
            onChangeText={town => this.setState({ town })}
            value={this.state.town}
            returnKeyType="next"
            ref={input => (this.townInput = input)}
            onSubmitEditing={() => {
              this.st8Input.focus();
            }}
            placeholder="Town"
            placeholderTextColor="black"
          />

          <TextInput
            style={{
              height: 40,
              width: 50,
              margin: 10,
              borderColor: "gray",
              borderWidth: 2
            }}
            style={{
              height: 40,
              width: "59%",
              borderColor: "gray",
              borderWidth: 2,
              textAlign: "center"
            }}
            onChangeText={st8 => this.setState({ st8 })}
            value={this.state.st8}
            returnKeyType="next"
            ref={input => (this.st8Input = input)}
            onSubmitEditing={() => {
              this.genderInput.focus();
            }}
            placeholder="State"
            placeholderTextColor="black"
          />

          <TextInput
            style={{
              height: 40,
              width: 100,
              margin: 10,
              borderColor: "gray",
              borderWidth: 2
            }}
            style={{
              height: 40,
              width: "59%",
              borderColor: "gray",
              borderWidth: 2,
              textAlign: "center"
            }}
            onChangeText={gndr => this.setState({ gndr })}
            value={this.state.gndr}
            returnKeyType="go"
            ref={input => (this.genderInput = input)}
            placeholder="Gender"
            placeholderTextColor="black"
          />
          <View
            style={[{ width: "59%", margin: 10, backgroundColor: "purple" }]}
          >
            <Button
              onPress={this.onPressEnterData.bind(this)}
              title="Submit"
              color="purple"
            />
            <Button
              onPress={this.onPressTest.bind(this)}
              title="Test"
              color="purple"
            />
          </View>
        </View>
        <FlashMessage position="top" />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
//needed since we are not using create-react-native-app
AppRegistry.registerComponent("Test", () => UselessTextInput);
