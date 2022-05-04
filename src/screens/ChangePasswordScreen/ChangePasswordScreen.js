import React, {useState} from 'react'
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import auth from '@react-native-firebase/auth'

const ChangePasswordScreen = () => {
    const navigation = useNavigation()
    const {control, handleSubmit, watch} = useForm()
    const pwd = watch('password')

    const onChangePasswordPressed = data => {
        auth().currentUser.updatePassword(data.password)
        .then(()=>{
            Alert.alert('Success', 'Your password is changed successfully')
        })
        .catch(err => {
            Alert.alert('Error', err.message)
        })
    }
    const onHomePressed = () =>{
        navigation.navigate('Home')
    }
    const onProfilePressed = () => {
        navigation.openDrawer()
    }
    
    return(
        <ScrollView showsHorizontalScrollIndicator={false}>
            <View>
            <CustomButton 
                text={auth().currentUser.displayName[0].toUpperCase()}
                onPress={onProfilePressed}
                type="PROFILE"
            />
            </View>
        <View style={styles.root}>
            <Text style={styles.title}>Let's change your password</Text>
            <CustomInput
                name="password"
                placeholder="Password"
                control={control}
                secureTextEntry
                rules={{
                    required: 'Password is required', 
                    minLength: {
                        value: 8, 
                        message: 'Password should be minimum 8 characters long'
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
                        message: 'Password should be minimum 8 characters long'
                    },
                    validate: value =>
                        value === pwd || 'Password does not match'
                }}
            />
            <CustomButton text="Change Password" onPress={handleSubmit(onChangePasswordPressed)} />
            
            <CustomButton text="Home" onPress={onHomePressed} type="SECONDARY" />
            
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
export default ChangePasswordScreen