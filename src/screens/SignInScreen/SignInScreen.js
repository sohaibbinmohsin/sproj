import React, {useState} from 'react'
import {View, Alert, Text, StyleSheet, useWindowDimensions, ScrollView} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import SocialSignInButton from '../../components/SocialSignInButton'
import { useNavigation } from '@react-navigation/native'
import { useForm} from 'react-hook-form'
import auth from '@react-native-firebase/auth'

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const SignInScreen = () => {
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()
    var switchDisplayArrr = [{"iPower": "1", "onoff": "off", "text": "SWITCH ON"}, {"iPower": "1", "onoff": "on", "text": "SWITCH OFF"}, {"iPower": "1", "onoff": "on", "text": "SWITCH OFF"}]
    const {control, handleSubmit, formState:{errors}} = useForm()

    const onSignInPressed = async data => {
        if(loading){
            return
        }
        setLoading(true)
        try{
            const {email, password} = data
            await auth().signInWithEmailAndPassword(data.email, data.password)
            .then(()=>{
                // if (auth().currentUser.emailVerified){
                //     navigation.navigate('Home')
                // }
                // else{
                //     navigation.navigate('ConfirmEmail')
                // }
                navigation.navigate('Dashboard', {
                    screen: 'HomeScreen',
                    // params: { param1: "foo", param2: "bar" }
                  })
            })
        } catch(e) {
            Alert.alert('Error', e.message)
        }
        setLoading(false)
    }
    const onForgotPasswordPressed = () => {
        navigation.navigate('ForgotPassword')
    }
    const onSignUpPressed = () => {
        navigation.navigate('SignUp')
    }
    return(
        <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.welcome}>Welcome Back!</Text>
            <Text style={styles.title}>Let's Sign You In</Text>
            <CustomInput
                name="email"
                placeholder="Email"
                control={control}
                rules={{ 
                    required: 'Email is required',
                    pattern:{ 
                        value: EMAIL_REGEX,
                        message: "Email is invalid"
                    } 
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
                        value: 3, 
                        message: 'Password should be minimum 3 characters long'
                    }
                }}
            />
            
            <CustomButton text={loading ? "Loading... " : "Sign In"} onPress={handleSubmit(onSignInPressed)} />
            <CustomButton text="Forgot Password" onPress={onForgotPasswordPressed} type="TERTIARY" />

            <SocialSignInButton/>
            <CustomButton text="Don't have an account? Create one" onPress={onSignUpPressed} type="TERTIARY" />
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
    },
    welcome: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        margin: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        margin: 10,
    },
})
export default SignInScreen