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

    this.socket = io("http://134.88.133.46:8000"); // connects to the local server
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
    //Need to set up new test... will only be size of max set above

    var num = 1;
    var temp = 10000000;
    console.log("starting...");
    var start = new Date();

    setInterval(() => {
      for (num; num < 50; num++) {
        var testData = {
          licNum: temp,
          dob: "10/25/1996",
          fName: "Tester",
          lName: "Smith",
          address: "123 Street St",
          town: "Testville",
          st8: "MA",
          gndr: "?"
        };
        sha256(testData.licNum)
          .then(hash => {
            testData.licNum = hash;
            return testData;
          })
          .then(testData => {
            sha256(testData.address).then(hash => {
              testData.address = hash;
            });
            return testData;
          })
          .then(testData => {
            return storage.save({
              // dynamic key
              key: testData.licNum, // Note: Do not use underscore("_") in key!
              data: testData,

              // if expires not specified, the defaultExpires will be applied instead.
              // if set to null, then it will never expire.
              expires: 1000 * 3600
            });
          });
        temp = temp + 1;
      }
    }, 1000);
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

            this.setState({
              licNum: "",
              dob: "",
              fName: "",
              lName: "",
              address: "",
              town: "",
              st8: "",
              gndr: ""
            });

            break;
          case "ExpiredError":
            // TODO
            break;
        }
      });

    // Resets the input boxes to empty after the submission
    // Taken out right now for test demonstration
    /*this.setState({
      licNum: "",
      dob: "",
      fName: "",
      lName: "",
      address: "",
      town: "",
      st8: "",
      gndr: ""
    });*/
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.container} />
          <View style={{ flex: 1, backgroundColor: "skyblue" }} />

          <View style={{ flex: 1, backgroundColor: "steelblue" }} />
          <Text style={styles.welcome}>EManage</Text>
          <Text style={styles.instructions}>
            Please Enter the Following Data
          </Text>

          <TextInput
            style={styles.textBox}
            onChangeText={licNum => this.setState({ licNum })}
            value={this.state.licNum}
            placeholder="License Number"
            returnKeyType="next"
            onSubmitEditing={() => {
              this.dateInput.focus();
            }}
            placeholderTextColor="gray"
          />

          <TextInput
            style={styles.textBox}
            onChangeText={dob => this.setState({ dob })}
            value={this.state.dob}
            returnKeyType="next"
            ref={input => (this.dateInput = input)}
            onSubmitEditing={() => {
              this.firstNameInput.focus();
            }}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="gray"
          />

          <TextInput
            style={styles.textBox}
            onChangeText={fName => this.setState({ fName })}
            value={this.state.fName}
            returnKeyType="next"
            ref={input => (this.firstNameInput = input)}
            onSubmitEditing={() => {
              this.lastNameInput.focus();
            }}
            placeholder="First Name"
            placeholderTextColor="gray"
          />

          <TextInput
            style={styles.textBox}
            onChangeText={lName => this.setState({ lName })}
            value={this.state.lName}
            returnKeyType="next"
            ref={input => (this.lastNameInput = input)}
            onSubmitEditing={() => {
              this.addressInput.focus();
            }}
            placeholder="Last Name"
            placeholderTextColor="gray"
          />

          <TextInput
            style={styles.textBox}
            onChangeText={address => this.setState({ address })}
            value={this.state.address}
            returnKeyType="next"
            ref={input => (this.addressInput = input)}
            onSubmitEditing={() => {
              this.townInput.focus();
            }}
            placeholder="Address"
            placeholderTextColor="gray"
          />

          <TextInput
            style={styles.textBox}
            onChangeText={town => this.setState({ town })}
            value={this.state.town}
            returnKeyType="next"
            ref={input => (this.townInput = input)}
            onSubmitEditing={() => {
              this.st8Input.focus();
            }}
            placeholder="Town"
            placeholderTextColor="gray"
          />

          <TextInput
            style={styles.textBox}
            onChangeText={st8 => this.setState({ st8 })}
            value={this.state.st8}
            returnKeyType="next"
            ref={input => (this.st8Input = input)}
            onSubmitEditing={() => {
              this.genderInput.focus();
            }}
            placeholder="State"
            placeholderTextColor="gray"
          />

          <TextInput
            style={styles.textBox}
            onChangeText={gndr => this.setState({ gndr })}
            value={this.state.gndr}
            returnKeyType="go"
            ref={input => (this.genderInput = input)}
            placeholder="Gender"
            placeholderTextColor="gray"
          />
          <View
            style={[{ width: "59%", margin: 10, backgroundColor: "purple" }]}
          >
            <Button
              onPress={this.onPressEnterData.bind(this)}
              title="Submit"
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
    margin: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  welcome: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  textBox: {
    height: 40,
    width: "59%",
    borderColor: "gray",
    borderWidth: 2,
    textAlign: "center"
  }
});
//needed since we are not using create-react-native-app
AppRegistry.registerComponent("Test", () => UselessTextInput);
