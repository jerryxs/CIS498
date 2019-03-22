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
  InteractionManager,
  PermissionsAndroid
} from "react-native";
import { sha256 } from "react-native-sha256";
import io from "socket.io-client/dist/socket.io";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Storage from "react-native-storage";
import { Kaede } from "react-native-textinput-effects";
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

const bannedListStorage = new Storage({
  // maximum capacity, default 1000
  size: 100000,

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

    this.socket = io("http://134.88.133.46:8000"); // connects to the local server
    this.socket.on("noBannedList", () => {
      console.warn("No Banned List detected!");
    });
    this.socket.on("gotBannedList", listData => {
      var bannedList = listData.bannedList;
      console.warn(bannedList.length);

      bannedList.forEach(bannedGuest => {
        console.warn(bannedGuest);
        sha256(bannedGuest.licNum)
          .then(hash => {
            bannedGuest.licNum = hash;

            return bannedGuest;
          })
          .then(bannedGuest => {
            sha256(bannedGuest.address).then(hash => {
              bannedGuest.address = hash;
            });
            return bannedGuest;
          })
          .then(bannedGuest => {
            return bannedListStorage.save({
              key: bannedGuest.licNum,
              //id: bannedGuest.licNum,
              data: bannedGuest,

              expires: 1000 * 3600 * 24
            });
          });
      });
    });

    this.socket.on("needGuestList", data => {
      var guestList = data.guestList;

      guestList.forEach(guest => {
        var info = guest.dataStored;
        console.warn(info);
        sha256(info.licNum)
          .then(hash => {
            info.licNum = hash;

            return info;
          })
          .then(info => {
            sha256(info.address).then(hash => {
              info.address = hash;
            });
            return info;
          })
          .then(info => {
            return storage.save({
              key: info.licNum,
              data: info,

              expires: 1000 * 3600
            });
          });
      });
      console.warn(storage);
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
    var arrayObj = [];
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
    const data = {
      licNum: this.state.licNum,
      dob: this.state.dob,
      fName: this.state.fName,
      lName: this.state.lName,
      address: this.state.address,
      town: this.state.town,
      st8: this.state.st8,
      gndr: this.state.gndr
    };

    sha256(data.licNum)
      .then(hash => {
        data.licNum = hash;

        return data;
      })
      .then(data => {
        sha256(data.address).then(hash => {
          data.address = hash;
        });
        return data;
      })
      .then(data => {
        return bannedListStorage
          .load({
            key: data.licNum,

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
            // see sync example below
            syncParams: {
              extraFetchOptions: {
                // blahblah
              },
              someFlag: true
            }
          })
          .then(ret => {
            // found data go to then()
            alert("guest is banned");
          })
          .catch(err => {
            // any exception including data not found
            // goes to catch()
            console.warn(err.message);
            switch (err.name) {
              case "NotFoundError":
                // TODO;
                break;
              case "ExpiredError":
                // TODO
                console.warn("here");
                break;
            }
          });
      });

    console.warn(bannedListStorage);
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
        return storage.load(
          {
            // same dynamic key
            key: dataStored.licNum
          }
            .then(data => {
              return bannedListStorage.load({
                key: data.licNum,

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
              alert("guest is banned");
            })
            .catch(err => {
              // any exception including data not found
              // goes to catch()
              console.warn(err.message);
              switch (err.name) {
                case "NotFoundError":
                  // TODO;
                  break;
                case "ExpiredError":
                  // TODO
                  console.warn("here");
                  break;
              }
            })
        );
      })
      .then(ret => {
        // found data go to then()
        showMessage({
          message: "Duplicate Warning!",
          description: "Guest Has Already Entered The Event",
          duration: 3000,
          type: "info",
          backgroundColor: "#8e202f"
        });
      })
      .catch(err => {
        // any exception including data not found
        // goes to catch()
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
                backgroundColor: "#2aaf37"
              });
            } else {
              showMessage({
                message: "Under 21 Guest Added to the Event!",
                type: "info",
                duration: 3000,
                backgroundColor: "#02004f"
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

    console.warn(storage);
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
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
                margin: 10
              }
            ]}
          >
            <Button
              onPress={this.onPressEnterData.bind(this)}
              title="Submit"
              color="#2aaf37"
            />
            <Button
              onPress={this.onPressTest.bind(this)}
              title="Test"
              color="purple"
            />
            <Button
              onPress={this.onPressTest2.bind(this)}
              title="Test2"
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
