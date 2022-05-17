import React, {useState, useEffect} from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useForm} from 'react-hook-form';
import {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const GraphScreen = ({route}) => {
  const navigation = useNavigation();
  const db = firestore();
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();
  const {Id, change} = route.params;
  const [switchData, setSwitchData] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [vis, setVis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voltage, setVoltage] = useState([0]);
  const [power, setPower] = useState([0]);
  const [time, setTime] = useState([0]);
  const [volt, setVolt] = useState(0);
  const [curr, setCurr] = useState(0);
  const [pow, setPow] = useState(0);
  const [running, setRunning] = useState(0);
  const [units, setUnits] = useState(0);
  const [live, setLive] = useState(0);
  const [Width, setWidth] = useState(Dimensions.get('window').width);
  let v = [1];
  let p = [1];
  let t = [1];

  useEffect(() => {
    db.collection('switches')
      .where('Id', '==', Id)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          let d = [];
          d.push(doc.data());
          setSwitchData(d);
          // console.log(doc.data());
        });
      })
      .catch(err => Alert.alert('Error', err.message));
  }, [Id, fetch, change]);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/${Id}/Live`)
      .on('value', snapshot => {
        if (snapshot.val() != null) {
          setLive(snapshot.val());
          console.log(live);
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/${Id}/Live`).off('value', onValueChange);
  }, [Id]);

  useEffect(() => {
    // console.log(Id);
    setVoltage([0]);
    const onValueChange = database()
      .ref(`/${Id}/Voltage`)
      .on('value', snapshot => {
        // console.log('User data: ', snapshot.val());
        v = snapshot.val();
        if (v != null) {
          if (v.length > 10) {
            let newV = v.slice(-10);
            setVoltage(newV);
          } else {
            setVoltage(v);
          }
        }
        // console.log(voltage);
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/${Id}/Voltage`).off('value', onValueChange);
  }, [Id]);

  useEffect(() => {
    // console.log(Id);
    setPower([0]);
    const onValueChange = database()
      .ref(`/${Id}/Power`)
      .on('value', snapshot => {
        // console.log('User data: ', snapshot.val());
        p = snapshot.val();
        if (p != null) {
          if (p.length > 10) {
            let newP = p.slice(-10);
            // console.log('newP', newP);
            setPower(newP);
          } else {
            setPower(p);
          }
        }
      });
    // console.log(power);

    // Stop listening for updates when no longer required
    return () => database().ref(`/${Id}/Power`).off('value', onValueChange);
  }, [Id]);

  useEffect(() => {
    // console.log(Id);
    setTime([0]);
    const onValueChange = database()
      .ref(`/${Id}/Time`)
      .on('value', snapshot => {
        // console.log('User data: ', snapshot.val());
        t = snapshot.val();
        if (t != null) {
          if (t.length > 10) {
            let newT = t.slice(-10);
            setTime(newT);
          } else {
            setTime(t);
          }
        }
        // console.log(time);
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/${Id}/Time`).off('value', onValueChange);
  }, [Id]);

  useEffect(() => {
    // setVolt('0.0');
    const onValueChange = database()
      .ref(`/${Id}/voltage`)
      .on('value', snapshot => {
        if (snapshot.val() != null) {
          // if (live == 1) {

          // } else {
          //   setVolt(0);
          // }
          setVolt(snapshot.val().toFixed(2));
        } else {
          setVolt(0);
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/${Id}/voltage`).off('value', onValueChange);
  }, [Id]);

  useEffect(() => {
    // setCurr('0.0');
    const onValueChange = database()
      .ref(`/${Id}/current`)
      .on('value', snapshot => {
        if (snapshot.val() != null) {
          // if (live == 1) {

          // } else {
          //   setCurr(0);
          // }
          setCurr(snapshot.val().toFixed(2));
        } else {
          setCurr(0);
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/${Id}/current`).off('value', onValueChange);
  }, [Id]);

  useEffect(() => {
    setPow('0.0');
    const onValueChange = database()
      .ref(`/${Id}/power`)
      .on('value', snapshot => {
        if (snapshot.val() != null) {
          // if (live == 1) {

          // } else {
          //   setPow(0);
          // }
          setPow(snapshot.val().toFixed(2));
        } else {
          setPow(0);
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/${Id}/power`).off('value', onValueChange);
  }, [Id]);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/${Id}/time`)
      .on('value', snapshot => {
        if (snapshot.val() != null) {
          // if (live == 1) {

          // } else {
          //   setRunning('0.0');
          // }
          setRunning(
            (snapshot.val() / 720).toFixed(0).toString() +
              '.' +
              (snapshot.val() / 12).toFixed(0).toString(),
          );
        } else {
          setRunning('0.0');
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/${Id}/time`).off('value', onValueChange);
  }, [Id]);

  useEffect(() => {
    // setUnits('0.0');
    const onValueChange = database()
      .ref(`/${Id}/units`)
      .on('value', snapshot => {
        if (snapshot.val() != null) {
          // if (live == 1) {

          // } else {
          //   setUnits(0);
          // }
          setUnits(snapshot.val().toFixed(2));
        } else {
          setUnits(0);
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/${Id}/units`).off('value', onValueChange);
  }, [Id]);

  const onSwitchOffPressed = async () => {
    // console.warn('onSwitchOffPressed');
    let live = switchData[0]['Live'];
    let name = switchData[0]['Name'];
    let onOff = true;
    let ans = 'on';
    if (live == 'on') {
      ans = 'off';
      onOff = false;
    }
    db.collection('switches')
      .doc(id)
      .update({
        Live: onOff,
      })
      .then(() => {
        let reply = 'Switch ' + name + ' is turned ' + ans;
        Alert.alert('Success', reply);
        setFetch(!fetch);
      })
      .catch(err => {
        Alert.alert('Error', err.message);
      });
  };
  const onProfilePressed = () => {
    navigation.openDrawer();
  };
  const onDeleteSwitchPressed = () => {
    setVis(true);
    // console.warn('onDeleteSwitchPressed');
  };
  const onDeletePressed = async data => {
    // console.warn('onDeletePressed');
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const provider = firebase.auth.EmailAuthProvider;
      const authCredential = provider.credential(
        auth().currentUser.email,
        data.password,
      );
      await firebase
        .auth()
        .signInWithCredential(authCredential)
        .then(() => {
          db.collection('switches')
            .doc(Id)
            .update({
              Registered: false,
              Name: 'my switch',
            })
            .then(() => {
              //   console.log('here');
              db.collection('users')
                .where('Id', '==', auth().currentUser.email)
                .get()
                .then(snapshot => {
                  //   console.log('here2');
                  snapshot.docs.forEach(doc => {
                    let new_s_ids = doc.data()['SwitchIds'];
                    console.log(new_s_ids);
                    const result = new_s_ids.filter(checkId);

                    function checkId(id) {
                      return id !== Id;
                    }
                    db.collection('users')
                      .doc(doc.id)
                      .update({
                        SwitchIds: result,
                      })
                      .then(() => {
                        Alert.alert(
                          'Success',
                          'The switch has been deleted successfully. Please sign in again to continue',
                        );
                        setLoading(false);
                        try {
                          auth().signOut();
                          navigation.navigate('Start');
                        } catch (e) {
                          Alert.alert('Error', e.message);
                          setLoading(false);
                        }
                      });
                  });
                })
                .catch(e => {
                  throw e.message;
                  setLoading(false);
                });
            })
            .catch(e => {
              throw e.message;
              setLoading(false);
            });
        })
        .catch(e => {
          throw e.message;
          setLoading(false);
        });
    } catch (err) {
      Alert.alert('Error', err);
      console.log(err);
      setLoading(false);
    }
  };
  const onCancelPressed = () => {
    setVis(false);
  };
  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <CustomButton
          text={auth().currentUser.displayName[0].toUpperCase()}
          onPress={onProfilePressed}
          type="PROFILE"
        />
        <ScrollView showsHorizontalScrollIndicator={false}>
          <Modal transparent={true} visible={vis}>
            <View style={{backgroundColor: '#000000aa', flex: 1}}>
              <View
                style={{
                  backgroundColor: '#800000',
                  margin: 50,
                  padding: 20,
                  borderRadius: 10,
                  flex: 1,
                  justifyContent: 'space-evenly',
                }}>
                <Text style={styles.title}>
                  Are you sure that you want to delete this switch?
                </Text>
                <CustomInput
                  name="password"
                  placeholder="Enter Password to confirm"
                  control={control}
                  secureTextEntry
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password should be minimum 8 characters long',
                    },
                  }}
                />
                <CustomButton
                  text={loading ? 'Loading... ' : 'Delete Switch'}
                  onPress={handleSubmit(onDeletePressed)}
                />
                <CustomButton
                  text="Cancel"
                  onPress={onCancelPressed}
                  type="SECONDARY"
                />
              </View>
            </View>
          </Modal>
        </ScrollView>
        {/* <CustomButton
          text={
            switchData.length == 0
              ? 'Loading..'
              : switchData[0]['Live']
              ? 'SWITCH OFF'
              : 'SWITCH ON'
          }
          onPress={onSwitchOffPressed}
          type={
            switchData.length == 0
              ? 'SIGNOUT'
              : switchData[0]['Live']
              ? 'SWITCHOFF'
              : 'SIGNOUT'
          }
        /> */}
        <CustomButton
          text="DELETE SWITCH"
          onPress={onDeleteSwitchPressed}
          type="DELETE"
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}>
        <View
          style={{
            margin: 20,
            marginTop: 10,
            // marginRight: 0,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 27,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}>
            {switchData.length == 0 ? 'MySwitch' : switchData[0]['Name']}
          </Text>
        </View>
        {/* <CustomButton
          text="DELETE SWITCH"
          onPress={onDeleteSwitchPressed}
          type="DELETE"
        /> */}
      </View>
      <View style={{marginHorizontal: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            flexWrap: 'wrap',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}>
            Voltage-Time Graph
          </Text>
        </View>
        <ScrollView
          horizontal={true}
          contentOffset={{x: 10000, y: 0}}
          showsHorizontalScrollIndicator={false}>
          <LineChart
            data={{
              labels: time,
              datasets: [
                {
                  data: voltage,
                },
              ],
            }}
            width={Dimensions.get('window').width - 40} // from react-native
            // width={Width}
            height={220}
            xLabelsOffset={10}
            // yAxisLabel="Voltage"
            yAxisSuffix="V"
            yAxisInterval={500} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#053275',
              backgroundGradientFrom: '#053275',
              backgroundGradientTo: '#053275',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#327CEB',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </ScrollView>
      </View>

      <View style={{marginHorizontal: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            flexWrap: 'wrap',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}>
            Power-Time Graph
          </Text>
        </View>
        <LineChart
          data={{
            labels: time,
            datasets: [
              {
                data: power,
              },
            ],
          }}
          width={Dimensions.get('window').width - 40} // from react-native
          height={220}
          // yAxisLabel="Voltage"
          yAxisSuffix="W"
          // xAxisLabel="s"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#053275',
            backgroundGradientFrom: '#053275',
            backgroundGradientTo: '#053275',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#327CEB',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}>
        <View style={{alignItems: 'center', margin: 25, marginBottom: 0}}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            VOLTAGE (V)
          </Text>
          <View style={styles.powerDisplay}>
            <TextInput
              value={
                switchData.length == 0
                  ? '0.0'
                  : switchData[0]['Live']
                  ? // ? switchData[0]['Voltage'].toString()
                    volt.toString()
                  : '0.0'
              }
              editable={false}
              style={{color: 'black', fontSize: 15, alignSelf: 'center'}}
            />
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            margin: 25,
            marginTop: 1,
            marginBottom: 0,
          }}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            UNITS
          </Text>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            CONSUMED
          </Text>
          <View style={styles.powerDisplay}>
            <TextInput
              value={
                switchData.length == 0
                  ? '0.0'
                  : switchData[0]['Live']
                  ? // ? switchData[0]['Units Consumed'].toString()
                    units.toString()
                  : '0.0'
              }
              editable={false}
              style={{color: 'black', fontSize: 15, alignSelf: 'center'}}
            />
          </View>
        </View>

        <View style={{alignItems: 'center', margin: 25, marginBottom: 0}}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            CURRENT (A)
          </Text>
          <View style={styles.powerDisplay}>
            <TextInput
              value={
                switchData.length == 0
                  ? '0.0'
                  : switchData[0]['Live']
                  ? // ? switchData[0]['Current'].toString()
                    curr.toString()
                  : '0.0'
              }
              editable={false}
              style={{color: 'black', fontSize: 15, alignSelf: 'center'}}
            />
          </View>
        </View>

        <View style={{alignItems: 'center', margin: 25, marginBottom: 0}}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            POWER(W)
          </Text>
          <View style={styles.powerDisplay}>
            <TextInput
              value={
                switchData.length == 0
                  ? '0.0'
                  : switchData[0]['Live']
                  ? // ? switchData[0]['Power'].toString()
                    pow.toString()
                  : '0.0'
              }
              editable={false}
              style={{color: 'black', fontSize: 15, alignSelf: 'center'}}
            />
          </View>
        </View>

        <View style={{alignItems: 'center', margin: 25, marginBottom: 0}}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            RUNNING
          </Text>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            TIME(h)
          </Text>
          <View style={styles.powerDisplay}>
            <TextInput
              value={
                switchData.length == 0
                  ? '0.0'
                  : switchData[0]['Live']
                  ? // ? switchData[0]['Running Time'].toString()
                    running
                  : '0.0'
              }
              editable={false}
              style={{color: 'black', fontSize: 15, alignSelf: 'center'}}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            height: 55,
            width: 100,
            padding: 12,
            margin: 20,
            alignItems: 'center',
            borderRadius: 15,
            backgroundColor: '#327CEB',
            borderColor: 'white',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: 20,
            }}>
            Back
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  powerDisplay: {
    backgroundColor: 'white',
    height: 40,
    width: 122,
    marginVertical: 8,
  },
  root: {
    alignItems: 'center',

    // paddingTop: '40%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    margin: 10,
    alignSelf: 'center',
  },
});

export default GraphScreen;
