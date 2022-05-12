import React, {useState} from 'react';
import {View, Alert, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';

const AddNewSwitchScreen = ({route}) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();
  const db = firestore();
  const {recieved} = route.params;
  // console.log(recieved);

  const onHomePressed = () => {
    navigation.navigate('Home', {
      switchAdded: true,
    });
  };
  const onProfilePressed = () => {
    // navigation.openDrawer()
    navigation.toggleDrawer();
    // navigation.dispatch(DrawerActions.openDrawer())
  };

  const onAddSwitchPressed = async data => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      // console.log(data.switchid)
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
            .where('Id', '==', data.switchid)
            .get()
            .then(snapshot => {
              if (snapshot.empty) {
                throw 'No such Switch ID exists. Please try again or contact our support team';
              } else {
                snapshot.docs.forEach(doc => {
                  // console.log(doc.data())
                  var switchData = doc.data();
                  if (switchData['Registered']) {
                    throw 'Switch ID is already registered with another user. Please try again or contact our support team';
                  } else {
                    var switchesId = [];
                    var ID = '';

                    db.collection('users')
                      .where('Id', '==', auth().currentUser.email)
                      .get()
                      .then(snapshot => {
                        snapshot.docs.forEach(doc => {
                          // console.log(doc.id)
                          ID = doc.id;
                          // console.log(ID)
                          var val = doc.data();
                          if (val['SwitchIds']) {
                            switchesId = val['SwitchIds'];
                          }
                          // console.log(switchesId)
                          switchesId.push(data.switchid);
                          // console.log(switchesId)
                          db.collection('users')
                            .doc(ID)
                            .update({
                              SwitchIds: switchesId,
                            })
                            .then(() => {
                              db.collection('switches')
                                .doc(data.switchid)
                                .update({
                                  Registered: true,
                                })
                                .then(() => {
                                  db.collection('switches')
                                    .doc(data.switchid)
                                    .update({
                                      Name: data.switchname,
                                    });
                                })
                                .then(() => {
                                  Alert.alert(
                                    'Success',
                                    'Your switch is configured successfully. Please sign in again to continue',
                                  );
                                  setLoading(false);
                                  try {
                                    auth().signOut();
                                    navigation.navigate('Start');
                                  } catch (e) {
                                    Alert.alert('Error', e.message);
                                  }
                                })
                                .catch(err => {
                                  Alert.alert('Error', err.message);
                                  setLoading(false);
                                });
                            })
                            .catch(err => {
                              Alert.alert('Error', err.message);
                              setLoading(false);
                            });
                        });
                      })
                      .catch(err => {
                        Alert.alert('Error', err.message);
                        setLoading(false);
                      });
                  }
                });
              }
            })
            .catch(err => {
              Alert.alert('Error', err);
              setLoading(false);
            });
          // setLoading(false)
        })
        .catch(err => {
          Alert.alert('Error', err.message);
          setLoading(false);
        });
    } catch (e) {
      Alert.alert('Error', e.message);
      // console.log(e.message)
      setLoading(false);
    }
  };
  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <View>
        <CustomButton
          text={auth().currentUser.displayName[0].toUpperCase()}
          onPress={onProfilePressed}
          type="PROFILE"
        />
      </View>
      <View style={styles.root}>
        <Text style={styles.title}>Let's add new switch</Text>
        <CustomInput
          name="switchid"
          placeholder="Switch ID"
          control={control}
          rules={{
            required: 'Switch ID is required',
            minLength: {
              value: 20,
              message: 'Switch ID is 20 characters long',
            },
          }}
        />
        <CustomInput
          name="switchname"
          placeholder="Switch Name"
          control={control}
          rules={{
            required: 'Switch name is required',
            maxLength: {
              value: 9,
              message: 'Switch name should be max 9 characters long',
            },
          }}
        />
        <CustomInput
          name="password"
          placeholder="Password"
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
          text={loading ? 'Loading... ' : 'Add Switch'}
          onPress={handleSubmit(onAddSwitchPressed)}
        />
        <CustomButton text="Home" onPress={onHomePressed} type="SECONDARY" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  },
  text: {
    color: 'white',
    marginVertical: 10,
  },
});
export default AddNewSwitchScreen;
