import React, {useState} from 'react'
import {View, Alert, Text, StyleSheet, useWindowDimensions, ScrollView} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import { useRoute } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'

const ConfirmEmailScreen = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const {control, handleSubmit} = useForm({defaultValues: {email: route?.params?.email}})
    const onDonePressed = () => {
        navigation.navigate('SignIn')
    }
    const emailSent = () => {
        auth().currentUser.sendEmailVerification()
        .then(()=>{
            console.log('Email being sent!')
        })
        .catch(err => {
            Alert.alert('Error', err.message)
        })
    }
    emailSent()
    const onResendEmailPressed = () => {
        auth().currentUser.sendEmailVerification()
        .catch(err => {
            Alert.alert('Error', err.message)
        })
    }
    
    return(
        <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Let's verify your email</Text>
            <Text style={styles.title}>{auth().currentUser.email}</Text>
            <Text style={styles.para}>A verification link has been sent to your inbox. Once you have verified your email, press Done below</Text>
            {/* <CustomInput 
                name= "code"
                control={control}
                placeholder="Enter your confirmation code"
                rules= {{
                    required: 'Confirmation code is required'
                }}
            /> */}

            <CustomButton text="Done" onPress={handleSubmit(onDonePressed)} />
            
            <CustomButton text="Resend Email" onPress={onResendEmailPressed} type="SECONDARY" />
            {/* <CustomButton text="Back to Sign In" onPress={onBackToSignInPressed} type="TERTIARY" /> */}
            
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
    email: {
        fontSize: 23,
        fontWeight: 'italic',
        color: 'white',
        margin: 10,
    },
    para: {
        fontSize: 22,
        // fontWeight: 'bold',
        color: 'white',
        margin: 10,
        alignSelf: 'center',
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
export default ConfirmEmailScreen