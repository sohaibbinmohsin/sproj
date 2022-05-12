import React, {useState, useEffect} from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useForm} from 'react-hook-form';
import {firebase} from '@react-native-firebase/auth';

const GraphScreen = ({route}) => {
  const navigation = useNavigation();
  const db = firestore();
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();
  const {Id} = route.params;
  const [switchData, setSwitchData] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [vis, setVis] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    db.collection('switches')
      .where('Id', '==', Id)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          let d = [];
          d.push(doc.data());
          setSwitchData(d);
        });
      })
      .catch(err => Alert.alert('Error', err.message));
  }, [Id, fetch]);

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
    console.warn('onDeletePressed');
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}>
        <View style={{alignItems: 'center', margin: 25}}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            VOLTAGE (V)
          </Text>
          <View style={styles.powerDisplay}>
            <TextInput
              value={
                switchData.length == 0
                  ? '0.0'
                  : switchData[0]['Live']
                  ? switchData[0]['Voltage'].toString()
                  : '0.0'
              }
              editable={false}
              style={{color: 'black', fontSize: 18, alignSelf: 'center'}}
            />
          </View>
        </View>

        <View style={{alignItems: 'center', margin: 25, marginTop: 1}}>
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
                  ? switchData[0]['Units Consumed'].toString()
                  : '0.0'
              }
              editable={false}
              style={{color: 'black', fontSize: 18, alignSelf: 'center'}}
            />
          </View>
        </View>

        <View style={{alignItems: 'center', margin: 25}}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            CURRENT (A)
          </Text>
          <View style={styles.powerDisplay}>
            <TextInput
              value={
                switchData.length == 0
                  ? '0.0'
                  : switchData[0]['Live']
                  ? switchData[0]['Current'].toString()
                  : '0.0'
              }
              editable={false}
              style={{color: 'black', fontSize: 18, alignSelf: 'center'}}
            />
          </View>
        </View>

        <View style={{alignItems: 'center', margin: 25}}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            POWER
          </Text>
          <View style={styles.powerDisplay}>
            <TextInput
              value={
                switchData.length == 0
                  ? '0.0'
                  : switchData[0]['Live']
                  ? switchData[0]['Power'].toString()
                  : '0.0'
              }
              editable={false}
              style={{color: 'black', fontSize: 18, alignSelf: 'center'}}
            />
          </View>
        </View>

        <View style={{alignItems: 'center', margin: 25}}>
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
                  ? switchData[0]['Running Time'].toString()
                  : '0.0'
              }
              editable={false}
              style={{color: 'black', fontSize: 18, alignSelf: 'center'}}
            />
          </View>
        </View>
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
