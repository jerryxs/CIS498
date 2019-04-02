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
  View,
  Dimensions,
  PermissionsAndroid,
  requestMultiple
} from "react-native";
import { sha256 } from "react-native-sha256";
import io from "socket.io-client/dist/socket.io";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Storage from "react-native-storage";
import { Kaede } from "react-native-textinput-effects";
import Camera from "react-native-camera";
import { isAbsolute } from "path";
//import DeviceInfo from 'react-native-device-info';

//PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
);

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

var bannedGuestObj = [];

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

    this.socket = io("http://134.88.132.173:8000"); // connects to the local server
    this.socket.on("noBannedList", () => {
      alert("No Banned List detected!");
    });
    this.socket.on("gotBannedList", listData => {
      var bannedList = listData.jsonObj;
      //console.warn(bannedList.length);
      //console.warn(bannedList);
      bannedList.forEach(bannedGuest => {
        bannedGuestObj.push(bannedGuest);
      });
      console.warn(bannedGuestObj);

      //console.warn("Banned Guest Obj" + bannedGuestObj)
    });

    this.socket.on("needGuestList", data => {
      var guestList = data.jsonObj;
      //console.warn(guestList);

      guestList.forEach(guest => {
        storage.save({
          // dynamic key
          key: guest.licNum, // Note: Do not use underscore("_") in key!
          data: guest,

          // if expires not specified, the defaultExpires will be applied instead.
          // if set to null, then it will never expire.
          expires: 1000 * 3600
        });
      });

      // console.warn(storage);
    });

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
  }

  onPressTest2() {
    var testData = {
      licNum: "1000000",
      dob: "12/04/1995",
      fName: "Bhars",
      lName: "Corcoran",
      address: "123 Test st",
      town: "Testville",
      st8: "Testachussets",
      gndr: "T"
    };

    for (var x = 0; x < 50; x++) {
      //testData.licNum = "S1000000";
      var licNum = parseInt(testData.licNum);
      licNum++;

      //console.warn(licNum);

      testData = {
        licNum: licNum.toString(),
        dob: "12/04/1995",
        fName: "Bhars",
        lName: "Corcoran",
        address: "123 Test st",
        town: "Testville",
        st8: "Testachussets",
        gndr: "T"
      };

      console.warn(testData);
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
          arrayObj.push(testData);
        });
    }
    console.warn(arrayObj);
  }

  onPressTest() {
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

    sha256(dataStored.licNum).then(hash => {
      dataStored.licNum = hash;

      bannedGuestObj.forEach(bannedGuest => {
        if (Object.values(bannedGuest).indexOf(dataStored.licNum) > -1) {
          alert("Banned Error");
        }
      });
    });

    //console.warn(bannedGuestObj);
  }
  //Function for submit button
  onPressEnterData() {
    //When submit is pressed, an array is populated with the new state of each input box
    var bannedFlag = false;
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
        bannedGuestObj.forEach(bannedGuest => {
          if (Object.values(bannedGuest).indexOf(dataStored.licNum) > -1) {
            bannedFlag = true;
          }
        });

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
        this.refs.scrollView.scrollTo({ y: 0 });
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
            if (bannedFlag) {
              showMessage({
                message: "Banned Warning",
                description: "Guest is Banned",
                duration: 3000,
                type: "info",
                backgroundColor: "black"
              });
            } else {
              const options = {};
              this.camera
                .capture({ metadata: options })
                .then(data => {
                  this.socket.emit("onPicTaken", {
                    image: true,
                    buffer: data.toString("base64")
                  });
                })
                .catch(error => {
                  console.log(error);
                });
              this.refs.scrollView.scrollTo({ y: 0 });

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
            }

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
      <ScrollView style={{ flex: 1 }} ref="scrollView">
        <View style={styles.container}>
          <Text style={styles.welcome}>EManage</Text>
          <Text style={styles.instructions}>
            Please Enter the Following Data
          </Text>
        </View>
        <View style={[styles.card1, { backgroundColor: "#F9F7F6" }]}>
          <Kaede
            style={styles.input}
            label={"License Number"}
            onChangeText={licNum => this.setState({ licNum })}
            value={this.state.licNum}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.dateInput.focus();
            }}
            labelStyle={{
              color: "white",
              backgroundColor: "#8e202f"
            }}
            inputStyle={{
              color: "white",
              backgroundColor: "#02004f"
            }}
          />
          <Kaede
            style={styles.input}
            label={"MM/DD/YYYY"}
            onChangeText={dob => this.setState({ dob })}
            value={this.state.dob}
            returnKeyType="next"
            blurOnSubmit={false}
            ref={input => (this.dateInput = input)}
            onSubmitEditing={() => {
              this.firstNameInput.focus();
            }}
            labelStyle={{
              color: "white",
              backgroundColor: "#8e202f"
            }}
            inputStyle={{
              color: "white",
              backgroundColor: "#02004f"
            }}
          />
          <Kaede
            style={styles.input}
            label={"First Name"}
            onChangeText={fName => this.setState({ fName })}
            value={this.state.fName}
            returnKeyType="next"
            blurOnSubmit={false}
            ref={input => (this.firstNameInput = input)}
            onSubmitEditing={() => {
              this.lastNameInput.focus();
            }}
            labelStyle={{
              color: "white",
              backgroundColor: "#8e202f"
            }}
            inputStyle={{
              color: "white",
              backgroundColor: "#02004f"
            }}
          />
          <Kaede
            style={styles.input}
            label={"Last Name"}
            onChangeText={lName => this.setState({ lName })}
            value={this.state.lName}
            returnKeyType="next"
            blurOnSubmit={false}
            ref={input => (this.lastNameInput = input)}
            onSubmitEditing={() => {
              this.addressInput.focus();
            }}
            labelStyle={{
              color: "white",
              backgroundColor: "#8e202f"
            }}
            inputStyle={{
              color: "white",
              backgroundColor: "#02004f"
            }}
          />
          <Kaede
            style={styles.input}
            label={"Address"}
            onChangeText={address => this.setState({ address })}
            value={this.state.address}
            returnKeyType="next"
            blurOnSubmit={false}
            ref={input => (this.addressInput = input)}
            onSubmitEditing={() => {
              this.townInput.focus();
            }}
            labelStyle={{
              color: "white",
              backgroundColor: "#8e202f"
            }}
            inputStyle={{
              color: "white",
              backgroundColor: "#02004f"
            }}
          />
          <Kaede
            style={styles.input}
            label={"Town"}
            onChangeText={town => this.setState({ town })}
            value={this.state.town}
            returnKeyType="next"
            blurOnSubmit={false}
            ref={input => (this.townInput = input)}
            onSubmitEditing={() => {
              this.st8Input.focus();
            }}
            labelStyle={{
              color: "white",
              backgroundColor: "#8e202f"
            }}
            inputStyle={{
              color: "white",
              backgroundColor: "#02004f"
            }}
          />
          <Kaede
            style={styles.input}
            label={"State"}
            onChangeText={st8 => this.setState({ st8 })}
            value={this.state.st8}
            returnKeyType="next"
            blurOnSubmit={false}
            ref={input => (this.st8Input = input)}
            onSubmitEditing={() => {
              this.genderInput.focus();
            }}
            labelStyle={{
              color: "white",
              backgroundColor: "#8e202f"
            }}
            inputStyle={{
              color: "white",
              backgroundColor: "#02004f"
            }}
          />
          <Kaede
            style={styles.input}
            label={"Gender"}
            onChangeText={gndr => this.setState({ gndr })}
            value={this.state.gndr}
            returnKeyType="go"
            blurOnSubmit={true}
            ref={input => (this.genderInput = input)}
            labelStyle={{
              color: "white",
              backgroundColor: "#8e202f"
            }}
            inputStyle={{
              color: "white",
              backgroundColor: "#02004f"
            }}
          />

          <View
            style={[
              {
                marginTop: 2,
                marginBottom: 2
              }
            ]}
          >
            <Button
              onPress={this.onPressEnterData.bind(this)}
              title="Submit"
              color="#2aaf37"
            />
          </View>
          <Camera
            ref={cam => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
            permissionDialogTitle={"Permission to use camera"}
            permissionDialogMessage={
              "We need your permission to use your camera phone"
            }
            onPress={this.onPressEnterData.bind(this)}
          />
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
    fontSize: 25,
    color: "black",
    textAlign: "center",
    margin: 10
  },
  instructions: {
    fontSize: 15,
    textAlign: "center",
    color: "#333333",
    marginBottom: 1
  },
  preview: {
    flex: 1,
    marginTop: 25,
    justifyContent: "flex-end",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width
  },
  card1: {
    paddingVertical: 8
  },
  input: {
    marginTop: 2,
    textAlign: "center"
  }
});
//needed since we are not using create-react-native-app
AppRegistry.registerComponent("Test", () => UselessTextInput);
