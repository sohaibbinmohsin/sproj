import React, {useState, useEffect} from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import SwitchButton from '../../components/SwitchButton';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {useRoute} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {setTitle} from '../../redux/actions';

const HomeScreen = ({route}) => {
  // const {title} = useSelector(state => state.userReducer);
  // const dispatch = useDispatch();
  // dispatch(setTitle(auth().currentUser.displayName[0]));
  const navigation = useNavigation();
  //   const route = useRoute();
  const db = firestore();
  // const {control, handleSubmit} = useForm({defaultValues: {email: route?.params?.email, initial: route?.params?.initial, switchDisplayArrr: route?.params?.switchDisplayArrr}})
  var switchesId = [];
  const [sId, setSId] = useState([]);
  var switchData = {};
  let switchDisplayArr1 = [];
  const [switchDisplayArr, setSwitchDisplayArr] = useState([]);
  const [totalUnitsConsumed, setTotalUnitsConsumed] = useState('0.0');
  const [screen, setScreen] = useState(false);
  // setInterval(func, 5000);
  const [rend, setRend] = useState(false);
  const [rend1, setRend1] = useState(false);

  auth().onAuthStateChanged(user => {
    if (!user) {
      // Alert.alert('Logged Out', 'User has been logged out');
      navigation.navigate('Start');
    }
  });
  const onSignOutPressed = async () => {
    try {
      auth().signOut();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };
  const onProfilePressed = () => {
    navigation.openDrawer();
  };
  const addNewSwitch = () => {
    // console.warn('add new switch')
    navigation.navigate('Add New Switch');
  };

  useEffect(() => {
    switchDisplayArr1.length = 0;
    db.collection('users')
      .where('Id', '==', auth().currentUser.email)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          if (doc.data()['SwitchIds']) {
            switchesId = doc.data()['SwitchIds'];
            // let sId = doc.data()['SwitchIds'];
            // console.log(sId);
            // setSwitchesId(sId);
            setRend1(!rend1);
            setSId(switchesId);
            switchesId.forEach(id => {
              db.collection('switches')
                .where('Id', '==', id)
                .get()
                .then(snapshot => {
                  snapshot.docs.forEach(doc => {
                    switchData[doc.data()['Id']] = doc.data();
                    var name = doc.data()['Name'];
                    var live = doc.data()['Live'] ? 'on' : 'off';
                    var text = doc.data()['Live'] ? 'SWITCH OFF' : 'SWITCH ON';
                    var ipower = doc.data()['Live']
                      ? doc.data()['Instantaneous Power'].toString() + '.0'
                      : '0.0';
                    let a = {
                      id: doc.data()['Id'],
                      iPower: ipower,
                      onoff: live,
                      text: text,
                      name: name,
                    };
                    switchDisplayArr1.push(a);
                    setSwitchDisplayArr([...switchDisplayArr, a]); //!!!!!!!!!!!!!!!!!
                  });
                  return switchDisplayArr1;
                })
                .then(result => {
                  setSwitchDisplayArr(result);
                  // console.log(switchesId);
                  // totalUnits();
                  // first = true;
                  // setRend(!rend);
                });
              // }
            });
          }
        });
      });

    // console.log('display:', switchDisplayArr);
  }, [rend]);

  // useEffect(() => {
  //   let tu = 0; //total units initialize
  //   console.log('here');
  //   console.log(sId);
  //   sId.forEach(id => {
  //     const onValueChange = database()
  //       .ref(`/${id}/units`)
  //       .on('value', snapshot => {
  //         // console.log('User data: ', snapshot.val());
  //         let u = snapshot.val();
  //         if (u != null) {
  //           tu += u;
  //           setTotalUnitsConsumed(tu.toString());
  //         }
  //         // console.log(voltage);
  //       });

  //     // Stop listening for updates when no longer required
  //     // return () => database().ref(`/${id}/units`).off('value', onValueChange);
  //   });
  // }, [rend1, sId]);

  useEffect(() => {
    const onValueChange = database()
      .ref(`/DDYzQyMthFYFMhKEnAsF/units`)
      .on('value', snapshot => {
        if (snapshot.val() != null) {
          setTotalUnitsConsumed(snapshot.val().toString());
        }
      });

    // Stop listening for updates when no longer required
    return () =>
      database().ref(`/DDYzQyMthFYFMhKEnAsF/units`).off('value', onValueChange);
  }, []);

  // useEffect(() => {
  //   if (first) {
  //     console.log('recounting');
  //     totalUnits();
  //   }
  // }, [rend1]);
  function totalUnits() {
    let total = 0;
    for (let i = 0; i < Object.keys(switchData).length; i++) {
      let u = switchData[switchesId[i]]['Units Consumed'];
      // console.log(a);
      total += u;
    }
    setTotalUnitsConsumed(total.toString());
  }

  const onOnOnffPressed = (live, id, name) => {
    // console.warn('onOnOnffPressed');
    let onOff = true;
    let onoff1 = 1;
    let ans = 'on';
    if (live == 'on') {
      ans = 'off';
      onOff = false;
      onoff1 = 0;
    } else {
      onoff1 = 1;
    }
    db.collection('switches')
      .doc(id)
      .update({
        Live: onOff,
      })
      .then(() => {
        database()
          .ref(`/${id}`)
          .update({
            Live: onoff1,
          })
          .then(() => {
            // console.log('Data updated.');
            let reply = 'Switch ' + name + ' is turned ' + ans;
            Alert.alert('Success', reply);
            setRend(!rend);
          })
          .catch(err => {
            Alert.alert('Error', err.message);
          });
      })
      .catch(err => {
        Alert.alert('Error', err.message);
      });
  };

  const onGraphPressed = id => {
    setScreen(!screen);
    navigation.navigate('Graph', {Id: id, change: screen});
  };

  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <CustomButton
          text={auth().currentUser.displayName[0].toUpperCase()}
          // text={title.toUpperCase()}
          onPress={onProfilePressed}
          type="PROFILE"
        />
        <CustomButton
          text="SIGN OUT"
          onPress={onSignOutPressed}
          type="SIGNOUT"
        />
      </View>
      <View style={{marginTop: 10}}>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          TOTAL UNITS
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          CONSUMED
        </Text>
        <View style={styles.container}>
          <TextInput
            value={totalUnitsConsumed}
            editable={false}
            style={{color: 'black', fontSize: 18, alignSelf: 'center'}}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}>
        {switchDisplayArr.map(buttonInfo => {
          // console.log('button', buttonInfo);
          return (
            <SwitchButton
              key={Math.floor(Math.random() * 1100000000)}
              id={buttonInfo.id}
              iPower={buttonInfo.iPower}
              onoff={buttonInfo.onoff}
              text={buttonInfo.text}
              name={buttonInfo.name}
              onPress1={() => onGraphPressed(buttonInfo.id)}
              onPress2={() =>
                onOnOnffPressed(
                  buttonInfo.onoff,
                  buttonInfo.id,
                  buttonInfo.name,
                )
              }
            />
          );
        })}
        <Pressable
          onPress={addNewSwitch}
          style={{
            height: 165,
            width: 150,
            borderRadius: 14,
            margin: 20,
            backgroundColor: '#327ceb',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white',
              alignSelf: 'center',
              marginTop: 70,
            }}>
            NEW SWITCH
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 40,
    width: 122,
    borderRadius: 14,
    alignSelf: 'center',

    paddingHorizontal: 20,
    marginVertical: 6,
  },
});

export default HomeScreen;
