import React, {useState} from 'react';
import {View, Alert, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButton from '../../components/SocialSignInButton';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const SignUpScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();
  const db = firestore();
  const pwd = watch('password');

  const onRegisterPressed = async data => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then(() => {
          const update = {
            displayName: data.username,
          };
          auth()
            .currentUser.updateProfile(update)
            .then(() => {
              db.collection('users')
                .add({SwitchIds: [], Id: data.email})
                .then(() => {
                  navigation.navigate('ConfirmEmail');
                });
            })
            .catch(err => {
              Alert.alert('Error', err.message);
            });
        })
        .catch(err => {
          Alert.alert('Error', err.message);
        });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };
  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };
  const onTermsofUsePressed = () => {
    console.warn('onTermsOfUsePressed');
  };
  const onPrivacyPolicyPressed = () => {
    console.warn('onPrivacyPolicyPressed');
  };
  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.welcome}>Getting Started!</Text>
        <Text style={styles.title}>Let's create your account</Text>
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
        <CustomInput
          name="email"
          placeholder="Email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: EMAIL_REGEX,
              message: 'Email is invalid',
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
        <CustomInput
          name="repeatpassword"
          placeholder="Repeat Password"
          control={control}
          secureTextEntry
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be minimum 8 characters long',
            },
            validate: value => value === pwd || 'Password does not match',
          }}
        />

        <CustomButton
          text={loading ? 'Loading... ' : 'Register'}
          onPress={handleSubmit(onRegisterPressed)}
        />
        <Text style={styles.text}>
          By resitering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={onTermsofUsePressed}>
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={onPrivacyPolicyPressed}>
            Privacy Policy
          </Text>
        </Text>

        <SocialSignInButton />

        <CustomButton
          text="Have an account? Sign In"
          onPress={onSignInPressed}
          type="TERTIARY"
        />
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
  welcome: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    margin: 10,
  },
});
export default SignUpScreen;
