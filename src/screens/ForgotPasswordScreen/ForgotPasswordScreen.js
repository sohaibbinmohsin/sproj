import React, {useState} from 'react'
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import auth from '@react-native-firebase/auth'

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const ForgotPasswordScreen = () => {
    const navigation = useNavigation()
    const {control, handleSubmit} = useForm()

    const onSendPressed = data => {
        const email = data.email
        auth().sendPasswordResetEmail(data.email)
        .then(()=>{
            navigation.navigate('NewPassword', {email})
        })
        .catch(err => {
            Alert.alert('Error', err.message)
        })
    }
    const onBackToSignInPressed = () =>{
        navigation.navigate('SignIn')
    }
    
    return(
        <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Reset your password</Text>
            <CustomInput 
                name="email"
                control={control}
                placeholder="Enter your email"
                rules={{
                    required: 'Email is required',
                    pattern:{ 
                        value: EMAIL_REGEX,
                        message: "Email is invalid"
                    }
                }}
            />

            <CustomButton text="Send" onPress={handleSubmit(onSendPressed)} />
            
            <CustomButton text="Back to Sign In" onPress={onBackToSignInPressed} type="TERTIARY" />
            
        </View>
        </ScrollView>
    )
}

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
        fontWeight: 'bold'
    }
})
export default ForgotPasswordScreen