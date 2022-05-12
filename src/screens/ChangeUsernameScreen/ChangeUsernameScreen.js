import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
// import {useSelector, useDispatch} from 'react-redux';
// import {setTitle} from '../../redux/actions';

const ChangeUsernameScreen = () => {
  //   const {title} = useSelector(state => state.userReducer);
  //   const dispatch = useDispatch();

  const navigation = useNavigation();
  const {control, handleSubmit} = useForm();
  const [userInitial, setUserInitial] = useState(
    auth().currentUser.displayName[0],
  );

  const onChangeUsernamePressed = data => {
    const update = {
      displayName: data.username,
    };
    auth()
      .currentUser.updateProfile(update)
      .then(() => {
        Alert.alert(
          'Success',
          'Your username is changed successfully. Please sign in again to continue',
        );
        setUserInitial(auth().currentUser.displayName[0]);
        try {
          auth()
            .signOut()
            .then(() => navigation.navigate('Start'));
        } catch (e) {
          Alert.alert('Error', e.message);
        }
        // dispatch(setTitle(auth().currentUser.displayName[0]));
      })
      .catch(err => {
        Alert.alert('Error', err.message);
      });
  };
  const onHomePressed = () => {
    navigation.navigate('Home');
  };
  const onProfilePressed = () => {
    navigation.openDrawer();
  };

  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <View>
        <CustomButton
          text={userInitial.toUpperCase()}
          //   text={title.toUpperCase()}
          onPress={onProfilePressed}
          type="PROFILE"
        />
      </View>
      <View style={styles.root}>
        <Text style={styles.title}>Let's change your username</Text>
        <CustomInput
          name="username"
          placeholder="Username"
          control={control}
          rules={{
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username should be minimum 3 characters long',
            },
            maxLength: {
              value: 24,
              message: 'Username should be max 24 characters long',
            },
          }}
        />
        <CustomButton
          text="Change Username"
          onPress={handleSubmit(onChangeUsernamePressed)}
        />

        <CustomButton text="Home" onPress={onHomePressed} type="SECONDARY" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
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
  link: {
    color: '#053275',
    fontWeight: 'bold',
  },
});
export default ChangeUsernameScreen;
