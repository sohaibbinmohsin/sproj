import React, {useState} from 'react'
import { Alert, Text, View, StyleSheet } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form'
import auth from '@react-native-firebase/auth'
import { useRoute } from '@react-navigation/native'

const HomeScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {control, handleSubmit} = useForm({defaultValues: {email: route?.params?.email, initial: route?.params?.initial}})
    
    auth().onAuthStateChanged(user => {
        if(!user){
            Alert.alert('Logged Out', 'User has been logged out')
            navigation.navigate('Start')
        }
      })
    const onSignOutPressed = async() => {
        try{
            auth().signOut()
        } catch(e){
            Alert.alert('Error', e.message)
        }
    }
    const onProfilePressed = () => {
        navigation.openDrawer()
    }
    return(
        <View style={{flexDirection: 'row'}}>
            <CustomButton 
                text={auth().currentUser.displayName[0].toUpperCase()}
                onPress={onProfilePressed}
                type="PROFILE"
            />
            <CustomButton
                text="SIGN OUT"
                onPress={onSignOutPressed}
                type="SIGNOUT"
            />
        </View>
    )
}

export default HomeScreen