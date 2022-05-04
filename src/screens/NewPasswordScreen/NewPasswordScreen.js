import React, {useState} from 'react'
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import { useRoute } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'

const NewPasswordScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {control, handleSubmit, watch} = useForm({defaultValues: {email: route?.params?.email}})

    const onDonePressed = () => {
        navigation.navigate('SignIn')
    }
    const onResendCodePressed = data => {
        auth().sendPasswordResetEmail(data.email)
        .catch(err => {
            Alert.alert('Error', err.message)
        })
    }
    
    return(
        <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Let's reset your password</Text>
            <Text style={styles.para}>A password reset link has been sent to your inbox. After clicking on it, you can change your password. Press Done after your password is reset</Text>
            {/* <CustomInput
                name = 'code'
                control = {control}
                placeholder="Enter your confirmation code"
                rules= {{
                    required: 'Confirmation code is required'
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
                        message: 'Password should be minimum 3 characters long'
                    }
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
                        message: 'Password should be minimum 3 characters long'
                    },
                    validate: value =>
                        value === pwd || 'Password does not match'
                }}
            /> */}

            <CustomButton text="Done" onPress={onDonePressed} />
            
            <CustomButton text="Resend Code" onPress={handleSubmit(onResendCodePressed)} type="SECONDARY" />
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
export default NewPasswordScreen