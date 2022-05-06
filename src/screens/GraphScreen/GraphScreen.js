import React, {useState} from 'react'
import { Alert, Text, View, StyleSheet } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form'
import auth from '@react-native-firebase/auth'
import { useRoute } from '@react-navigation/native'

const GraphScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {control, handleSubmit} = useForm({defaultValues: {email: route?.params?.email, initial: route?.params?.initial}})
    
    const onSwitchOffPressed = async() => {
        console.warn('onSwitchOffPressed')
    }
    const onProfilePressed = () => {
        navigation.openDrawer()
    }
    return(
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomButton 
                text={auth().currentUser.displayName[0].toUpperCase()}
                onPress={onProfilePressed}
                type="PROFILE"
            />
            <CustomButton
                text="SWITCH OFF"
                onPress={onSwitchOffPressed}
                type="SIGNOUT"
            />
        </View>
    )
}

export default GraphScreen