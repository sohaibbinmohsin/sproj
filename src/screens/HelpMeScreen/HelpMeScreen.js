import React from 'react'
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const HelpMeScreen = () => {
    const navigation = useNavigation()
    const {control, handleSubmit, reset} = useForm()
    const db = firestore()

    const onHomePressed = () =>{
        navigation.navigate('Home')
    }
    const onProfilePressed = () => {
        navigation.openDrawer()
    }
    const onSendMessagePressed = data => {
        const options = {
            username: auth().currentUser.displayName,
            email: auth().currentUser.email,
            subject: data.subject, 
            query: data.message,
        }
        db.collection('queries').add(options).then(()=>{
            Alert.alert('Submitted', 'We have received your query. We will get intouch with you soon!')
        }).catch(err => {
            Alert.alert('Error', err.message)
        })
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
            <Text style={styles.title}>How can we help you?</Text>
            <CustomInput
                name="subject"
                placeholder="Subject"
                control={control}
                rules={{
                    required: 'Subject is required',
                    minLength: {
                        value: 3, 
                        message: 'Subject should be minimum 3 characters long'
                    }
                }}
            />
            <CustomInput
                name="message"
                placeholder="Message"
                type='MESSAGE'
                control={control}
                rules={{
                    required: 'Message is required',
                    minLength: {
                        value: 10, 
                        message: 'Message should be minimum 10 characters long'
                    }
                }}
                multiline={true}
            />
            <CustomButton text="Send Message" onPress={handleSubmit(onSendMessagePressed)} />
            
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
})

export default HelpMeScreen